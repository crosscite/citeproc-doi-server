/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */



tinymce.PluginManager.add('citesupport', function(editor) {

	//selectedElm = selection.getNode();

    "use strict";

    /**
     * citesupport - Citation support for xHTML documents
     *
     * An es6 class object that provides support for dynamic citation
     * management similar to that found in reference managers (Zotero,
     * Mendeley, EndNote, Citavi, Papers2 etc.)
     *
     * Here are some notes on things relevant to deployment:
     *
     * - The class should be instantiated as `citesupport`. The event
     *   handlers expect the class object to be available in global
     *   context under that name.
     *
     * - If `config.demo` is `true`, the stored object `citationIdToPos`
     *   maps citationIDs to the index position of fixed "pegs" in the
     *   document that have class `citeme`. In the demo, this map is
     *   stored in localStorage, and is used to reconstruct the document
     *   state (by reinserting `class:citation` span tags) on page reload.
     *
     * - If `config.demo` is `false`, the document is assumed to contain
     *   `class:citation` span tags, and operations on `citeme` nodes will
     *   not be performed. In non-demo mode, `citationIdToPos` carries
     *   the index position of citation nodes for good measure, but the
     *   mapping is not used for anything.
     *
     * - The `spoofDocument()` function brings citation data into memory.
     *   In the demo, this data is held in localStorage, and
     *   `spoofDocument()` performs some sanity checks on data and
     *   document. For a production deployment, this is the place for code
     *   that initially extracts citation data the document (if, for example,
     *   it is stashed in data-attributes on citation nodes).
     *
     * - The `setCitations()` function is where citation data for individual
     *   citations would be saved, at the location marked by NOTE.
     *
     * - The user-interface functions `buildStyleMenu()` and
     *   `citationWidget()` are simple things cast for the demo, and
     *   should be replaced with something a bit more functional.
     *
     * - The `SafeStorage` class should be replaced (or subclassed?) for
     *   deployment with a class that provides the same methods. If
     *   the citation objects making up `citationByIndex` are stored
     *   directly on the `class:citation` span nodes, the getter for
     *   that value should harvest the values from the nodes, and
     *   store them on `config.citationByIndex`. The setter should
     *   set `config.citationByIndex` only, relying on other code
     *   to update the node value.
     *   
     * - Probably some other stuff that I've overlooked.
     */


    function CiteSupport(editor) {
        this.editor = editor;
        this.config = {
            debug: true,
            mode: 'note',
            defaultLocale: 'en-US',
            defaultStyle: 'american-medical-association',
            citationIdToPos: {},
            citationByIndex: [],
            processorReady: false,
            demo: true
        };
        var me = this;
        this.worker = new Worker('_static/js/citeworker.js');
        this.worker.onmessage = function(e) {
            switch(e.data.command) {
                /**
                 * In response to `callInitProcessor` request, refresh
                 *   `config.mode`, and document citations (if any)
                 *   and document bibliography (if any).
                 *
                 * @param {string} xclass Either `note` or `in-text` as a string
                 * @param {Object[]} rebuildData Array of elements with the form `[citationID, noteNumber, citeString]`
                 * @param {Object[]} bibliographyData Array of serialized xHTML bibliography entries
                 */
            case 'initProcessor':
                me.debug('initProcessor()');
                me.config.mode = e.data.xclass;
                me.config.citationByIndex = e.data.citationByIndex;
                var citationData = me.convertRebuildDataToCitationData(e.data.rebuildData);
                me.setCitations(me.config.mode, citationData);
                me.setBibliography(e.data.bibliographyData);
                me.config.processorReady = true;
                break;
                /**
                 * In response to `callRegisterCitation`, refresh `config.citationByIndex`,
                 *   set citations that require update in the document, replace
                 *   the bibliography in the document, and save the `citationByIndex` array
                 *   for persistence.
                 *
                 * @param {Object[]} citationByIndex Array of registered citation objects
                 * @param {Object[]} citationData Array of elements with the form `[noteNumber, citeString]`
                 * @param {Object[]} bibliographyData Array of serialized xHTML bibliography entries
                 */
            case 'registerCitation':
                me.debug('registerCitation()');
                me.config.citationByIndex = e.data.citationByIndex;
                // setCitations() implicitly updates this.config.citationIDs
                me.setCitations(me.config.mode, e.data.citationData, true);
                me.setBibliography(e.data.bibliographyData);
                me.config.processorReady = true;
                break;
            }
        }
    }

    /**
     * Logs messages to the console if `config.debug` is true
     * @param  {string} txt The message to log
     * @return {void}
     */
    CiteSupport.prototype.debug = function(txt) {
        if (this.config.debug) {
            console.log('*** ' + txt);
        }
    }

    /**
     * Initializes the processor, optionally populating it with a
     *   preexisting list of citations.
     *
     * @param {string} styleName The ID of a style
     * @param {string} localeName The ID of a locale
     * @param {Object[]} citationByIndex An array of citation objects with citationIDs
     * @return {void}
     */
    CiteSupport.prototype.callInitProcessor = function(styleName, localeName, citationByIndex) {
        this.debug('callInitProcessor()');
        this.config.processorReady = false;
        if (!citationByIndex) {
            citationByIndex = [];
        }
        this.worker.postMessage({
            command: 'initProcessor',
            styleName: styleName,
            localeName: localeName,
            citationByIndex: citationByIndex
        });
    }

    /**
     * Registers a single citation in the processor to follow
     *   citations described by `preCitations` and precede those
     *   described in `postCitations`.
     *
     * @param {Object{}} citation A citation object
     * @param {Object[]} preCitations An array of `[citationID, noteNumber]` pairs in document order
     * @param {Object[]} postCitations An array of `[citationID, noteNumber]` pairs in document order
     * @return {void}
     */
    CiteSupport.prototype.callRegisterCitation = function(citation, preCitations, postCitations) {
        if (!this.config.processorReady) return;
        this.debug('callRegisterCitation() ('+citation+") ("+JSON.stringify(preCitations)+") ("+JSON.stringify(postCitations)+")");
        this.config.processorReady = false;
        this.worker.postMessage({
            command: 'registerCitation',
            citation: citation,
            preCitations: preCitations,
            postCitations: postCitations
        });
    }

    /**
     * Converts the array returned by the processor `rebuildProcessor()` method
     * to the form digested by our own `setCitations()` method.
     *
     * rebuildData has this structure:
     *    [<citation_id>, <note_number>, <citation_string>]
     *
     * setCitations() wants this structure:
     *    [<citation_index>, <citation_string>, <citation_id>]
     * 
     * @param {Object[]} rebuildData An array of values for insertion of citations into a document
     * @return {Object[]}
     */
    CiteSupport.prototype.convertRebuildDataToCitationData = function(rebuildData) {
        if (!rebuildData) return;
        this.debug('convertRebuildDataToCitationData()');
        var citationData = rebuildData.map(function(obj){
            return [0, obj[2], obj[0]];
        })
        for (var i = 0, ilen = citationData.length; i < ilen; i++) {
            citationData[i][0] = i;
        }
        return citationData;
    }

    /**
     * Update all citations based on data returned by the processor.
     * The update has two effects: (1) the id of all in-text citation
     * nodes is set to the processor-assigned citationID; and (2)
     * citation texts are updated. For footnote styles, the footnote
     * block is regenerated from scratch, using hidden text stored
     * in the citation elements.
     * 
     * @param {string} mode The mode of the current style, either `in-text` or `note`
     * @param {Object[]} data An array of elements with the form `[citationIndex, citationText, citationID]`
     * @return {void}
     */
    CiteSupport.prototype.setCitations = function(mode, data) {
        this.debug('setCitations()');

        var doc = this.editor.getDoc();

        // Before anything, make sure that footnote, bibligraphy and data
        // blocks actually exist.
        var body = this.editor.getBody();
        var footnoteContainer = doc.getElementById('footnote-container');
        var bibliographyContainer = doc.getElementById('bibliography-container');
        var citesupportDataContainer = doc.getElementById('citesupport-data-container');
        if (!bibliographyContainer) {
            var bibBlock = doc.createElement('div');
            bibBlock.setAttribute('id', 'bibliography-container');
            bibBlock.classList.add('mceNonEditable');
            bibBlock.setAttribute('contenteditable', "false");
            bibBlock.hidden = true;
            bibBlock.innerHTML = '<h2>Bibliography</h2><div id="bibliography"></div>'
            body.appendChild(bibBlock);
        }
        if (!footnoteContainer) {
            var footBlock = doc.createElement('div');
            footBlock.setAttribute('id', 'footnote-container');
            footBlock.classList.add('mceNonEditable');
            footBlock.setAttribute('contenteditable', "false");
            footBlock.hidden = true;
            footBlock.innerHTML = '<div class="footnote-header"><b>Footnotes</b></div><div id="footnotes"></div>';
            body.insertBefore(footBlock, bibBlock);
        }
        if (!citesupportDataContainer) {
            var dataBlock = doc.createElement('div');
            dataBlock.setAttribute('id', 'citesupport-data-container');
            dataBlock.classList.add('mceNonEditable');
            dataBlock.setAttribute('contenteditable', "false");
            dataBlock.hidden = true;
            body.appendChild(dataBlock);
            citesupportDataContainer = doc.getElementById('citesupport-data-container');
        }

        // Assure that every single citation node has citationID
        var citationNodes = this.pruneNodeList(doc.getElementsByClassName('citation'));
        for (var i = 0, ilen = data.length; i < ilen; i++) {
            var pos = data[i][0];
            var citationNode = citationNodes[pos];
            var citationID = this.config.citationByIndex[pos].citationID;
            if (!citationNode.hasAttribute('id') || citationNode.getAttribute('id') !== citationID) {
                citationNode.setAttribute('id', citationID);
            }
        }
        // Update citationIdToPos for all nodes
        var citationNodes = this.pruneNodeList(doc.getElementsByClassName('citation'));
        for (var i = 0, ilen = citationNodes.length; i < ilen; i++) {
            var citationID = citationNodes[i].getAttribute('id');
            this.config.citationIdToPos[citationID] = i;
        }
        // Update data on all nodes in the return
        for (var i = 0, ilen = data.length; i < ilen; i++) {
            var dataNode = doc.getElementById('csdata-' + data[i][2]);
            if (!dataNode) {
                dataNode = doc.createElement('div');
                dataNode.setAttribute('id', 'csdata-' + data[i][2]);
                dataNode.classList.add('citation-data');
                var inlineData = btoa(JSON.stringify(this.config.citationByIndex[this.config.citationIdToPos[data[i][2]]]));
                dataNode.innerHTML = inlineData;
                citesupportDataContainer.appendChild(dataNode);
            } else {
                var inlineData = btoa(JSON.stringify(this.config.citationByIndex[this.config.citationIdToPos[data[i][2]]]));
                dataNode.innerHTML = inlineData;
            }
        }
        
        /*
         * Pseudo-code
         *
         * (1) Open a menu at current document position.
         *   (a) Set a class:citation span placeholder if necessary.
         *   (b) Hang menu off of class:citation span.
         * (2) Perform click-handler from menu, which:
         *   * If no citationID on class:citation span ...
         *      ... and empty menu: just deletes the node.
         *      ... and menu content: file request w/empty citationID
         *   * If has citationID on class:citation span ...
         *      ... and empty menu, then ...
         *           ... if now no citations, file init request.
         *           ... if still citations, refile 1st citation.
         *      ... and menu content: file request w/citationID
         */

        if (mode === 'note') {
            var footnoteContainer = doc.getElementById('footnote-container');
            if (data.length) {
                footnoteContainer.hidden = false;
            } else {
                footnoteContainer.hidden = true;
            }
            for (var i = 0, ilen = data.length; i < ilen; i++) {
                // Get data for each cite for update (ain't pretty)
                var tuple = data[i];
                var citationID = tuple[2];
                var citationNode = doc.getElementById(citationID);
                var citationText = tuple[1];
                var citationIndex = tuple[0];
                var footnoteNumber = (citationIndex + 1);

                // The footnote update is tricky and hackish because
                // HTML has no native mechanism for binding
                // footnote markers to footnotes proper.
                //
                //   (1) We write the citationText in a hidden sibling to
                // the in-text note number. This gives us a persistent
                // record of the footnote text.
                //
                //   (2) We then (later) iterate over the citation
                // nodes to regenerate the footnote block from scratch.
                citationNode.innerHTML = '<span class="footnote-mark">' + footnoteNumber + '</span><span hidden="true">' + citationText + '</span>';
            }
            // Reset the number on all footnote markers
            // (the processor does not issue updates for note-number-only changes)
            var footnoteMarkNodes = doc.getElementsByClassName('footnote-mark');
            for (var i = 0, ilen = footnoteMarkNodes.length; i < ilen; i++) {
                var footnoteMarkNode = footnoteMarkNodes[i];
                footnoteMarkNode.innerHTML = (i + 1);
            }
            // Remove all footnotes
            var footnotes = doc.getElementById('footnotes');
            for (var i = footnotes.childNodes.length - 1; i > -1; i--) {
                footnotes.removeChild(footnotes.childNodes[i]);
            }
            // Regenerate all footnotes from hidden texts
            var citationNodes = this.pruneNodeList(doc.getElementsByClassName('citation'));
            for (var i = 0, ilen = citationNodes.length; i < ilen; i++) {
                var footnoteText = citationNodes[i].childNodes[1].innerHTML;
                var footnoteNumber = (i + 1);
                var footnote = doc.createElement('p');
                footnote.classList.add('footnote');
                footnote.innerHTML = '<span class="footnote"><span class="footnote-number">' + footnoteNumber + '</span><span class="footnote-text">' + footnoteText + '</span></span>';
                footnotes.appendChild(footnote);
            }
        } else {
            var footnoteContainer = doc.getElementById('footnote-container');
            footnoteContainer.hidden = true;
            for (var i = 0, ilen = data.length; i < ilen; i++) {
                var tuple = data[i];
                var citationID = tuple[2];
                var citationNode = doc.getElementById(citationID);
                var citationText = tuple[1];
                citationNode.innerHTML = citationText;
            }
        }
    }

    /**
     * Replace bibliography with xHTML returned by the processor.
     *
     * @param {Object[]} data An array consisting of [0] an object with style information and [1] an array of serialized xHMTL bibliography entries.
     */
    CiteSupport.prototype.setBibliography = function(data) {
        this.debug('setBibliography()');
        var doc = this.editor.getDoc();
        var body = this.editor.getBody();
        var bibContainer = doc.getElementById('bibliography-container');
        if (!data || !data[1] || data[1].length === 0) {
            bibContainer.hidden = true;
            return;
        };
        var bib = doc.getElementById('bibliography');
        bib.setAttribute('style', 'visibility: hidden;');
        // If bib is not hidden on transition, container width
        // can be wildly exaggerated on mobile Safari.
        bibContainer.hidden = true;
        bib.innerHTML = data[1].join('\n');
        var entries = doc.getElementsByClassName('csl-entry');
        if (data[0].hangingindent) {
            for (var i = 0, ilen = entries.length; i < ilen; i++) {
                var entry = entries[i];
                entry.setAttribute('style', 'padding-left: 1.3em;text-indent: -1.3em;');
            }
            bibContainer.hidden = false;
            bib.setAttribute('style', 'visibility: visible;');
        } else if (data[0]['second-field-align']) {
            var offsetSpec = 'padding-right:0.3em;';
            if (data[0].maxoffset) {
                offsetSpec = 'width: ' + ((data[0].maxoffset/2)+0.75) + 'em;';
            }
            for (var i = 0, ilen = entries.length; i < ilen; i++) {
                var entry = entries[i];
                entry.setAttribute('style', 'white-space: nowrap;');
            }
            var numbers = doc.getElementsByClassName('csl-left-margin');
            for (var i = 0, ilen = numbers.length; i < ilen; i++) {
                var number = numbers[i];
                number.setAttribute('style', 'display:inline-block;vertical-align:top;' + offsetSpec);
            }
            if (data[0].maxoffset) {
                // cheat
                var widthSpec = '';
                var texts = doc.getElementsByClassName('csl-right-inline');
                var containerWidth = document.getElementById('mce_0_ifr').offsetWidth;
                var numberWidth = (data[0].maxoffset*(90/9));
                widthSpec = 'width:' + (containerWidth-numberWidth-20) + 'px;';
                for (var i = 0, ilen = texts.length; i < ilen; i++) {
                    var text = texts[i];
                    text.setAttribute('style', 'display: inline-block;white-space: normal;' + widthSpec);
                }
                bibContainer.hidden = false;
                bib.setAttribute('style', 'visibility: visible;');
            } else {
                bibContainer.hidden = false;
                bib.setAttribute('style', 'visibility: visible;');
            }
        } else {
            bibContainer.hidden = false;
            bib.setAttribute('style', 'visibility: visible;');
        }
    }
    
    CiteSupport.prototype.pruneNodeList = function(nodeList) {
        var retList = [];
        for (var i = 0, ilen = nodeList.length; i < ilen; i++) {
            if (nodeList[i].parentNode.classList.contains('mce-offscreen-selection')) {
                continue;
            }
            retList.push(nodeList[i]);
        }
        return retList;
    }

    /**
     * Replace citation span nodes and get ready to roll. Puts
     *   document into the state it would have been in at first
     *   opening had it been properly saved.
     *
     * @return {void}
     */
    CiteSupport.prototype.spoofDocument = function() {
        this.debug('spoofDocument()');
        var doc = this.editor.getDoc();
        
        // Use stored style if available
        var styleContainer = doc.getElementById('citesupport-style-container');
        if (styleContainer) {
            this.config.defaultStyle = styleContainer.innerHTML;
        }
        
        // Initialize array and object
        this.config.citationByIndex = [];
        this.config.citationIdToPos = {};
        
        // Get citation nodes
        var citationNodes = this.pruneNodeList(doc.getElementsByClassName('citation'));
        
        // Build citationByIndex
        var offset = 0;
        var dataContainer = doc.getElementById('citesupport-data-container');
        if (dataContainer) {
            for (var i = citationNodes.length - 1; i > -1; i--) {
                var citationNode = citationNodes[i];
                var citationID = citationNode.id;
                var citationDataNode = doc.getElementById('csdata-' + citationID);
                if (citationDataNode) {
                    var citation = JSON.parse(atob(citationDataNode.innerHTML));
                    if (this.config.mode === 'note') {
                        citation.properties.noteIndex = (i + offset + 1);
                    } else {
                        citation.properties.noteIndex = 0;
                    }
                    this.config.citationByIndex.push(citation);
                } else {
                    citationNode.parentNode.removeChild(citationNode);
                    offset--;
                }
            }
            this.config.citationByIndex.reverse();
        }
        
        // This gives us assurance of one-to-one correspondence between
        // citation nodes and citationByIndex data. The processor
        // and the code for handling its return must cope with possible 
        // duplicate citationIDs in data and node citationIDs.
        
        

    }
    
    /**
     * Function to be run immediately after document has been loaded, and
     *   before any editing operations.
     *
     * @return {void}
     */
    CiteSupport.prototype.initDocument = function() {
        this.debug('initDocument()');
        this.spoofDocument();
        this.callInitProcessor(this.config.defaultStyle, this.config.defaultLocale, this.config.citationByIndex);
    }

    // Maybe for consistency there should be a spoofCitations() method
    // and an initCitations() method here. Would save all of the clutter
    // at the top of setCitation(), which is a little late to be dealing
    // with obvious data/node reconciliation issues.

    CiteSupport.prototype.spoofCitations = function() {
        this.debug('spoofCitations()');
        // Make a pos map
        var doc = this.editor.getDoc();
        var citationIdToPos = {};
        for (var i = 0, ilen = this.config.citationByIndex.length; i < ilen; i++) {
            var citationID = this.config.citationByIndex[i].citationID;
            citationIdToPos[citationID] = i;
        }
        // Step through nodes to build citationByIndex, cloning duplicates and removing nodes for which there is no data
        var citationByIndex = [];
        var citationsSeen = {};
        var offset = 0;
        var citationNodes = this.pruneNodeList(doc.getElementsByClassName('citation'));
        for (var i = 0, ilen = citationNodes.length; i < ilen; i++) {
            var citationNode = citationNodes[i];
            var citationID = citationNode.id;
            if (citationsSeen[citationID]) {
                // Duplicate. Clone citation.
                var citation = JSON.parse(JSON.stringify(this.config.citationByIndex[citationIdToPos[citationID]]));
                citationByIndex.push(citation);
            } else if ("number" !== typeof citationIdToPos[citationID]) {
                var citationDataNode = doc.getElementById('csdata-' + citationID);
                if (citationDataNode) {
                    // Restore data from document record.
                    this.config.citationByIndex.push(JSON.parse(atob(citationDataNode.innerHTML)));
                    citationsSeen[citationID] = true;
                } else {
                    // No data. Just remove node.
                    citationNode.parentNode.removeChild(citationNode);
                    offset--;
                }
            } else {
                // Normal. Push data.
                var citation = this.config.citationByIndex[citationIdToPos[citationID]];
                citationByIndex.push(citation);
                citationsSeen[citationID] = true;
            }
        }
        return citationByIndex;
    }

    //CiteSupport.prototype.initCitations - function() {
    //    this.debug('initCitations()');
    //    spoofCitations();
    //    // ...
    //}

    var citesupport = new CiteSupport(editor);
    this.citesupport = citesupport;

    window.addEventListener('load', function(e){
        citesupport.initDocument();
    });
});


// demo.js
// for citeproc-js CSL citation formatter

// Get the citations that we are supposed to render, in the CSL-json format
var xhr = new XMLHttpRequest();
xhr.open('GET', 'citations.json', false);
xhr.send(null);
var citations = JSON.parse(xhr.responseText);;


// Initialize a system object, which contains two methods needed by the
// engine.
citeprocSys = {
    // Given a language tag in RFC-4646 form, this method retrieves the
    // locale definition file.  This method must return a valid *serialized*
    // CSL locale. (In other words, an blob of XML as an unparsed string.  The
    // processor will fail on a native XML object or buffer).
    retrieveLocale: function (lang){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'locales-' + lang + '.xml', false);
        xhr.send(null);
        return xhr.responseText;
    },

    // Given an identifier, this retrieves one citation item.  This method
    // must return a valid CSL-JSON object.
    retrieveItem: function(id){
        return citations[id];
    }
};

// Given the identifier of a CSL style, this function instantiates a CSL.Engine
// object that can render citations in that style.
function getProcessor(styleID) {
    // Get the CSL style as a serialized string of XML
    var xhr = new XMLHttpRequest();
    xhr.open('GET', styleID + '.csl', false);
    xhr.send(null);
    var styleAsText = xhr.responseText;

    // Instantiate and return the engine
    var citeproc = new CSL.Engine(citeprocSys, styleAsText);
    return citeproc;
};


// This runs at document ready, and renders the bibliography
function renderBib() {
    var bibDivs = document.getElementsByClassName('bib-div');
    for (var i = 0, ilen = bibDivs.length; i < ilen; ++i) {
        var bibDiv = bibDivs[i];
        var citeproc = getProcessor(bibDiv.getAttribute('data-csl'));
        var itemIDs = [];
        for (var key in citations) {
            itemIDs.push(key);
        }
        citeproc.updateItems(itemIDs);
        var bibResult = citeproc.makeBibliography();
        bibDiv.innerHTML = bibResult[1].join('\n');
    }
}

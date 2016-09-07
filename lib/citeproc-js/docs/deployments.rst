=============================
Demo: Standalone Bibliography
=============================

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

This page illustrates a simple deployment that renders a small
bibliography. The original of this example was kindly provided by
`Chris Maloney <https://github.com/Klortho>`_ back when |citeproc-js|
was hosted on BitBucket. I have modified it (very) slightly to
illustrate the use of the Zotero API.

-----------------------
My Amazing Bibliography
-----------------------

|cites-target|
|cites-button|


|more|

--------------
Style and Data
--------------

We're going to need some data. The URL below will pull eight items
from the public library "Pitt-Greensburg English Literature Capstone"
via the Zotero API.

.. code-block:: javascript

   var chosenLibraryItems = "https://api.zotero.org/groups/459003/items?format=csljson&limit=8&itemType=journalArticle";

We're also going to need a style. The slug below is the
machine-readable name of Chicago Full Note (with bibliography). In
this demo we'll use it to fetch the style over the wire, but it
could equally well be embedded in our "application," so we just
note its name here.

.. code-block:: javascript

   var chosenStyleID = "chicago-fullnote-bibliography";

On page load, we fetch the citation data, and parse it into a
JavaScript object.

.. code-block:: javascript

   var xhr = new XMLHttpRequest();
   xhr.open('GET', chosenLibraryItems, false);
   xhr.send(null);
   var citationData = JSON.parse(xhr.responseText);

------------------
Data rearrangement
------------------

The Zotero API delivers citation objects in the CSL JSON format
expected by the processor, but the objects need to be reorganized for
keyed access. We also need an array of the keys. Here we store the
keyed citations as ``citations``, and the array of IDs as ``itemIDs``.

.. code-block:: javascript

   var citations = {};
   var itemIDs = [];
   for (var i=0,ilen=citationData.items.length;i<ilen;i++) {
     var item = citationData.items[i];
     if (!item.issued) continue;
     if (item.URL) delete item.URL;
     var id = item.id;
     citations[id] = item;
     itemIDs.push(id);
   }

------------------
The ``sys`` object
------------------

The processor needs two hook functions, one to acquire arbitrary
locales (``retrieveLocale()``), and another to acquire items by key
(``retrieveItem()``). Locales are identified by their RFC-5646 language
and region. For this demo we'll pull them from a remote repository,
but the files would ordinarily be stored locally.

.. code-block:: javascript

  citeprocSys = {
    retrieveLocale: function (lang){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-' + lang + '.xml', false);
      xhr.send(null);
      return xhr.responseText;
    },
    retrieveItem: function(id){
      return citations[id];
    }
  };

-----------------------
Processor instantiation
-----------------------

We set up a function to instantiate the processor. In this code, we
retrieve the style and locale as serialized XML because it is easy to
do. If the objects were in DOM or E4X format, we could deliver that as
well: the only constraint is that both need to be in the same form.

.. code-block:: javascript

   function getProcessor(styleID) {
     var xhr = new XMLHttpRequest();
     xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl', false);
     xhr.send(null);
     var styleAsText = xhr.responseText;
     var citeproc = new CSL.Engine(citeprocSys, styleAsText);
     return citeproc;
   };

-----------------------
Putting it all together
-----------------------

To generate a bibliography, we grab the processor, set the item IDs on
it, and request bibliography output. The result is a two-element array
composed of a memo object and a list of rendered strings. Joining up
the strings gives us the HTML for inclusion in the page.

.. code-block:: javascript

   function processorOutput() {
     ret = '';
     var citeproc = getProcessor(chosenStyleID);
     citeproc.updateItems(itemIDs);
     var result = citeproc.makeBibliography();
     return result[1].join('\n');
   }



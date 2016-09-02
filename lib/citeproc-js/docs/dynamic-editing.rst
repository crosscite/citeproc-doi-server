=======================
Demo: Dynamic Citations
=======================

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

---------------
Dynamic Editing
---------------

**Style:** |styles|

..
   **Locale:** |locales|

This page demonstrates dynamic citation editing in the browser. The
underlying code was prepared in response to work by `Derek Sifford
<https://github.com/dsifford>`_. Click on the chevrons to open a
citation widget,\ |citeme| select one or more references, and press
"Save" to add them to the document.\ |citeme| Use the pulldown list
above to transform the document to another style.\ |citeme| Click on
the "More" button below for information on running the code locally,
and on adapting it for use in production.\ |citeme|

|footnotes|

|bib|

|more|

---------------
Running locally
---------------

One of the main purposes of this page is to provide a worked example
for developers. A good way to explore the way it all works is to
run the page locally. Here is how to set that up.

^^^^^^^^^^^^
Requirements
^^^^^^^^^^^^

- `git`_
- `node.js`_
- `npm`_
- `Sphinx`_

.. _git: https://git-scm.com/
.. _`node.js`: https://nodejs.org/en/
.. _npm: https://www.npmjs.com/
.. _Sphinx: http://www.sphinx-doc.org/en/stable/

^^^^^^^^^^^
Local setup
^^^^^^^^^^^

Fetch the repo
   Clone the ``citeproc-js`` documentation project and enter
   its top-level directory:

   .. code-block:: bash

      git clone https://github.com/Juris-M/citeproc-js-docs.git --recursive
      cd citeproc-js-docs


Build the docs
   The following command should work:

   .. code-block:: bash

      make html

Run a server using ``node.js``
   The built page uses ``XMLHttpRequest()`` calls, so it must be
   viewed through a web server. To run a simple server using
   ``node.js``, an incantation like this should do the trick:

   .. code-block:: bash

      npm install -g http-server
      http-server _build/html


--------------------
Source File Overview
--------------------

``_static/js/citeproc.js``
   The |citeproc-js| `CSL <https://citationstyles.org>`_ processor.
   Seven years in development, backed up by 1,260 test fixtures and
   1,318 unique citation styles, with extended support for
   multilingual and legal citation.

``_static/js/citeworker.js``
   A web worker implementing the two API calls on which ``citesupport``
   depends.

``_static/js/citesupport-es6.js``
   An ``es6`` class object with DOM logic for dynamic citation editing.
   With some tweaks, this can be run inside a WYSIWYG editor of your
   choice.

``_static/css/screen.css``
   The CSS code for the |citeproc-js| documentation, including
   the demo pages.

``_static/data/items``
   A few sample items for the dynamic editing demo, in CSL JSON format.

``_static/data/locales``
   The `standard CSL locales <https://github.com/citation-style-language/locales>`_.

``_static/data/styles``
   The CSL styles used in the demo. The "JM" styles are from the
   `Juris-M styles repository
   <https://github.com/juris-m/jm-styles>`_, and have modular legal
   style support. The remainder are from the `official CSL repository <https://github.com/citation-style-language/styles/>`_,
   which feeds the `Zotero styles <https://www.zotero.org/styles>`_ distribution site.

``_static/data/juris``
   A set of legal style modules resides here. Legal citation
   support is easily extensible to jurisdictions worldwide
   via the `Juris-M Style Editor <https://juris-m.github.io/editor/>`_
   (GitHub account required).

----------------
Integrator notes
----------------

Here are some notes on things relevant to deployment:

- The class should be instantiated as ``citesupport``. The event
  handlers expect the class object to be available in global
  context under that name.

- If ``config.demo`` is ``true``, the stored object ``citationIdToPos``
  maps citationIDs to the index position of fixed "pegs" in the
  document that have class ``citeme``. In the demo, this map is
  stored in localStorage, and is used to reconstruct the document
  state (by reinserting ``class:citation`` span tags) on page reload.

- If ``config.demo`` is ``false``, the document is assumed to contain
  ``class:citation`` span tags, and operations on ``citeme`` nodes will
  not be performed. In non-demo mode, ``citationIdToPos`` carries
  the index position of citation nodes for good measure, but the
  mapping is not used for anything.

- The ``spoofDocument()`` function brings citation data into memory.
  In the demo, this data is held in localStorage, and
  ``spoofDocument()`` performs some sanity checks on data and
  document. For a production deployment, this is the place for code
  that initially extracts citation data the document (if, for example,
  it is stashed in data-attributes on citation nodes).

- The ``setCitations()`` function is where citation data for individual
  citations would be saved, at the location marked by NOTE.

- The user-interface functions ``buildStyleMenu()`` and
  ``citationWidget()`` are simple things cast for the demo, and
  should be replaced with something a bit more functional.

- The ``SafeStorage`` class should be replaced (or subclassed?) for
  deployment with a class that provides the same methods. If
  the citation objects making up ``citationByIndex`` are stored
  directly on the ``class:citation`` span nodes, the getter for
  that value should harvest the values from the nodes, and
  store them on ``config.citationByIndex``. The setter should
  set ``config.citationByIndex`` only, relying on other code
  to update the node value.
  
- Probably some other stuff that I've overlooked.



----------
Worker API
----------

The heavy lifting is done by the CSL processor, which runs in a
separate thread as a web worker. Only the document-facing interface of
the worker is described here: it should not be necessary to tangle
with the internals of the worker itself. Its only idiosyncracy is that
it assigns note numbers (reflected in the return) in citation
sequence---in contrast to word processor context, it assumes that the
only footnotes in the document are those generated automatically by a
note style. If that is not true in your context, you will want to
disable that behavior, and do whatever is necessary on document side
to extract real note numbers for delivery to the processor.

The worker is controlled by two methods, ``callInitProcessor()`` and
``callRegisterCitation()``, each with a corresponding message and
return event.

``citesupport.callInitProcessor(styleID, localeID)``
   This method is used on page load, on change of style, and when all
   citations have been removed from the document.  The ``styleID``
   argument is mandatory. If ``localeID`` is not provided, the
   processor will be configured with the ``en-US`` locale.

   The ``citesupport.callInitProcessor`` method implicitly accesses the
   ``config.citationByIndex`` array, which must be accessible in page
   context. If the array is empty, the processor will be initialized
   without citations. If the array contains citations, the processor
   will be initialized to that document state, and return an array of
   arrays as ``rebuildData``, for use in reconstructing citations in
   the document text. Each sub-array contains a citation ID, a note
   number, and a citation string. For example, if the ``styleID`` is
   for a ``note`` style, and if ``config.citationByIndex`` yields the
   citations "Wurzel Gummidge (1990)" and "My Aunt Sally (2001)," the
   ``rebuildData`` structure would look like this:

   .. code-block:: javascript

      [
          [
             "lu7Tu3ki",
             "1",
             "Wurzel Gummidge (1990)"
          ],
          [
             "ko4aNoo9",
             "2",
             "My Aunt Sally (2001)"
             
          ]
      ]

``citesupport.callRegisterCitation(citation, preCitations, postCitations)``
   This method is used to add or to edit citations. All three
   arguments are mandatory. ``citation`` is an ordinary citation
   object as described above. ``preCitations`` and ``postCitations``
   are arrays of arrays, in which each sub-array is composed of a
   citation ID and a note number. For example, if a note citation
   is to be inserted between the "Wurzel Gummidge" and "Aunt Sally"
   citations in the example above, these would have the following form:

   .. code-block:: javascript

      preCitations = [
          [
              "lu7Tu3ki",
              "1"
          ]
      ];

      postCitations = [
          [
              "ko4aNoo9",
              "3"
          ]
      ];

   Notice the change to the note number: the processor registers
   note numbers for use in back-references, but maintenance of 
   correct note numbering must be handled in document-side code.

   The ``citesupport.callRegisterCitation`` method returns two values from the
   processor: ``citationByIndex`` (described above) and ``citations``.
   The latter is an array of one or more arrays, each composed of a
   citation position index, a string, and a citation ID. For example,
   the return value to insert a citation "Calvin (1995); Hobbes
   (2016)" between the "Wurzel Gummidge" and "My Aunt Sally" citations
   would look something like this:

   .. code-block:: javascript

      [
         [
             1,
             "Calvin (1995); Hobbes (2016)",
             "Ith7eg8T"
         ]
      ]

   Note that the return value might contain updates for multiple
   citations.

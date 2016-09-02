============
Demo: Editor
============

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

------
Editor
------

|editor|

|more|

---------------
Running locally
---------------

Like the previous page, the main purpose here is to provide a worked
example for developers. A good way to explore the way it all works is
to run the page locally. Here is how to set that up.

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

As this demo is built as a Sphinx page for deployment on ReadTheDocs,
the source files are kind of scattered and mixed. The following list
should help you find the essentials.

``_static/tinymce/js/tinymce/plugins/citesupport.js``
   This is the core plugin for citation support. It spins up a web
   worker (from ``classes/citeworker.js``) that runs ``citeproc.js``
   to handle the actual formatting of citations, and manages page
   updates.

``_static/tinymce/js/tinymce/plugins/citestylemenu.js``
   This supplies a tinyMCE menu for changing citation styles.

``_static/tinymce/js/tinymce/plugins/citeaddedit.js``
   This supplies the primitive citation widget used in the demo
   editor. In production you would obviously want something a
   *little* more sophisticated. This plugin is the place to
   implement that.

``_static/css/screen.css``
   There is some CSS code in here that is relevant to the layout
   of bibliographies and the decoration of citations and footnotes.

``_templates/layout.html``
   Check here (particularly at the bottom of the file) for the
   incantations that bring up tinyMCE with citation support.

``substitutions.txt``
   The placeholder that tinyMCE installs itself to is supplied
   by the "editor" substitution element.

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

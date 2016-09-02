=====================
Running the Processor
=====================

.. include:: substitutions.txt

|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

------------
Introduction
------------

The processor loads as a single ``CSL`` object. To run the processor, create
and instance with the ``CSL.Engine()`` method:

.. code-block:: javascript

   var citeproc = CSL.Engine(sys, style, lang, forceLang);

*sys*
    **Required.** A JavaScript object providing (at least) the functions
    ``retrieveLocale()`` and ``retrieveItem()``.

*style*
    **Required.** CSL style as serialized XML (if ``xmldom.js`` is used)
    or as JavaScript object (if ``xmljson.js`` is used).

*lang*
    *Optional.* A language tag compliant with RFC 5646.  Defaults to ``en``.
    Styles that contain a ``default-locale`` attribute value
    on the ``style`` node will ignore this option unless
    the ``forceLang`` argument is set to a non-nil value.

*forceLang*
    *Optional.* When set to a non-nil value, force the use of the
    locale set in the ``lang`` argument, overriding
    any language set in the ``default-locale`` attribute
    on the ``style`` node.


--------------------------
Required ``sys`` functions
--------------------------

Two locally defined synchronous functions on the ``sys`` object must
be supplied to acquire runtime inputs.

!!!!!!!!!!!!!!
retrieveLocale
!!!!!!!!!!!!!!

The ``retrieveLocale()`` function fetches CSL locales needed at
runtime. The locale source is available for download from the `CSL
locales repository
<https://github.com/citation-style-language/locales>`_.  The function
takes a single RFC 5646 language tag as its sole argument, and returns
a locale object. The return may be a serialized XML string, an E4X
object, a DOM document, or a JSON or JavaScript representation of the
locale XML.  If the requested locale is not available, the function
must return a value that tests ``false``. The function *must* return a
value for the ``us`` locale.

!!!!!!!!!!!!
retrieveItem
!!!!!!!!!!!!

The ``retrieveItem()`` function fetches citation data for an item. The
function takes an item ID as its sole argument, and returns a
JavaScript object in CSL JSON format.

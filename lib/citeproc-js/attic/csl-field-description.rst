 There are three types of field
on a CSL JSON object: The example below illustrates the structure of
the fields:

.. code-block:: javascript

   {
      "id": "item123456789",
      "type": "book",
      "title": "Book One",
      "author": [
         {
            "family": "Jones",
            "given": "Michael"
         }
      ],
      "issued": {
         "date-parts": [[ 2000, 3, 15 ]]
      }
   }

*id*
    **Required.** The ID of an item must correspond to the ID used to
    fetch it. The value may be any string or numeric value, but must
    uniquely identify the item.

*type*
    **Required.** The type must be a valid CSL type under the schema
    of the installed style. See the schemata of `CSL <https://github.com/citation-style-language/schema/blob/master/csl-types.rnc>`_
    and `CSL-M <https://github.com/Juris-M/schema/blob/master/csl-mlz.rnc#L763>`_
    for their respective lists of valid types.

*title* (ordinary-field example)
    Ordinary fields such as *title* may be set as strings or numbers.
    For the fields available on each item type, see the `listing for
    CSL <http://aurimasv.github.io/z2csl/typeMap.xml>`_ provided by
    Aurimas Vinckevicius, and `that for CSL-M
    <http://fbennett.github.io/z2csl/>`_ provided by yours truly.

*author* (creator-field example)
    Set creator fields such as *author* as an array of objects.  Three
    object formats are recognized. The illustration shows the use of
    ``family`` and ``given`` elements for personal names. In this
    format, lowercase elements before the family name are treated as
    "non-dropping" particles, and lowercase elements following the
    given name as "dropping" particles.  An articular (e.g. "Jr" or
    "III") may follow the given name and any dropping particles, set
    off with a comma.

    Alternatively, ordinary names can be delivered to the processor
    as a set of discrete fields, as shown by the following (imaginary)
    name entry:

    .. code-block:: javascript

       "author": [
          {
             "dropping-particle": "van", 
             "family": "Meer", 
             "given": "Roderick", 
             "non-dropping-particle": "der",
             "suffix": "III"
          }
       ]

    Some personal names are represented by a single field
    (e.g. mononyms such as "Prince" or "Plato"). In such cases, the
    name can be delivered as a lone ``family`` element. Institutional
    names *may* be delivered in the same way, but it is preferred to
    set them instead as a ``literal`` element:

    .. code-block:: javascript

       "author": [
          {
             "literal": "International Business Machines"
          }
       ]

*issued* (date-field example)    
    Date fields such as *issued* may be set in either of two
    formats. The example above shows a date in array format.  To
    express a range in this format, the ending date would be set as a
    second array:

    .. code-block:: javascript

       "issued": {
          "date-parts": [[ 2000, 3, 15 ], [2000, 3, 17]]
       }

    Alternatively, dates may be set in raw form, as follows:

    .. code-block:: javascript

       "issued": {
          "raw": "2000-3-15"
       }

       "issued": {
          "raw": "2000-3-15/2000-3-17"
       }

    The date parser embedded in |citeproc-js| will correctly interpret
    a number of sensible date conventions, but the numeric
    year-month-day format is unambiguous, easy to remember and simple
    to produce.

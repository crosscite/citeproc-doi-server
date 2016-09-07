=====================
Release Announcements
=====================

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

--------
v1.1.113
--------

Fix bug in logging code introduced at 1.1.111
  Minutes after a Juris-M release incorporating the changes below,
  a colleague knocked on my door to say that word processor input
  had suddenly broken. We traced the cause to entries with an
  invalid language code ("Japanese" rather than "ja"), which should
  have logged a warning without throwing an error. The cause was
  a typo in the logging function itself (a missing argument in the
  signature). Now fixed, and things should work normally.

--------
v1.1.112
--------

Fix Homer-worthy nesting bug
  A research group (at Heidelberg University) had been getting
  persistent errors when attempting to generate multilingual
  bibliographies. The fault was traced to a clear coding error in the
  code used to output tertiary variants (i.e. the second of two
  variants to a cite field value). The fault has been fixed, and
  multilingual bibliographies in all configurations should now render
  without error.

--------
v1.1.111
--------

Use dump rather than throw if console not available
  Previously, the ``CSL.error()`` function would throw a hard
  (crashing) error on systems that did not have a native
  ``console.log()`` function with the expected characteristics (hello
  Windows). With this fix, the code falls back to the more primitive
  ``dump()`` logging function, avoiding a crash.  (Note that there was
  a bug in this fix, repaired at 1.1.113)

--------
v1.1.110
--------

Wrap section field remap in condition
  For legal item types in CSL-M styles, the ``section`` field is remapped to
  ``locator``, the allow storage of individual statutory sections as separate
  items in the database. This behaviour is not desired in standard CSL,
  but was not properly disabled. With the addition of a conditional,
  remapping is now properly disabled in vanilla CSL.

--------
v1.1.109
--------

Fix sorting behaviour
  Sort comparisons in JavaScript engines are (still) producing
  inconsistent results. This fix tests the effect of separator strings
  hacked into processor-generated sort keys, choosing the separating
  character (at-mark ``@`` or field-separator ``|``) that will produce
  a correct sort. Tests prepared in response to the relevant
  bug report (from a user with Danish requirements) now pass,
  and existing sort tests also clear.

--------
v1.1.108
--------

Remove ``indexOf()`` definition
  Modern JavaScript engines all have ``indexOf()`` as a native
  method on ``Array()``, so this workaround is no longer necessary.

Show institution name variants even when abbrev is used
  Previously, when the short form of an institution name was used,
  its variants were not displayed, even in the first reference.
  With this change, variants are displayed. Some further tuning
  may be in order here, since institution names have differing
  roles for courts and for "proper" institutional authors, but
  we will pick up those use cases as they emerge over time.

--------
v1.1.107
--------

Add ``default-locale`` to ``cs-date``
  Previously, in multi-layout styles, the default-locale form of dates
  as always used for the ``accessed`` date variable, and the localized
  form was used on all other date variables. The use of default locale
  can now be controlled in the same way as for ``cs:label`` and
  ``cs:text``.


--------
v1.1.106
--------

Avoid array comprehensions
  On line of processor code depended on a form of assignment that is
  apparently not supported in some JavaScript implementations.  This
  has been fixed.

New ``default-locale`` attribute for ``cs:label``, ``cs:text``
  In multi-layout styles, there was no way to force use of the
  default-locale version of specific terms. With ``default-locale="true"``
  on ``cs:label`` and ``cs:text`` this is now possible.


--------
v1.1.105
--------

Extend use of en-dash on locator labels
  An en-dash was used for hyphen only on a limited subset of
  labels. It is generally the right thing to do, so its use
  has been extended.

--------
v1.1.104
--------

Split Institution field

Fix ``locator-date`` and ``locator-extra`` bugs
  The ``locator-date`` and ``locator-extra`` variables that depend on
  content parsed out of the ``locator`` field were not updating
  correctly in dynamic environments. This has been fixed.

Fix bugs in new ``year-suffix`` code from 1.1.100
  The fix at 1.1.100 introduced fresh bugs in year-suffix
  disambiguation.  These have been squashed.


--------
v1.1.103
--------


Title-case capitalization following forward slash
  With ``text-case="title"`` in an English locale, capitalize a word
  that follows a forward slash.

Escape ``sup`` and ``sub`` tags when capitalizing
  Properly escape <sup></sup> and <sub></sub> markup when applying
  text transforms (fixes a bug unmasked by the change above).

Use title as fallback for ``citation-label``
  When no authors are available for ``citation-label``, use a fragment
  of the title.

Strip font style and weight in multilingual variants
  When adding multilingual variants in output, suppress italics,
  oblique, and boldface in supplementary (secondary and tertiary)
  text.

--------
v1.1.102
--------

Include ``citationID`` in return from ``processCitationCluster()``
  This is a technical change, with no impact at user level.

  While building a small demo of dynamic citation editing
  is a Web-based WYSIWYG editor, I found that including 
  the value of ``citationID`` in the return from the
  ``processCitationCluster()`` function greatly simplified
  page updates following a citation edit, so I added that
  value to the return.

--------
v1.1.101
--------


Delimiter bug with ``year-suffix``
  Certain delimiters were being dropped when rendering an explicit
  ``year-suffix`` element (a numeric value rendered as a string). This
  has been fixed.

Stray ``year-suffix`` bug

  In a bug related to the one above, and apparently triggered by
  changes in ``1.1.100``, an implicit ``year-suffix`` was rendering on
  dates with empty variables.

    https://forums.zotero.org/discussion/58636/collapse-yearsuffix-in-chicago-manual-of-style/#Item_5

  This has been fixed.

--------
v1.1.100
--------

Non-breaking-space joins following initials
  Retain zero-width non-breaking space (``\uFEFF``) and non-breaking
  space (``\u00A0``) as the inter-initials join when these are the
  last character in the ``@initialize-with`` attribute value.
  
  In the RU (Russian), CS (Czech) and FR (French) locales only, when
  either of the non-breaking space elements is present in the
  attribute value, use non-breaking space (``\u00A0``) as the
  given-to-family join when building initialized names in non-sort
  order. Otherwise, use an ordinary space for the given-to-family
  join.

  Resolves the issue discussed at:

    https://forums.zotero.org/discussion/31693/nonbreaking-space-unavailable-between-initials-and-names

  **NB:** This behaviour was added for the CS locale at later tag ``1.1.103``.

Date styling bug
  The affixes of a ``cs:date`` node with no variable content
  could affect the styling of subsequent date nodes. This
  has been fixed.

Bug in ``year-suffix``
  The ``year-suffix`` form of disambiguation was misbehaving when used
  with ``collapse="year"`` or ``collapse="year-suffix"``. This has been fixed.

-------
v1.1.99
-------

Fix pluralism of embedded labels
   Shortcode labels that differ from the "main" label on a number
   (as in "p. 123 n. 1 & 2") were not pluralizing properly. This
   has been fixed.

-------
v1.1.98
-------

Expose ``parseNoteFieldHacks()``
   To allow small extensions to the schema of calling applications
   (generally not needed in Juris-M, but useful elsewhere), CSL
   variables can be set in the ``note`` field of the CSL JSON input to
   the processor. The parsing code for doing so is now exposed, so
   that calling applications (including Juris-M) can make use of it
   where necessary for their own purposes.

Fix bugs in parsing of names from note field hack syntax
   When parsing hack syntax out of the note field, single-field names
   were being returned as two-field names with a value in the ``family``
   field only. This has been fixed.

Pre-title macros in style modules
   Cites to cases decided by the European Court of Justice require
   the docket number *before* the case name. Style modules were
   not capable of generating this cite form, so an additional
   standard macro was added to the modules for that purpose.

Bibliography entries as strings
   In an initially unnoticed bug, the processor bibliography function
   was returning the elements of a bibliography as one-item lists
   rather than as strings. The bug was unnoticed in many contexts
   because JavaScript has weak "typing": an array converts to a string
   when combined with another string; and a one-element list
   stringifies without braces or comma delimiters. The bug was noticed
   in a context in Zotero that *required* a real string, and was duly
   squashed.

Locators with leading space
   A Zotero user reported that entering a leading space in the locator
   field in the word processor caused an unwanted page label ("p.")
   to magically appear in some styles. This has been fixed.

Handle styles with DOS and Mac line endings
   A Zotero user reported that the latest processor version was crashing
   hard when styles had DOS or Mac line endings---"normal" line endings
   are ``line-feed`` only, DOS line endings are ``carriage-return+line-feed``,
   and Mac line endings are ``carriage-return`` only. This bug did not affect
   the distributed Juris-M styles, but it has been fixed, so if you
   use a non-Unix editor (such as Windows Notepad) to modify a style
   for some reason, it will continue to work.

Handle styles with signle-quoted XML attribute values
   In a bug arising from the same set of changes that yielded the line-endings
   issue, styles (and locales) that used single-quotes on XML attribute
   values were also crashing the processor. Single-quotes are perfectly
   valid XML, and this bug has been squashed.

-------
v1.1.90
-------

There are many changes to the infrastructure behind this release, and
few changes to functionality apart from bug fixes. This back-room work
will allow quicker releases, and lays a solid foundation for the
development of legal style modules.

Here are the main items:

Processor code on GitHub
   Most citation-related programming activity takes place on GitHub,
   and I finally bit the bullet and moved the citeproc-js code there,
   for easier deployment and smoother collaboration with developers.

JavaScript engine testing
   Until recently, the processor was tested only in the Rhino
   JavaScript engine that runs in Java. Rhino is not used in browsers,
   and where the processor behaved differently under a browser engine
   (when sorting citations, for example), the fault was not picked up
   until a user noticed in the field. The test suite can now run
   alternative JS engines, and I will always test against the leading
   four engines (Rhino [Java], Spidermonkey [Firefox], V8 [Google
   Chrome], and JavaScript Core [Safari]) before releases.

Style and locale parsing 
   To do its thing, the processor must parse the XML of a style file
   and its associated locale strings for internal use. Although
   citeproc-js supported several methods of parsing XML (DOM, E4X, and
   a pre-parsed bespoke JSON format), setup was a non-standard
   ill-documented headache, with the processor "discovering" an
   unconnected parser object via JavaScript closure--a procedure that
   is as clumsy as it sounds. The parsers are now embedded in the
   processor itself, and it will digest any form of XML that you throw
   at it. Deployments should be much simpler for it.

Validated test fixtures
   The test suite that backs up processor development hadn't received
   much attention in recent years (apart from the addition of many
   test fixtures). The long-dormant facility for validating the CSL
   style objects used for testing has been resurrected, and all test
   CSL now passes validation. This brings greater assurance that what
   we see in the test framework will replicate in the field.

Locators in legal style modules 
   Modular style code is challenging for locator formatting, in
   particular, because these are heavily dependent on context, and the
   context is supplied by the calling style. With revisions to CSL-M,
   the extended version of CSL used in Juris-M styles, locators can be
   positioned using "smart conditions" that read the essential
   features of surrounding context. As a result the burden on legal
   style development has lightened considerably, and we are now ready
   to scale the system out to cover additional jurisdictions.

Disambiguation
   The processor compares the shortest form of citations for ambiguity
   before adding information to citations. Legal styles that implement
   a "five-footnote rule" must test the *near* form of cites for this
   to work. That wasn't happening, but it is now.

Straight-quotes hanging bug 
   When straight quotes were set as the preferred quotation marks in a
   new CSL locale, it triggered a hanging bug in the processor. This
   has been fixed.

Nesting mismatch errors
   The processor builds citations as deeply nested string sets, with
   the siblings joined by a delimiter at each level to produce printed
   output. For performance reasons the nesting is "spoofed" by markers
   in a list executed from start to finish, and if the markers are
   incorrectly place, weird things can happen (in theory). The markers
   were *very slightly* incorrect in two instances that manifested in
   Zotero/Juris-M, but not in the pre-release test suite. The bugs
   have been fixed, and the test suite has been fixed to pick these
   errors up if they every occur again.

Arabic locale
   The Arabic locale was not loading. At all. Ever. This has been
   fixed.

Charset sniffing 
   The regular expression used to guess whether the character set of
   some strings is "romanesque" included some dingbat-type
   characters. These have been removed.

Safe syntax for global replacements
   The processor was attempting to perform global replacements with
   str.replace("old", "new", "g"). This worked in Rhino, but broken in
   browser JavaScript engines. That code has been replaced with
   str.split("old").join("new"), which works correctly everywhere.

Safer sorting
   Internal sort keys included spaces, and spaces sorted differently
   depending on the JavaScript engine. Spaces have been replaced with
   "A" in sort keys, which has the effect of forcing the treatment of
   each element as a separate sort key.

Remove lurking list comprehensions
   List comprehensions (as in [key, val] = myFun();) were removed from
   citeproc-js quite some time ago, because they are not valid across
   all JavaScript engines. Two still remained in a debugging
   statement. They have been removed.

====================
Module Legal Support
====================

The sources of law and the conventions for citing them vary among
jurisdictions. The current approach in CSL-m styles is to support all
jurisdictions in a single style file. This is not sustainable.  For
maintainability, styles should cover the relevant guide's requirements
for secondary and non-legal sources, and refer to an appropriate legal
support module when legal items are encountered. This will require
several changes:

1. A mechanism for loading additional style code into the running processor;
2. A CSL element for invoking the loading mechanism on demand;
3. A set of fixed coding conventions (a kind of macro API) for legal style modules.

This document lays out a rough specification for these facilities, for
reference in building modular legal support.

----------------------------------
Supplementary style loading method
----------------------------------

The interface for the supplementary style loading method, which must
be provided by the calling application, is::

    citeproc.sys.loadJurisdictionStyle(jurisdiction, variantName)

*jurisdiction* ``<string>``
    The jurisdiction set on the item. A match will be attempted
    against available styles iteratively, removing elements from
    the end of the jurisdiction until a match is found or the match
    fails. On failure, a default legal style (specified by the calling
    style) will be installed if necessary.

*variantName* ``<string>``
    An optional variant name. If specified, a match to a style with
    the variant name will be attempted before falling back to the
    default form. The default form is static for the jurisdiction,
    and beyond the control of the calling style.

-----------
CSL element
-----------

The ``<legal/>`` CSL element forces a call to ``loadJurisdictionStyle()``,
and passes control to the appropriate style module (match or default) for
the remaining processing of the item. It should therefore be set at the
start of processing under ``<citation/>`` or ``<bibliography/>``. It 
has one required *attribute*, and several required **subelements**:

*default* ``<string>``
    The default jurisdiction to call if a match is not available.


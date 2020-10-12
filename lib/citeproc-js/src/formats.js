/*global CSL: true */


/**
 * Output specifications.
 * @class
 */
CSL.Output.Formats = function () {};

/**
 * HTML output format specification.
 * <p>The headline says it all.  The source code for this
 * object can be used as a template for producing other
 * output modes.</p>
 */
CSL.Output.Formats.prototype.html = {
    //
    // text_escape: Format-specific function for escaping text destined
    // for output.  Takes the text to be escaped as sole argument.  Function
    // will be run only once across each portion of text to be escaped, it
    // need not be idempotent.
    //
    "text_escape": function (text) {
        // Numeric entities, in case the output is processed as
        // xml in an environment in which HTML named entities are
        // not declared.
        if (!text) {
            text = "";
        }
        return text.replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace(/\s\s/g, "\u00A0 ")
            .replace(CSL.SUPERSCRIPTS_REGEXP,
                     function(aChar) {
                         // return "&#60;sup&#62;" + CSL.SUPERSCRIPTS[aChar] + "&#60;/sup&#62;";
                         return "<sup>" + CSL.SUPERSCRIPTS[aChar] + "</sup>";
                     });
    },
    "bibstart": "<div class=\"csl-bib-body\">\n",
    "bibend": "</div>",
    "@font-style/italic": "<i>%%STRING%%</i>",
    "@font-style/oblique": "<em>%%STRING%%</em>",
    "@font-style/normal": "<span style=\"font-style:normal;\">%%STRING%%</span>",
    "@font-variant/small-caps": "<span style=\"font-variant:small-caps;\">%%STRING%%</span>",
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-variant/normal": "<span style=\"font-variant:normal;\">%%STRING%%</span>",
    "@font-weight/bold": "<b>%%STRING%%</b>",
    "@font-weight/normal": "<span style=\"font-weight:normal;\">%%STRING%%</span>",
    "@font-weight/light": false,
    "@text-decoration/none": "<span style=\"text-decoration:none;\">%%STRING%%</span>",
    "@text-decoration/underline": "<span style=\"text-decoration:underline;\">%%STRING%%</span>",
    "@vertical-align/sup": "<sup>%%STRING%%</sup>",
    "@vertical-align/sub": "<sub>%%STRING%%</sub>",
    "@vertical-align/baseline": "<span style=\"baseline\">%%STRING%%</span>",
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return state.getTerm("open-quote");
        }
        return state.getTerm("open-quote") + str + state.getTerm("close-quote");
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            //
            // Mostly right by being wrong (for apostrophes)
            //
            return "\u2019";
        }
        return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
    },
    "@quotes/false": false,
    //"@bibliography/body": function (state,str){
    //    return "<div class=\"csl-bib-body\">\n"+str+"</div>";
    //},
    "@cite/entry": function (state, str) {
        return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
	},
    "@bibliography/entry": function (state, str) {
        // Test for this.item_id to add decorations to
        // bibliography output of individual entries.
        //
        // Full item content can be obtained from
        // state.registry.registry[id].ref, using
        // CSL variable keys.
        //
        // Example:
        //
        //   print(state.registry.registry[this.item_id].ref["title"]);
        //
        // At present, for parallel citations, only the
        // id of the master item is supplied on this.item_id.
        var insert = "";
        if (state.sys.embedBibliographyEntry) {
            insert = state.sys.embedBibliographyEntry(this.item_id) + "\n";
        }
        return "  <div class=\"csl-entry\">" + str + "</div>\n" + insert;
    },
    "@display/block": function (state, str) {
        return "\n\n    <div class=\"csl-block\">" + str + "</div>\n";
    },
    "@display/left-margin": function (state, str) {
        return "\n    <div class=\"csl-left-margin\">" + str + "</div>";
    },
    "@display/right-inline": function (state, str) {
        return "<div class=\"csl-right-inline\">" + str + "</div>\n  ";
    },
    "@display/indent": function (state, str) {
        return "<div class=\"csl-indent\">" + str + "</div>\n  ";
    },
    "@showid/true": function (state, str, cslid) {
        if (!state.tmp.just_looking && ! state.tmp.suppress_decorations) {
            if (cslid) {
                return "<span class=\"" + state.opt.nodenames[cslid] + "\" cslid=\"" + cslid + "\">" + str + "</span>";
            } else if (this.params && "string" === typeof str) {
                var prePunct = "";
                if (str) {
                    var m = str.match(CSL.VARIABLE_WRAPPER_PREPUNCT_REX);
                    prePunct = m[1];
                    str = m[2];
                }
                var postPunct = "";
                if (str && CSL.SWAPPING_PUNCTUATION.indexOf(str.slice(-1)) > -1) {
                    postPunct = str.slice(-1);
                    str = str.slice(0,-1);
                }
                return state.sys.variableWrapper(this.params, prePunct, str, postPunct);
            } else {
                return str;
            }
        } else {
            return str;
        }
    },
    "@URL/true": function (state, str) {
        return "<a href=\"" + str + "\">" + str + "</a>";
    },
    "@DOI/true": function (state, str) {
        var doiurl = str;
        if (!str.match(/^https?:\/\//)) {
            doiurl = "https://doi.org/" + str;
        }
        return "<a href=\"" + doiurl + "\">" + str + "</a>";
    }
};

/**
 * Plain text output specification.
 *
 * (Code contributed by Simon Kornblith, Center for History and New Media,
 * George Mason University.)
 */
CSL.Output.Formats.prototype.text = {
    //
    // text_escape: Format-specific function for escaping text destined
    // for output.  Takes the text to be escaped as sole argument.  Function
    // will be run only once across each portion of text to be escaped, it
    // need not be idempotent.
    //
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text;
    },
    "bibstart": "",
    "bibend": "",
    "@font-style/italic": false,
    "@font-style/oblique": false,
    "@font-style/normal": false,
    "@font-variant/small-caps": false,
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-variant/normal": false,
    "@font-weight/bold": false,
    "@font-weight/normal": false,
    "@font-weight/light": false,
    "@text-decoration/none": false,
    "@text-decoration/underline": false,
    "@vertical-align/baseline": false,
    "@vertical-align/sup": false,
    "@vertical-align/sub": false,
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return state.getTerm("open-quote");
        }
        return state.getTerm("open-quote") + str + state.getTerm("close-quote");
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            //
            // Mostly right by being wrong (for apostrophes)
            //
            return "\u2019";
        }
        return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
    },
    "@quotes/false": false,
    //"@bibliography/body": function (state,str){
    //    return "<div class=\"csl-bib-body\">\n"+str+"</div>";
    //},
    "@cite/entry": function (state, str) {
		return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
	},
    "@bibliography/entry": function (state, str) {
        return str+"\n";
    },
    "@display/block": function (state, str) {
        return "\n"+str;
    },
    "@display/left-margin": function (state, str) {
        return str;
    },
    "@display/right-inline": function (state, str) {
        return str;
    },
    "@display/indent": function (state, str) {
        return "\n    "+str;
    },
    "@showid/true": function (state, str) {
        return str;
    },
    "@URL/true": function (state, str) {
        return str;
    },
    "@DOI/true": function (state, str) {
        return str;
    }
};

/**
 * Plain text output specification.
 *
 * (Code contributed by Simon Kornblith, Center for History and New Media,
 * George Mason University.)
 */
CSL.Output.Formats.prototype.rtf = {
    //
    // text_escape: Format-specific function for escaping text destined
    // for output.  Takes the text to be escaped as sole argument.  Function
    // will be run only once across each portion of text to be escaped, it
    // need not be idempotent.
    //
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text
        .replace(/([\\{}])/g, "\\$1")
        .replace(CSL.SUPERSCRIPTS_REGEXP,
                 function(aChar) {
                     return "\\super " + CSL.SUPERSCRIPTS[aChar] + "\\nosupersub{}";
                 })
        .replace(/[\u007F-\uFFFF]/g,
                 function(aChar) { return "\\uc0\\u"+aChar.charCodeAt(0).toString()+"{}"; })
        .split("\t").join("\\tab{}");
    },
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-style/italic":"{\\i{}%%STRING%%}",
    "@font-style/normal":"{\\i0{}%%STRING%%}",
    "@font-style/oblique":"{\\i{}%%STRING%%}",
    "@font-variant/small-caps":"{\\scaps %%STRING%%}",
    "@font-variant/normal":"{\\scaps0{}%%STRING%%}",
    "@font-weight/bold":"{\\b{}%%STRING%%}",
    "@font-weight/normal":"{\\b0{}%%STRING%%}",
    "@font-weight/light":false,
    "@text-decoration/none":false,
    "@text-decoration/underline":"{\\ul{}%%STRING%%}",
    "@vertical-align/baseline":false,
    "@vertical-align/sup":"\\super %%STRING%%\\nosupersub{}",
    "@vertical-align/sub":"\\sub %%STRING%%\\nosupersub{}",
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-quote"));
        }
        return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-quote")) + str + CSL.Output.Formats.rtf.text_escape(state.getTerm("close-quote"));
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            return CSL.Output.Formats.rtf.text_escape("\u2019");
        }
        return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-inner-quote")) + str + CSL.Output.Formats.rtf.text_escape(state.getTerm("close-inner-quote"));
    },
    "@quotes/false": false,
    "bibstart":"{\\rtf ",
    "bibend":"}",
    "@display/block": "\\line{}%%STRING%%\\line\r\n",
    "@cite/entry": function (state, str) {
        // If wrapCitationEntry does not exist, cite/entry 
        // is not applied.
		return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
	},
    "@bibliography/entry": function(state,str){
        return str;
    },
    "@display/left-margin": function(state,str){
        return str+"\\tab ";
    },
    "@display/right-inline": function (state, str) {
        return str+"\r\n";
    },
    "@display/indent": function (state, str) {
        return "\n\\tab "+str+"\\line\r\n";
    },
    "@showid/true": function (state, str) {
        if (!state.tmp.just_looking && ! state.tmp.suppress_decorations) {
            var prePunct = "";
            if (str) {
                var m = str.match(CSL.VARIABLE_WRAPPER_PREPUNCT_REX);
                prePunct = m[1];
                str = m[2];
            }
            var postPunct = "";
            if (str && CSL.SWAPPING_PUNCTUATION.indexOf(str.slice(-1)) > -1) {
                postPunct = str.slice(-1);
                str = str.slice(0,-1);
            }
            return state.sys.variableWrapper(this.params, prePunct, str, postPunct);
        } else {
            return str;
        }
    },
    "@URL/true": function (state, str) {
        return str;
    },
    "@DOI/true": function (state, str) {
        return str;
    }
};

/*

    This does not seem to work in Zotero plugins. For some reason the scope of the link does not
    close when interpreted by the LibreOffice. Perhaps this creates a field within a field,
    and that is not allowed?

    "@URL/true": function (state, str) {
        return "\\field{\\*\\fldinst{HYPERLINK \"" + str + "\"}}{\\fldrslt{"+ str +"}}";
    },
    "@DOI/true": function (state, str) {
        return "\\field{\\*\\fldinst{HYPERLINK \"https://doi.org/" + str + "\"}}{\\fldrslt{"+ str +"}}";
    }
*/

/**
 * AsciiDoc output specification.
 *
 * See http://asciidoc.org/ or https://asciidoctor.org/
 */
CSL.Output.Formats.prototype.asciidoc = {
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text.replace("*", "pass:[*]", "g")
            .replace("_", "pass:[_]", "g")
            .replace("#", "pass:[#]", "g")
            .replace("^", "pass:[^]", "g")
            .replace("~", "pass:[~]", "g")
            .replace("[[", "pass:[[[]", "g")
            .replace("  ", "&#160; ", "g")
            .replace(CSL.SUPERSCRIPTS_REGEXP, function(aChar) {
                return "^" + CSL.SUPERSCRIPTS[aChar] + "^";
            });
    },
    "bibstart": "",
    "bibend": "",
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-style/italic": "__%%STRING%%__",
    "@font-style/oblique": "__%%STRING%%__",
    "@font-style/normal": false,
    "@font-variant/small-caps": "[small-caps]#%%STRING%%#",
    "@font-variant/normal": false,
    "@font-weight/bold": "**%%STRING%%**",
    "@font-weight/normal": false,
    "@font-weight/light": false,
    "@text-decoration/none": false,
    "@text-decoration/underline": "[underline]##%%STRING%%##",
    "@vertical-align/sup": "^^%%STRING%%^^",
    "@vertical-align/sub": "~~%%STRING%%~~",
    "@vertical-align/baseline": false,
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return "``";
        }
        return "``" + str + "''";
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            return "`";
        }
        return "`" + str + "'";
    },
    "@quotes/false": false,
    "@cite/entry": function (state, str) {
        // if wrapCitationEntry does not exist, cite/entry is not applied
        return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
    },
    "@bibliography/entry": function (state, str) {
        return str + "\n";
    },
    "@display/block": function (state, str) {
        return str;
    },
    "@display/left-margin": function (state, str) {
        return str;
    },
    "@display/right-inline": function (state, str) {
        return " " + str;
    },
    "@display/indent": function (state, str) {
        return " " + str;
    },
    "@showid/true": function (state, str) {
        if (!state.tmp.just_looking && !state.tmp.suppress_decorations && this.params && "string" === typeof str) {
            var prePunct = "";
            if (str) {
                var m = str.match(CSL.VARIABLE_WRAPPER_PREPUNCT_REX);
                prePunct = m[1];
                str = m[2];
            }
            var postPunct = "";
            if (str && CSL.SWAPPING_PUNCTUATION.indexOf(str.slice(-1)) > -1) {
                postPunct = str.slice(-1);
                str = str.slice(0,-1);
            }
            return state.sys.variableWrapper(this.params, prePunct, str, postPunct);
        } else {
            return str;
        }
    },
    "@URL/true": function (state, str) {
        // AsciiDoc renders URLs automatically as links
        return str;
    },
    "@DOI/true": function (state, str) {
        var doiurl = str;
        if (!str.match(/^https?:\/\//)) {
            doiurl = "https://doi.org/" + str;
        }
        return doiurl + "[" + str + "]";
    }
};

/**
 * Output specification for XSL-FO (Extensible Stylesheet
 * Language - Formatting Objects)
 *
 * See https://www.w3.org/TR/xsl11/#fo-section
 */
CSL.Output.Formats.prototype.fo = {
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text.replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace("  ", "&#160; ", "g")
            .replace(CSL.SUPERSCRIPTS_REGEXP, function(aChar) {
                return "<fo:inline vertical-align=\"super\">" + CSL.SUPERSCRIPTS[aChar] + "</fo:inline>";
            });
    },
    "bibstart": "",
    "bibend": "",
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-style/italic": "<fo:inline font-style=\"italic\">%%STRING%%</fo:inline>",
    "@font-style/oblique": "<fo:inline font-style=\"oblique\">%%STRING%%</fo:inline>",
    "@font-style/normal": "<fo:inline font-style=\"normal\">%%STRING%%</fo:inline>",
    "@font-variant/small-caps": "<fo:inline font-variant=\"small-caps\">%%STRING%%</fo:inline>",
    "@font-variant/normal": "<fo:inline font-variant=\"normal\">%%STRING%%</fo:inline>",
    "@font-weight/bold": "<fo:inline font-weight=\"bold\">%%STRING%%</fo:inline>",
    "@font-weight/normal": "<fo:inline font-weight=\"normal\">%%STRING%%</fo:inline>",
    "@font-weight/light": "<fo:inline font-weight=\"lighter\">%%STRING%%</fo:inline>",
    "@text-decoration/none": "<fo:inline text-decoration=\"none\">%%STRING%%</fo:inline>",
    "@text-decoration/underline": "<fo:inline text-decoration=\"underline\">%%STRING%%</fo:inline>",
    "@vertical-align/sup": "<fo:inline vertical-align=\"super\">%%STRING%%</fo:inline>",
    "@vertical-align/sub": "<fo:inline vertical-align=\"sub\">%%STRING%%</fo:inline>",
    "@vertical-align/baseline": "<fo:inline vertical-align=\"baseline\">%%STRING%%</fo:inline>",
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return state.getTerm("open-quote");
        }
        return state.getTerm("open-quote") + str + state.getTerm("close-quote");
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            return "\u2019";
        }
        return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
    },
    "@quotes/false": false,
    "@cite/entry": function (state, str) {
        return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
    },
    "@bibliography/entry": function (state, str) {
        var indent = "";
        if (state.bibliography && state.bibliography.opt && state.bibliography.opt.hangingindent) {
            var hi = state.bibliography.opt.hangingindent;
            indent = " start-indent=\"" + hi +"em\" text-indent=\"-" + hi + "em\"";
        }
        var insert = "";
        if (state.sys.embedBibliographyEntry) {
            insert = state.sys.embedBibliographyEntry(this.item_id) + "\n";
        }
        return "<fo:block id=\"" + this.system_id + "\"" + indent + ">" + str + "</fo:block>\n" + insert;
    },
    "@display/block": function (state, str) {
        return "\n  <fo:block>" + str + "</fo:block>\n";
    },
    "@display/left-margin": function (state, str) {
        return "\n  <fo:table table-layout=\"fixed\" width=\"100%\">\n    " +
                "<fo:table-column column-number=\"1\" column-width=\"$$$__COLUMN_WIDTH_1__$$$\"/>\n    " +
                "<fo:table-column column-number=\"2\" column-width=\"proportional-column-width(1)\"/>\n    " +
                "<fo:table-body>\n      " +
                    "<fo:table-row>\n        " +
                        "<fo:table-cell>\n          " +
                            "<fo:block>" + str + "</fo:block>\n        " +
                        "</fo:table-cell>\n        ";
    },
    "@display/right-inline": function (state, str) {
        return "<fo:table-cell>\n          " +
                "<fo:block>" + str + "</fo:block>\n        " +
            "</fo:table-cell>\n      " +
            "</fo:table-row>\n    " +
            "</fo:table-body>\n  " +
            "</fo:table>\n";
    },
    "@display/indent": function (state, str) {
        return "<fo:block margin-left=\"2em\">" + str + "</fo:block>\n";
    },
    "@showid/true": function (state, str) {
        if (!state.tmp.just_looking && !state.tmp.suppress_decorations && this.params && "string" === typeof str) {
            var prePunct = "";
            if (str) {
                var m = str.match(CSL.VARIABLE_WRAPPER_PREPUNCT_REX);
                prePunct = m[1];
                str = m[2];
            }
            var postPunct = "";
            if (str && CSL.SWAPPING_PUNCTUATION.indexOf(str.slice(-1)) > -1) {
                postPunct = str.slice(-1);
                str = str.slice(0,-1);
            }
            return state.sys.variableWrapper(this.params, prePunct, str, postPunct);
        } else {
            return str;
        }
    },
    "@URL/true": function (state, str) {
        return "<fo:basic-link external-destination=\"url('" + str + "')\">" + str + "</fo:basic-link>";
    },
    "@DOI/true": function (state, str) {
        var doiurl = str;
        if (!str.match(/^https?:\/\//)) {
            doiurl = "https://doi.org/" + str;
        }
        return "<fo:basic-link external-destination=\"url('" + doiurl + "')\">" + str + "</fo:basic-link>";
    }
};

/**
 * LaTeX .bbl output.
 *
 * (Code contributed by Egon Willighagen, based on the prototype.text code.)
 */
CSL.Output.Formats.prototype.latex = {
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text;
    },
    "bibstart": "\\begin{thebibliography}{4}",
    "bibend": "\end{thebibliography}",
    "@font-style/italic": "{\\em %%STRING%%}",
    "@font-style/oblique": false,
    "@font-style/normal": false,
    "@font-variant/small-caps": false,
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-variant/normal": false,
    "@font-weight/bold": "{\\bf %%STRING%%}",
    "@font-weight/normal": false,
    "@font-weight/light": false,
    "@text-decoration/none": false,
    "@text-decoration/underline": false,
    "@vertical-align/baseline": false,
    "@vertical-align/sup": false,
    "@vertical-align/sub": false,
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return state.getTerm("open-quote");
        }
        return state.getTerm("open-quote") + str + state.getTerm("close-quote");
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            //
            // Mostly right by being wrong (for apostrophes)
            //
            return "\u2019";
        }
        return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
    },
    "@quotes/false": false,
    //"@bibliography/body": function (state,str){
    //    return "<div class=\"csl-bib-body\">\n"+str+"</div>";
    //},
    "@cite/entry": function (state, str) {
		return state.sys.wrapCitationEntry(str, this.item_id, this.locator_txt, this.suffix_txt);
	},
    "@bibliography/entry": function (state, str) {
        return "\\bibitem{" + state.sys.embedBibliographyEntry(this.item_id) + "}\n";
    },
    "@display/block": function (state, str) {
        return "\n"+str;
    },
    "@display/left-margin": function (state, str) {
        return str;
    },
    "@display/right-inline": function (state, str) {
        return str;
    },
    "@display/indent": function (state, str) {
        return "\n    "+str;
    },
    "@showid/true": function (state, str, cslid) {
        return str;
    },
    "@URL/true": function (state, str) {
        return str;
    },
    "@DOI/true": function (state, str) {
        return str;
    }
};

CSL.Output.Formats = new CSL.Output.Formats();

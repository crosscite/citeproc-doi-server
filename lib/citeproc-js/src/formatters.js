/*global CSL: true */

/**
 * A bundle of handy functions for text processing.
 * <p>Several of these are ripped off from various
 * locations in the Zotero source code.</p>
 * @namespace Toolkit of string functions
 */
CSL.Output.Formatters = {};

CSL.getSafeEscape = function(state) {
    if (["bibliography", "citation"].indexOf(state.tmp.area) > -1) {
        // Callback to apply thin space hack
        // Callback to force LTR/RTL on parens and braces
        var callbacks = [];
        if (state.opt.development_extensions.thin_non_breaking_space_html_hack && state.opt.mode === "html") {
            callbacks.push(function (txt) {
                return txt.replace(/\u202f/g, '<span style="white-space:nowrap">&thinsp;</span>');
            });
        }
        if (callbacks.length) {
            return function (txt) {
                for (var i = 0, ilen = callbacks.length; i < ilen; i += 1) {
                    txt = callbacks[i](txt);
                }
                return CSL.Output.Formats[state.opt.mode].text_escape(txt);
            }
        } else {
            return CSL.Output.Formats[state.opt.mode].text_escape;
        }
    } else {
        return function (txt) { return txt; };
    }
};

// See util_substitute.js and queue.js (append) for code supporting
// strip-periods.
//CSL.Output.Formatters.strip_periods = function (state, string) {
//    return string.replace(/\./g, "");
//};


/**
 * A noop that just delivers the string.
 */
CSL.Output.Formatters.passthrough = function (state, string) {
    return string;
};

/**
 * Force all letters in the string to lowercase.
 */
CSL.Output.Formatters.lowercase = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
    str.string = str.string.toLowerCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force all letters in the string to uppercase.
 */
CSL.Output.Formatters.uppercase = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
    str.string = str.string.toUpperCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force capitalization of the first letter in the string, leave
 * the rest of the characters untouched.
 */
CSL.Output.Formatters["capitalize-first"] = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    if (str.string.length) {
        str.string = str.string.slice(0, 1).toUpperCase() + str.string.substr(1);
        return CSL.Output.Formatters.undoppelString(str);
    } else {
        return "";
    }
};


/**
 * Similar to <b>capitalize_first</b>, but force the
 * subsequent characters to lowercase.
 */
CSL.Output.Formatters.sentence = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    str.string = str.string.slice(0, 1).toUpperCase() + str.string.substr(1).toLowerCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force the first letter of each space-delimited
 * word in the string to uppercase, and leave the remainder
 * of the string untouched.  Single characters are forced
 * to uppercase.
 */
CSL.Output.Formatters["capitalize-all"] = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    var strings = str.string.split(" ");
    for (var i = 0, ilen = strings.length; i < ilen; i += 1) {
        if (strings[i].length > 1) {
			if (state.opt.development_extensions.allow_force_lowercase) {
				strings[i] = strings[i].slice(0, 1).toUpperCase() + strings[i].substr(1).toLowerCase();
			} else {
				strings[i] = strings[i].slice(0, 1).toUpperCase() + strings[i].substr(1);
			}
        } else if (strings[i].length === 1) {
            strings[i] = strings[i].toUpperCase();
        }
    }
    str.string = strings.join(" ");
    return CSL.Output.Formatters.undoppelString(str);
};

/**
 * A complex function that attempts to produce a pattern
 * of capitalization appropriate for use in a title.
 * Will not touch words that have some capitalization
 * already.
 */
CSL.Output.Formatters.title = function (state, string) {
    var str, words, isAllUpperCase, newString, lastWordIndex, previousWordIndex, upperCaseVariant, lowerCaseVariant, pos, skip, notfirst, notlast, aftercolon, len, idx, tmp, skipword, ppos, mx, lst, myret;
    var SKIP_WORDS = state.locale[state.opt.lang].opts["skip-words"];
    if (!string) {
        return "";
    }
    var doppel = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE, SKIP_WORDS);
    function capitalise (word, force) {
        // Weird stuff is (.) transpiled with regexpu
        //   https://github.com/mathiasbynens/regexpu
        var m = word.match(/([:?!]+\s+|-|^)((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))(.*)/);
        // Do not uppercase lone Greek letters
        // (This may not be a good thing when setting Greek-language citations)
        if (m && !(m[2].match(/^[\u0370-\u03FF]$/) && !m[3])) {
            return m[1] + m[2].toUpperCase() + m[3];
        }
        return word;
    }
    function splitme (str, rex) {
        var m = str.match(rex);
        if (m) {
            var splits = str.split(rex);
            res = [splits[0]];
            for (var i=0; i<m.length; i++) {
                res.push(m[i]);
                res.push(splits[i+1]);
            }
        } else {
            res = [str];
        }
        return res;
    }
    // Split on skip words
    var str = doppel.string;
    var lst = splitme(str, state.locale[state.opt.lang].opts["skip-words-regexp"]);
    
    // Capitalise stop-words that occur after a colon
    for (i=1,ilen=lst.length;i<ilen;i+=2) {
        if (lst[i].match(/^[:?!]/)) {
            lst[i] = capitalise(lst[i]);
        }
    }
    // Capitalise stop-words if they are the first or last words
    if (!lst[0] && lst[1]) {
        lst[1] = capitalise(lst[1]);
    }
    if (lst.length > 2 && !lst[lst.length-1]) {
        lst[lst.length-2] = capitalise(lst[lst.length-2]);
    }
    for (var i=0,ilen=lst.length;i<ilen;i+=2) {
        var words = lst[i].split(/([:?!]*\s+|\/|-)/);
        // Inspect each word individually
        for (var k=0,klen=words.length;k<klen;k+=2) {
            // Word has length
            if (words[k].length !== 0) {
                //print("Word: ("+words[k]+")");
                upperCaseVariant = words[k].toUpperCase();
                lowerCaseVariant = words[k].toLowerCase();
                // Always leave untouched if word contains a number
                if (words[k].match(/[0-9]/)) {
                    continue;
                }
                // Transform word only if all lowercase
                if (words[k] === lowerCaseVariant) {
                    //print("   do: "+capitalise(words[k]));
                    words[k] = capitalise(words[k]);
                }
            }
        }
        lst[i] = words.join("");
    }
    doppel.string = lst.join("");
    var ret = CSL.Output.Formatters.undoppelString(doppel);
    return ret;
};

/*
* Based on a suggestion by Shoji Kajita.
*/
CSL.Output.Formatters.doppelString = function (string, rex, stopWords) {
    var ret, pos, len;
    ret = {};
    // rex is a function that returns an appropriate array.
    //
    // XXXXX: Does this work in Internet Explorer?
    //
    ret.array = rex(string, stopWords);
    //print("ret.array: "+ret.array);
    // ret.array = string.split(rex);
    ret.string = "";
    for (var i=0,ilen=ret.array.length; i<ilen; i += 2) {
        if (ret.array[i-1] === "-" && false) {
            ret.string += " " + ret.array[i];
        } else {
            ret.string += ret.array[i];
        }
    }
    return ret;
};


CSL.Output.Formatters.undoppelString = function (str) {
    var ret, len, pos;
    ret = "";
    for (var i=0,ilen=str.array.length; i<ilen; i+=1) {
        if ((i % 2)) {
            ret += str.array[i];
        } else {
            if (str.array[i-1] === "-" && false) {
                ret += str.string.slice(0, str.array[i].length+1).slice(1);
                str.string = str.string.slice(str.array[i].length+1);
            } else {
                ret += str.string.slice(0, str.array[i].length);
                str.string = str.string.slice(str.array[i].length);
            }
        }
    }
    return ret;
};


CSL.Output.Formatters.serializeItemAsRdf = function (Item) {
    return "";
};


CSL.Output.Formatters.serializeItemAsRdfA = function (Item) {
    return "";
};


CSL.demoteNoiseWords = function (state, fld, drop_or_demote) {
    var SKIP_WORDS = state.locale[state.opt.lang].opts["leading-noise-words"];
    if (fld && drop_or_demote) {
        fld = fld.split(/\s+/);
        fld.reverse();
        var toEnd = [];
        for (var j  = fld.length - 1; j > -1; j += -1) {
            if (SKIP_WORDS.indexOf(fld[j].toLowerCase()) > -1) {
                toEnd.push(fld.pop());
            } else {
                break;
            }
        }
        fld.reverse();
        var start = fld.join(" ");
        var end = toEnd.join(" ");
        if ("drop" === drop_or_demote || !end) {
            fld = start;
        } else if ("demote" === drop_or_demote) {
            fld = [start, end].join(", ");
        }
    }
    return fld;
};

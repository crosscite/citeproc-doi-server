/*global CSL: true */

CSL.Util.Names = {};

CSL.Util.Names.compareNamesets = CSL.NameOutput.prototype._compareNamesets;

/**
 * Un-initialize a name (quash caps after first character)
 */
CSL.Util.Names.unInitialize = function (state, name) {
    var i, ilen, namelist, punctlist, ret;
    if (!name) {
        return "";
    }
    namelist = name.split(/(?:\-|\s+)/);
    punctlist = name.match(/(\-|\s+)/g);
    ret = "";
    for (i = 0, ilen = namelist.length; i < ilen; i += 1) {
        // if (CSL.ALL_ROMANESQUE_REGEXP.exec(namelist[i].slice(0,-1)) 
        //    && namelist[i] 
        //    && namelist[i] !== namelist[i].toUpperCase()) {

            // More or less like this, to address the following fault report:
            // http://forums.zotero.org/discussion/17610/apsa-problems-with-capitalization-of-mc-mac-etc/

            // Leaving the name string untouched because name capitalization is varied and wonderful.
            // https://github.com/Juris-M/citeproc-js/issues/43
            
            //namelist[i] = namelist[i].slice(0, 1) + namelist[i].slice(1, 2).toLowerCase() + namelist[i].slice(2);
        // }
        ret += namelist[i];
        if (i < ilen - 1) {
            ret += punctlist[i];
        }
    }
    return ret;
};

/**
 * Initialize a name.
 */
CSL.Util.Names.initializeWith = function (state, name, terminator, normalizeOnly) {
    var i, ilen, mm, lst, ret;
    if (!name) {
        return "";
    }
    if (!terminator) {
        terminator = "";
    }
    if (["Lord", "Lady"].indexOf(name) > -1
        || (!name.replace(/^(?:<[^>]+>)*/, "").match(CSL.STARTSWITH_ROMANESQUE_REGEXP)
            && !terminator.match("%s"))) {
        return name;
    }

    if (state.opt["initialize-with-hyphen"] === false) {
        name = name.replace(/\-/g, " ");
    }

    // We need to suss out what is a set of initials or abbreviation,
    // so that they can be selectively normalized. Steps might be:
    //   (1) Split the string
    //   (2) Step through the string, deleting periods and, if initalize="false", then
    //       (a) note abbreviations and initials (separately).
    //   (3) If initialize="false" then:
    //       (a) Do the thing below, but only pushing terminator; or else
    //       (b) Do the thing below

    name = name.replace(/\s*\-\s*/g, "-").replace(/\s+/g, " ");
    name = name.replace(/-([a-z])/g, "\u2013$1");

    for (var i=name.length-2; i>-1; i += -1) {
        if (name.slice(i, i+1) === "." && name.slice(i+1, i+2) !== " ") {
            name = name.slice(0, i) + ". " + name.slice(i+1);
        }
    }

    // (1) Split the string
    var nameSplits = CSL.Output.Formatters.nameDoppel.split(name);
    var namelist = [];
    namelist = [nameSplits.strings[0]];

    if (nameSplits.tags.length === 0) {
        var mmm = namelist[0].match(/[^\.]+$/);
        if (mmm && mmm[0].length === 1 && mmm[0] !== mmm[0].toLowerCase()) {
            namelist[0] += ".";
        }
    }

    for (i = 1, ilen = nameSplits.strings.length; i < ilen; i += 1) {
        namelist.push(nameSplits.tags[i - 1]);
        namelist.push(nameSplits.strings[i]);
    }

    // Use doInitializeName or doNormalizeName, depending on requirements.
    if (normalizeOnly) {
        ret = this.doNormalize(state, namelist, terminator);
    } else {
        ret = this.doInitialize(state, namelist, terminator);
    }
    ret = ret.replace(/\u2013([a-z])/g, "-$1");
    return ret;
};

CSL.Util.Names.notag = function(str) {
    return str.replace(/^(?:<[^>]+>)*/, "");
};

CSL.Util.Names.mergetag = function(state, tagstr, newstr) {
    var m = tagstr.match(/(?:-*<[^>]+>-*)/g);
    if (!m) {
        return newstr;
    } else {
        tagstr = m.join("");
    }
    m = newstr.match(/^(.*[^\s])*(\s+)$/);
    if (m) {
        m[1] = m[1] ? m[1] : "";
        newstr = m[1] + tagstr + m[2];
    } else {
        newstr = newstr + tagstr;
    }
    return newstr;
};

CSL.Util.Names.tagonly = function(state, str) {
    var m = str.match(/(?:<[^>]+>)+/);
    if (!m) {
        return str;
    } else {
        return m.join("");
    }
};

CSL.Util.Names.doNormalize = function (state, namelist, terminator) {
    var i, ilen;
    // namelist is a flat list of given-name elements and space-like separators between them
    terminator = terminator ? terminator : "";
    // Flag elements that look like abbreviations
    var isAbbrev = [];
    for (i = 0, ilen = namelist.length; i < ilen; i += 1) {
        if (this.notag(namelist[i]).length > 1 && this.notag(namelist[i]).slice(-1) === ".") {
            // namelist[i] = namelist[i].slice(0, -1);
            namelist[i] = namelist[i].replace(/^(.*)\.(.*)$/, "$1$2");
            isAbbrev.push(true);
        } else if (namelist[i].length === 1 && namelist[i].toUpperCase() === namelist[i]) {
            isAbbrev.push(true);
        } else {
            isAbbrev.push(false);
        }
    }
    // Step through the elements of the givenname array
    for (i = 0, ilen = namelist.length; i < ilen; i += 2) {
        // If the element is not an abbreviation, leave it and its trailing spaces alone
        if (isAbbrev[i]) {
            // For all elements but the last
            if (i < namelist.length - 2) {
                // Start from scratch on space-like things following an abbreviation
                namelist[i + 1] = this.tagonly(state, namelist[i+1]);
                if (!isAbbrev[i+2]) {
                    namelist[i + 1] = this.tagonly(state, namelist[i+1]) + " ";
                }
                
                // Add the terminator to the element
                // If the following element is not a single-character abbreviation, remove a trailing zero-width non-break space, if present
                // These ops may leave some duplicate cruft in the elements and separators. This will be cleaned at the end of the function.
                if (namelist[i + 2].length > 1) {
                    namelist[i+1] = terminator.replace(/\ufeff$/, "") + namelist[i+1];
                } else {
                    namelist[i+1] = this.mergetag(state, namelist[i+1], terminator);
                }
            }
            // For the last element (if it is an abbreviation), just append the terminator
            if (i === namelist.length - 1) {
                namelist[i] = namelist[i] + terminator;
            }
        }
    }
    // Remove trailing cruft and duplicate spaces, and return
    return namelist.join("").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020\ufeff\u00a0]+$/,"").replace(/\s*\-\s*/g, "-").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020]+/g, " ");
};

CSL.Util.Names.doInitialize = function (state, namelist, terminator) {
    var i, ilen, m, j, jlen, lst, n;
    for (i = 0, ilen = namelist.length; i < ilen; i += 2) {
        n = namelist[i];
        if (!n) {
            continue;
        }
        m = n.match(CSL.NAME_INITIAL_REGEXP);
        if (!m && (!n.match(CSL.STARTSWITH_ROMANESQUE_REGEXP) && n.length > 1 && terminator.match("%s"))) {
            m = n.match(/(.)(.*)/);
        }
        if (m && m[2] && m[3]) {
            m[1] = m[1] + m[2];
            m[2] = "";
        }
        if (m && m[1].slice(0, 1) === m[1].slice(0, 1).toUpperCase()) {
            var extra = "";
            if (m[2]) {
                var s = "";
                lst = m[2].split("");
                for (j = 0, jlen = lst.length; j < jlen; j += 1) {
                    var c = lst[j];
                    if (c === c.toUpperCase()) {
                        s += c;
                    } else {
                        break;
                    }
                }
                if (s.length < m[2].length) {
                    extra = CSL.toLocaleLowerCase.call(state, s);
                }
            }
            namelist[i] = m[1] + extra;
            if (i < (ilen - 1)) {
                if (terminator.match("%s")) {
                    namelist[i] = terminator.replace("%s", namelist[i]);
                } else {
                    if (namelist[i + 1].indexOf("-") > -1) {
                        namelist[i + 1] = this.mergetag(state, namelist[i+1].replace("-", ""), terminator) + "-";
                    } else {
                        namelist[i + 1] = this.mergetag(state, namelist[i+1], terminator);
                    }
                }
            } else {
                if (terminator.match("%s")) {
                    namelist[i] = terminator.replace("%s", namelist[i]);
                } else {
                    namelist.push(terminator);
                }
            }
        } else if (n.match(CSL.ROMANESQUE_REGEXP) && (!m || !m[3])) {
            namelist[i] = " " + n;
        }
    }
    var ret = namelist.join("");
    ret = ret.replace(/[\u0009\u000a\u000b\u000c\u000d\u0020\ufeff\u00a0]+$/,"").replace(/\s*\-\s*/g, "-").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020]+/g, " ");
    return ret;
};

CSL.Util.Names.getRawName = function (name) {
    var ret = [];
    if (name.literal) {
        ret.push(name.literal);
    } else {
        if (name.given) {
            ret.push(name.given);
        }
        if (name.family) {
            ret.push(name.family);
        }
    }
    return ret.join(" ");
};

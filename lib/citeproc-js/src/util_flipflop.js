/*global CSL: true */

// Use a state machine

// Okay, good!
// Needs some tweaks:
// 1. First pass: quotes only
//    Special: Convert all sandwiched single-quote markup to apostrophe
// 2. Second pass: tags

CSL.Util.FlipFlopper = function(state) {
    
    /**
     * INTERNAL
     */

    var _nestingState = [];

    var _nestingData = {
        "<span class=\"nocase\">": {
            type: "nocase",
            opener: "<span class=\"nocase\">",
            closer: "</span>",
            attr: null,
            outer: null,
            flipflop: null
        },
        "<span class=\"nodecor\">": {
            type: "nodecor",
            opener: "<span class=\"nodecor\">",
            closer: "</span>",
            attr: "@class",
            outer: "nodecor",
            flipflop: {
                "nodecor": "nodecor"
            }
        },
        "<span style=\"font-variant:small-caps;\">": {
            type: "tag",
            opener: "<span style=\"font-variant:small-caps;\">",
            closer: "</span>",
            attr: "@font-variant",
            outer: "small-caps",
            flipflop: {
                "small-caps": "normal",
                "normal": "small-caps"
            }
        },
        "<sc>": {
            type: "tag",
            opener: "<sc>",
            closer: "</sc>",
            attr: "@font-variant",
            outer: "small-caps",
            flipflop: {
                "small-caps": "normal",
                "normal": "small-caps"
            }
        },
        "<i>": {
            type: "tag",
            opener: "<i>",
            closer: "</i>",
            attr: "@font-style",
            outer: "italic",
            flipflop: {
                "italic": "normal",
                "normal": "italic"
            }
        },
        "<b>": {
            type: "tag",
            opener: "<b>",
            closer: "</b>",
            attr: "@font-weight",
            outer: "bold",
            flipflop: {
                "bold": "normal",
                "normal": "bold"
            }
        },
        "<sup>": {
            type: "tag",
            opener: "<sup>",
            closer: "</sup>",
            attr: "@vertical-align",
            outer: "sup",
            flipflop: {
                "sub": "sup",
                "sup": "sup"
            }
        },
        "<sub>": {
            type: "tag",
            opener: "<sub>",
            closer: "</sub>",
            attr: "@vertical-align",
            outer: "sub",
            flipflop: {
                "sup": "sub",
                "sub": "sub"
            }
        },
        " \"": {
            type: "quote",
            opener: " \"",
            closer: "\"",
            attr: "@quotes",
            outer: "true",
            flipflop: {
                "true": "inner",
                "inner": "true",
                "false": "true"
            }
        },
        " \'": {
            type: "quote",
            opener: " \'",
            closer: "\'",
            attr: "@quotes",
            outer: "inner",
            flipflop: {
                "true": "inner",
                "inner": "true",
                "false": "true"
            }
        }
    };

    _nestingData["(\""] = _nestingData[" \""];
    _nestingData["(\'"] = _nestingData[" \'"];

    var localeOpenQuote = state.getTerm("open-quote");
    var localeCloseQuote = state.getTerm("close-quote");
    var localeOpenInnerQuote = state.getTerm("open-inner-quote");
    var localeCloseInnerQuote = state.getTerm("close-inner-quote");

    // If locale uses straight quotes, do not register them. All will be well.
    // Otherwise, clone straight-quote data, and adjust.
    if (localeOpenQuote && localeCloseQuote && [" \""," \'","\"","\'"].indexOf(localeOpenQuote) === -1) {
        _nestingData[localeOpenQuote] = JSON.parse(JSON.stringify(_nestingData[" \""]));
        _nestingData[localeOpenQuote].opener = localeOpenQuote;
        _nestingData[localeOpenQuote].closer = localeCloseQuote;
    }
    
    if (localeOpenInnerQuote && localeCloseInnerQuote && [" \""," \'","\"","\'"].indexOf(localeOpenInnerQuote) === -1) {
        _nestingData[localeOpenInnerQuote] = JSON.parse(JSON.stringify(_nestingData[" \'"]));
        _nestingData[localeOpenInnerQuote].opener = localeOpenInnerQuote;
        _nestingData[localeOpenInnerQuote].closer = localeCloseInnerQuote;
    }
    
    function _setOuterQuoteForm(quot) {
        var flip = {
            " \'": " \"",
            " \"": " \'",
            "(\"": "(\'",
            "(\'": "(\""
        };
        _nestingData[quot].outer = "true";
        _nestingData[flip[quot]].outer = "inner";
    }
    
    function _getNestingOpenerParams(opener) {
        var openers = [];
        var keys = Object.keys(_nestingData);
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            if (_nestingData[opener].type !== "quote" || !_nestingData[opener]) {
                openers.push(key);
            }
        }
        var ret = _nestingData[opener];
        ret.opener = new RegExp("^(?:" + openers.map(function(str){
            return str.replace("(", "\\(");
        }).join("|") + ")");
        return ret;
    }

    var _nestingParams = (function() {
        var ret = {};
        var keys = Object.keys(_nestingData);
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            ret[key] = _getNestingOpenerParams(key);
        }
        return ret;
    }());

    var _tagRex = (function() {
        var openers = [];
        var closers = [];
        var vals = {};
        for (var opener in _nestingParams) {
            openers.push(opener);
            vals[_nestingParams[opener].closer] = true;
        }
        var keys = Object.keys(vals);
        for (var i = 0, l = keys.length; i < l; i++) {
            var closer = keys[i];
            closers.push(closer);
        }

        var all = openers.concat(closers).map(function(str){
            return str.replace("(", "\\(");
        }).join("|");

        return {
            matchAll: new RegExp("((?:" + all + "))", "g"),
            splitAll: new RegExp("(?:" + all + ")", "g"),
            open: new RegExp("(^(?:" + openers.map(function(str){
                return str.replace("(", "\\(");
            }).join("|") + ")$)"),
            close: new RegExp("(^(?:" + closers.join("|") + ")$)"),
        };
    }());

    function _tryOpen(tag, pos) {
        var params = _nestingState[_nestingState.length - 1];
        if (!params || tag.match(params.opener)) {
            _nestingState.push({
                type: _nestingParams[tag].type,
                opener: _nestingParams[tag].opener,
                closer: _nestingParams[tag].closer,
                pos: pos
            });
            return false;
        } else {
            _nestingState.pop();
            _nestingState.push({
                type: _nestingParams[tag].type,
                opener: _nestingParams[tag].opener,
                closer: _nestingParams[tag].closer,
                pos: pos
            });
            return {
                fixtag: params.pos
            };
        }
    }
    
    function _tryClose(tag, pos) {
        var params = _nestingState[_nestingState.length - 1];
        if (params && tag === params.closer) {
            _nestingState.pop();
            if (params.type === "nocase") {
                return {
                    nocase: {
                        open: params.pos,
                        close: pos
                    }
                };
            } else {
                return false;
            }
        } else {
            if (params) {
                return {
                    fixtag: params.pos
                };
            } else {
                return {
                    fixtag: pos
                };
            }
        }
    }
    
    function _pushNestingState(tag, pos) {
        if (tag.match(_tagRex.open)) {
            return _tryOpen(tag, pos);
        } else {
            return _tryClose(tag, pos);
        }
    }
    
    function _doppelString(str) {
        var forcedSpaces = [];
        // Normalize markup
        str = str.replace(/(<span)\s+(style=\"font-variant:)\s*(small-caps);?\"[^>]*(>)/g, "$1 $2$3;\"$4");
        str = str.replace(/(<span)\s+(class=\"no(?:case|decor)\")[^>]*(>)/g, "$1 $2$3");

        var match = str.match(_tagRex.matchAll);
        if (!match) {
            return {
                tags: [],
                strings: [str],
                forcedSpaces: []
            };
        }
        var split = str.split(_tagRex.splitAll);

        for (var i=0,ilen=match.length-1;i<ilen;i++) {
            if (_nestingData[match[i]]) {
                if (split[i+1] === "" && ["\"", "'"].indexOf(match[i+1]) > -1) {
                    match[i+1] = " " + match[i+1];
                    forcedSpaces.push(true);
                } else {
                    forcedSpaces.push(false);
                }
            }
        }
        return {
            tags: match,
            strings: split,
            forcedSpaces: forcedSpaces
        };
    }

    var TagReg = function(blob) {
        var _stack = [];
        this.set = function (tag) {
            var attr = _nestingData[tag].attr;
            var decor = null;
            for (var i=_stack.length-1;i>-1;i--) {
                var _decor = _stack[i];
                if (_decor[0] === attr) {
                    decor = _decor;
                    break;
                }
            }
            if (!decor) {
                var allTheDecor = [state[state.tmp.area].opt.layout_decorations].concat(blob.alldecor);
                outer:
                for (var i=allTheDecor.length-1;i>-1;i--) {
                    var decorset = allTheDecor[i];
                    if (!decorset) {
                        continue;
                    }
                    for (var j=decorset.length-1;j>-1;j--) {
                        var _decor = decorset[j];
                        if (_decor[0] === attr) {
                            decor = _decor;
                            break outer;
                        }
                    }
                }
            }
            if (!decor) {
                decor = [attr, _nestingData[tag].outer];
            } else {
                decor = [attr, _nestingData[tag].flipflop[decor[1]]];
            }
            _stack.push(decor);
        };
        this.pair = function () {
            return _stack[_stack.length-1];
        };
        this.pop = function () {
            _stack.pop();
        };
    };
    
    function _apostropheForce(tag, str) {
        if (tag === "\'") {
            if (str && str.match(/^[^\,\.\?\:\;\ ]/)) {
                return "\u2019";
            }
        } else if (tag === " \'" && str && str.match(/^[\ ]/)) {
            return " \u2019";
        }
        return false;
    }

    function _undoppelToQueue(blob, doppel, leadingSpace) {
        var firstString = true;
        var tagReg = new TagReg(blob);
        blob.blobs = [];
        function Stack (blob) {
            this.stack = [blob];
            this.latest = blob;
            this.addStyling = function(str, decor) {
                if (firstString) {
                    if (str.slice(0, 1) === " ") {
                        str = str.slice(1);
                    }
                    if (str.slice(0, 1) === " ") {
                        str = str.slice(1);
                    }
                    firstString = false;
                }
                this.latest = this.stack[this.stack.length-1];
                if (decor) {
                    if ("string" === typeof this.latest.blobs) {
                        var child = new CSL.Blob();
                        child.blobs = this.latest.blobs;
                        child.alldecor = this.latest.alldecor.slice();
                        this.latest.blobs = [child];
                    }
                    var tok = new CSL.Token();
                    var newblob = new CSL.Blob(null, tok);
                    newblob.alldecor = this.latest.alldecor.slice();
                    
                    // AHA! Bad naming. There is _decorset from the list, and
                    // there WAS decorset that we are building. Dumb. Fix the
                    // names and fix it up.
                    
                    if (decor[0] === "@class" && decor[1] === "nodecor") {
                        var newdecorset = [];
                        var seen = {};
                        var allTheDecor = [state[state.tmp.area].opt.layout_decorations].concat(newblob.alldecor);
                        for (var i=allTheDecor.length-1;i>-1;i--) {
                            var _decorset = allTheDecor[i];
                            if (!_decorset) {
                                continue;
                            }
                            for (var j=_decorset.length-1;j>-1;j--) {
                                var _olddecor = _decorset[j];
                                if (["@font-weight", "@font-style", "@font-variant"].indexOf(_olddecor[0]) > -1
                                    && !seen[_olddecor[0]]) {
                                    
                                    if (decor[1] !== "normal") {
                                        newblob.decorations.push([_olddecor[0], "normal"]);
                                        newdecorset.push([_olddecor[0], "normal"]);
                                    }
                                    seen[_olddecor[0]] = true;
                                }
                            }
                        }
                        newblob.alldecor.push(newdecorset);
                        
                    } else {
                        newblob.decorations.push(decor);
                        newblob.alldecor.push([decor]);
                    }
                    this.latest.blobs.push(newblob);
                    this.stack.push(newblob);
                    this.latest = newblob;
                    if (str) {
                        var tok = new CSL.Token();
                        var newblob = new CSL.Blob(null, tok);
                        newblob.blobs = str;
                        newblob.alldecor = this.latest.alldecor.slice();
                        this.latest.blobs.push(newblob);
                    }
                } else {
                    if (str) {
                        var child = new CSL.Blob();
                        child.blobs = str;
                        child.alldecor = this.latest.alldecor.slice();
                        this.latest.blobs.push(child);
                    }
                }
            };
            this.popStyling = function() {
                this.stack.pop();
            };
        }
        var stack = new Stack(blob);
        if (doppel.strings.length) {
            var str = doppel.strings[0];
            if (leadingSpace) {
                str = " " + str;
            }
            stack.addStyling(str);
        }
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            if (tag.match(_tagRex.open)) {
                tagReg.set(tag);
                stack.addStyling(str, tagReg.pair());
            } else {
                tagReg.pop();
                stack.popStyling();
                stack.addStyling(str);
            }
        }
    }

    /**
     * PUBLIC
     */

    this.processTags = function (blob) {
        var str = blob.blobs;
        var leadingSpace = false;
        if (str.slice(0, 1) === " " && !str.match(/^\s+[\'\"]/)) {
            leadingSpace = true;
        }
        var rex = new RegExp("(" + CSL.ROMANESQUE_REGEXP.source + ")\u2019(" + CSL.ROMANESQUE_REGEXP.source + ")", "g");
        var str = " " + str.replace(rex, "$1\'$2");
        var doppel = _doppelString(str);
        if (doppel.tags.length === 0) {
            return;
        }
        var quoteFormSeen = false;
        
    	for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            var apostrophe = _apostropheForce(tag, str);
            if (apostrophe) {
                doppel.strings[i+1] = apostrophe + doppel.strings[i+1];
                doppel.tags[i] = "";
            } else {
                var tagInfo;
                while (true) {
                    tagInfo = _pushNestingState(tag, i);
                    if (tagInfo) {
                        if (Object.keys(tagInfo).indexOf("fixtag") > -1) {
                            if (tag.match(_tagRex.close)
                                && tag === "\'") {
                                
                                doppel.strings[i+1] = "\u2019" + doppel.strings[i+1];
                                doppel.tags[i] = "";
                            } else {
                                var failedTag = doppel.tags[tagInfo.fixtag];
                                if (doppel.forcedSpaces[tagInfo.fixtag-1]) {
                                    failedTag = failedTag.slice(1);
                                }
                                doppel.strings[tagInfo.fixtag+1] = failedTag + doppel.strings[tagInfo.fixtag+1];
                                doppel.tags[tagInfo.fixtag] = "";
                            }
                            if (_nestingState.length > 0) {
                                if (tag !== "\'") {
                                    _nestingState.pop();
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        } else if (tagInfo.nocase) {
                            doppel.tags[tagInfo.nocase.open] = "";
                            doppel.tags[tagInfo.nocase.close] = "";
                            break;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                if (tagInfo && (tagInfo.fixtag|| tagInfo.fixtag === 0)) {
                    doppel.strings[i+1] = doppel.tags[i] + doppel.strings[i+1];
                    doppel.tags[i] = "";
                }
            }
        }
        // Stray tags are neutralized here
        for (var i=_nestingState.length-1;i>-1;i--) {
            var tagPos = _nestingState[i].pos;
            var tag = doppel.tags[tagPos];
            if (tag === " \'" || tag === "\'") {

                doppel.strings[tagPos+1] = " \u2019" + doppel.strings[tagPos+1];
            } else {
                doppel.strings[tagPos+1] = doppel.tags[tagPos] + doppel.strings[tagPos+1];
            }
            doppel.tags[tagPos] = "";
            _nestingState.pop();
        }
        for (var i=doppel.tags.length-1;i>-1;i--) {
            if (!doppel.tags[i]) {
                doppel.tags = doppel.tags.slice(0,i).concat(doppel.tags.slice(i+1));
                doppel.strings[i] = doppel.strings[i] + doppel.strings[i+1];
                doppel.strings = doppel.strings.slice(0,i+1).concat(doppel.strings.slice(i+2));
            }
        }
        // Sniff initial (outer) quote form (single or double) and configure parser
        // Also add leading spaces.
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var forcedSpace = doppel.forcedSpaces[i-1];
            if ([" \"", " \'", "(\"", "(\'"].indexOf(tag) > -1) {
                if (!quoteFormSeen) {
                    _setOuterQuoteForm(tag);
                    quoteFormSeen = true;
                }
                if (!forcedSpace) {
                    doppel.strings[i] += tag.slice(0, 1);
                }
            }
        }
        //print(JSON.stringify(doppel, null, 2))
        //print(_undoppelString(doppel));
        _undoppelToQueue(blob, doppel, leadingSpace);
    };
};

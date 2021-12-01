/*global CSL: true */

CSL.NameOutput = function(state, Item, item) {
    this.debug = false;
    //SNIP-START
    if (this.debug) {
        print("(1)");
    }
    //SNIP-END
    this.state = state;
    this.Item = Item;
    this.item = item;
    this.nameset_base = 0;
    this.etal_spec = {};
    this._first_creator_variable = false;
    this._please_chop = false;
};

CSL.NameOutput.prototype.init = function (names) {
    this.requireMatch = names.requireMatch;
    if (this.state.tmp.term_predecessor) {
        this.state.tmp.subsequent_author_substitute_ok = false;
    }
    if (this.nameset_offset) {
        this.nameset_base = this.nameset_base + this.nameset_offset;
    }
    this.nameset_offset = 0;
    this.names = names;
    this.variables = names.variables;

    this.state.tmp.value = [];
    this.state.tmp.rendered_name = [];
    this.state.tmp.label_blob = false;
    this.state.tmp.etal_node = false;
    this.state.tmp.etal_term = false;
    for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
        if (this.Item[this.variables[i]] && this.Item[this.variables[i]].length) {
            this.state.tmp.value = this.state.tmp.value.concat(this.Item[this.variables[i]]);
        }
    }
    this["et-al"] = undefined;
    // REMOVE THIS
    this["with"] = undefined;

    this.name = undefined;
    // long, long-with-short, short
    this.institutionpart = {};
    // family, given
    //this.namepart = {};
    // before, after
    //this.label = {};

    this.state.tmp.group_context.tip.variable_attempt = true;

    this.labelVariable = this.variables[0];

    if (!this.state.tmp.value.length) {
        return;
    }

    // Abort and proceed to the next substitution if a match is required,
    // two variables are called, and they do not match.
    var checkCommonTerm = this.checkCommonAuthor(this.requireMatch);
    if (checkCommonTerm) {
        this.state.tmp.can_substitute.pop();
        this.state.tmp.can_substitute.push(true);
        //this.state.tmp.group_context.mystack[this.state.tmp.group_context.mystack.length-1].variable_success = false;
        for (var i in this.variables) {
            var idx = this.state.tmp.done_vars.indexOf(this.variables[i]);
            if (idx > -1) {
                this.state.tmp.done_vars = this.state.tmp.done_vars.slice(0, idx).concat(this.state.tmp.done_vars.slice(i+1));
            }
        }
        this.state.tmp.common_term_match_fail = true;
        this.variables = [];
    }
};


CSL.NameOutput.prototype.reinit = function (names, labelVariable) {
    this.requireMatch = names.requireMatch;
    this.labelVariable = labelVariable;

    if (this.state.tmp.can_substitute.value()) {
        this.nameset_offset = 0;
        // What-all should be carried across from the subsidiary
        // names node, and on what conditions? For each attribute,
        // and decoration, is it an override, or is it additive?
        this.variables = names.variables;
        
        // Not sure why this is necessary. Guards against a memory leak perhaps?
        var oldval = this.state.tmp.value.slice();
        this.state.tmp.value = [];

        for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
            if (this.Item[this.variables[i]] && this.Item[this.variables[i]].length) {
                this.state.tmp.value = this.state.tmp.value.concat(this.Item[this.variables[i]]);
            }
        }
        if (this.state.tmp.value.length) {
            this.state.tmp.can_substitute.replace(false, CSL.LITERAL);
        }

        this.state.tmp.value = oldval;

    }
    // Abort and proceed to the next substitution if a match is required,
    // two variables are called, and they do not match.
    var checkCommonTerm = this.checkCommonAuthor(this.requireMatch);
    if (checkCommonTerm) {
        this.state.tmp.can_substitute.pop();
        this.state.tmp.can_substitute.push(true);
        for (var i in this.variables) {
            var idx = this.state.tmp.done_vars.indexOf(this.variables[i]);
            if (idx > -1) {
                this.state.tmp.done_vars = this.state.tmp.done_vars.slice(0, idx).concat(this.state.tmp.done_vars.slice(i+1));
            }
        }
        this.variables = [];
    }
};

CSL.NameOutput.prototype.outputNames = function () {
    var i, ilen;
    var variables = this.variables;
    if (this.institution.and) {
        if (!this.institution.and.single.blobs || !this.institution.and.single.blobs.length) {
            this.institution.and.single.blobs = this.name.and.single.blobs;
        }
        if (!this.institution.and.multiple.blobs || !this.institution.and.multiple.blobs.length) {
            this.institution.and.multiple.blobs = this.name.and.multiple.blobs;
        }
    }

    this.variable_offset = {};
    if (this.family) {
        this.family_decor = CSL.Util.cloneToken(this.family);
        this.family_decor.strings.prefix = "";
        this.family_decor.strings.suffix = "";
        // Sets text-case value (text-case="title" is suppressed for items
        // non-English with non-English value in Item.language)
        for (i = 0, ilen = this.family.execs.length; i < ilen; i += 1) {
            this.family.execs[i].call(this.family_decor, this.state, this.Item);
        }
    } else {
        this.family_decor = false;
    }

    if (this.given) {
        this.given_decor = CSL.Util.cloneToken(this.given);
        this.given_decor.strings.prefix = "";
        this.given_decor.strings.suffix = "";
        // Sets text-case value (text-case="title" is suppressed for items
        // non-English with non-English value in Item.language)
        for (i = 0, ilen = this.given.execs.length; i < ilen; i += 1) {
            this.given.execs[i].call(this.given_decor, this.state, this.Item);
        }
    } else {
        this.given_decor = false;
    }

    //SNIP-START
    if (this.debug) {
        print("(2)");
    }
    //SNIP-END
    // util_names_etalconfig.js
    this.getEtAlConfig();
    //SNIP-START
    if (this.debug) {
        print("(3)");
    }
    //SNIP-END
    // util_names_divide.js
    this.divideAndTransliterateNames();
    //SNIP-START
    if (this.debug) {
        print("(4)");
    }
    //SNIP-END
    // util_names_truncate.js

    this.truncatePersonalNameLists();
    //SNIP-START
    if (this.debug) {
        print("(5)");
    }
    //SNIP-END

    //SNIP-START
    if (this.debug) {
        print("(6)");
    }
    //SNIP-END
    // util_names_disambig.js
    this.disambigNames();

    // util_names_constraints.js
    this.constrainNames();
    //SNIP-START
    if (this.debug) {
        print("(7)");
    }
    //SNIP-END
    // form="count"
    if (this.name.strings.form === "count") {
        if (this.state.tmp.extension || this.names_count != 0) {
            this.state.output.append(this.names_count, "empty");
            this.state.tmp.group_context.tip.variable_success = true;
        }
        return;
    }

    //SNIP-START
    if (this.debug) {
        print("(8)");
    }
    //SNIP-END
    this.setEtAlParameters();
    //SNIP-START
    if (this.debug) {
        print("(9)");
    }
    //SNIP-END
    this.setCommonTerm(this.requireMatch);
    //SNIP-START
    if (this.debug) {
        print("(10)");
    }
    //SNIP-END
    this.renderAllNames();
    //SNIP-START
    if (this.debug) {
        print("(11)");
    }
    //SNIP-END
    var blob_list = [];
    for (i = 0, ilen = variables.length; i < ilen; i += 1) {
        var v = variables[i];
        var institution_sets = [];
        var institutions = false;
        var varblob = null;
        if (!this.state.opt.development_extensions.spoof_institutional_affiliations) {
            varblob = this._join([this.freeters[v]], "");
        } else {
            //SNIP-START
            if (this.debug) {
                print("(11a)");
            }
            //SNIP-END
            for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
                institution_sets.push(this.joinPersonsAndInstitutions([this.persons[v][j], this.institutions[v][j]]));
            }
            //SNIP-START
            if (this.debug) {
                print("(11b)");
            }
            //SNIP-END
            if (this.institutions[v].length) {
                var pos = this.nameset_base + this.variable_offset[v];
                if (this.freeters[v].length) {
                    pos += 1;
                }
                institutions = this.joinInstitutionSets(institution_sets, pos);
            }
            //SNIP-START
            if (this.debug) {
                print("(11c)");
            }
            //SNIP-END
            var varblob = this.joinFreetersAndInstitutionSets([this.freeters[v], institutions]);
            //SNIP-START
            if (this.debug) {
                print("(11d)");
            }
            //SNIP-END
        }
        if (varblob) {
            // Apply labels, if any
            if (!this.state.tmp.extension) {
                varblob = this._applyLabels(varblob, v);
            }
            blob_list.push(varblob);
        }
        //SNIP-START
        if (this.debug) {
            print("(11e)");
        }
        //SNIP-END
        if (this.common_term) {
            break;
        }
    }
    //SNIP-START
    if (this.debug) {
        print("(12)");
    }
    //SNIP-END
    this.state.output.openLevel("empty");
    this.state.output.current.value().strings.delimiter = this.state.inheritOpt(this.names, "delimiter", "names-delimiter");
    //SNIP-START
    if (this.debug) {
        print("(13)");
    }
    //SNIP-END
    for (i = 0, ilen = blob_list.length; i < ilen; i += 1) {
        // notSerious
        this.state.output.append(blob_list[i], "literal", true);
    }
    if (!this.state.tmp.just_looking && blob_list.length > 0) {
        this.state.tmp.probably_rendered_something = true;
    }
    //SNIP-START
    if (this.debug) {
        print("(14)");
    }
    //SNIP-END
    this.state.output.closeLevel("empty");
    //SNIP-START
    if (this.debug) {
        print("(15)");
    }
    //SNIP-END
    var blob = this.state.output.pop();
    this.state.tmp.name_node.top = blob;
    //SNIP-START
    if (this.debug) {
        print("(16)");
    }
    //SNIP-END

    // Append will drop the names on the floor here if suppress-me is
    // set on element_trace.
    // Need to rescue the value for collapse comparison.
    var namesToken = CSL.Util.cloneToken(this.names);
    if (this.state.tmp.group_context.tip.condition) {
        CSL.UPDATE_GROUP_CONTEXT_CONDITION(this.state, this.names.strings.prefix, null, this.names);
    }
    this.state.output.append(blob, namesToken);
    if (this.state.tmp.term_predecessor_name) {
        this.state.tmp.term_predecessor = true;
    }
    //SNIP-START
    if (this.debug) {
        print("(17)");
    }
    //SNIP-END
    // Also used in CSL.Util.substituteEnd (which could do with
    // some cleanup at this writing).
    //SNIP-START
    if (this.debug) {
        print("(18)");
    }
    //SNIP-END
    if (variables[0] !== "authority") {
        // Just grab the string values in the name
        var name_node_string = [];
        var nameobjs = this.Item[variables[0]];
        if (nameobjs) {
            for (var i = 0, ilen = nameobjs.length; i < ilen; i += 1) {
                var substring = CSL.Util.Names.getRawName(nameobjs[i]);
                if (substring) {
                    name_node_string.push(substring);
                }
            }
        }
        name_node_string = name_node_string.join(", ");
        if (name_node_string) {
            this.state.tmp.name_node.string = name_node_string;
        }
    }
    // for classic support
    // This may be more convoluted than it needs to be. Or maybe not.
    //
    // Check for classic abbreviation
    //
    // If found, then (1) suppress title rendering, (2) replace the node
    // with the abbreviation output [and (3) do not run this._collapseAuthor() ?]
    if (this.state.tmp.name_node.string && !this.state.tmp.first_name_string) {
        this.state.tmp.first_name_string = this.state.tmp.name_node.string;
    }
    if ("classic" === this.Item.type) {
        if (this.state.tmp.first_name_string) {
            var author_title = [];
            author_title.push(this.state.tmp.first_name_string);
            if (this.Item.title) {
                author_title.push(this.Item.title);
            }
            author_title = author_title.join(", ");
            if (author_title && this.state.sys.getAbbreviation) {
                if (this.state.sys.normalizeAbbrevsKey) {
                    author_title = this.state.sys.normalizeAbbrevsKey("classic", author_title);
                }
                this.state.transform.loadAbbreviation("default", "classic", author_title, this.Item.language);
                if (this.state.transform.abbrevs["default"].classic[author_title]) {
                    this.state.tmp.done_vars.push("title");
                    this.state.output.append(this.state.transform.abbrevs["default"].classic[author_title], "empty", true);
                    blob = this.state.output.pop();
				    this.state.tmp.name_node.top.blobs.pop();
                    this.state.tmp.name_node.top.blobs.push(blob);
                }
            }
        }
    }

    // Let's try something clever here.
    this._collapseAuthor();

    // For name_SubstituteOnNamesSpanNamesSpanFail
    this.variables = [];
    
    // Reset stop-last after rendering
    this.state.tmp.authority_stop_last = 0;

    //SNIP-START
    if (this.debug) {
        print("(19)");
    }
    //SNIP-END
};

CSL.NameOutput.prototype._applyLabels = function (blob, v) {
    var txt;
    if (!this.label || !this.label[this.labelVariable]) {
        return blob;
    }
    var plural = 0;
    var num = this.freeters_count[v] + this.institutions_count[v];
    if (num > 1) {
        plural = 1;
    } else {
        for (var i = 0, ilen = this.persons[v].length; i < ilen; i += 1) {
            num += this.persons_count[v][i];
        }
        if (num > 1) {
            plural = 1;
        }
    }
    // Some code duplication here, should be factored out.
    if (this.label[this.labelVariable].before) {
        if ("number" === typeof this.label[this.labelVariable].before.strings.plural) {
            plural = this.label[this.labelVariable].before.strings.plural;
        }
        txt = this._buildLabel(v, plural, "before", this.labelVariable);
        this.state.output.openLevel("empty");
        this.state.output.append(txt, this.label[this.labelVariable].before, true);
        this.state.output.append(blob, "literal", true);
        this.state.output.closeLevel("empty");
        blob = this.state.output.pop();
    } else if (this.label[this.labelVariable].after) {
        if ("number" === typeof this.label[this.labelVariable].after.strings.plural) {
            plural = this.label[this.labelVariable].after.strings.plural;
        }
        txt = this._buildLabel(v, plural, "after", this.labelVariable);
        this.state.output.openLevel("empty");
        this.state.output.append(blob, "literal", true);
        this.state.output.append(txt, this.label[this.labelVariable].after, true);
        this.state.tmp.label_blob = this.state.output.pop();
        this.state.output.append(this.state.tmp.label_blob,"literal",true);
        this.state.output.closeLevel("empty");
        blob = this.state.output.pop();
    }
    return blob;
};

CSL.NameOutput.prototype._buildLabel = function (term, plural, position, v) {
    if (this.common_term) {
        term = this.common_term;
    }

    var ret = false;
    var node = this.label[v][position];
    if (node) {
        ret = CSL.castLabel(this.state, node, term, plural, CSL.TOLERANT);
    }
    return ret;
};


CSL.NameOutput.prototype._collapseAuthor = function () {
    var myqueue, mystr, oldchars;
    // collapse can be undefined, an array of length zero, and probably
    // other things ... ugh.
    if (this.state.tmp.name_node.top.blobs.length === 0) {
        return;
    }
    if (this.nameset_base === 0 && this.Item[this.variables[0]] && !this._first_creator_variable) {
        this._first_creator_variable = this.variables[0];
    }
    if ((this.state[this.state.tmp.area].opt.collapse
            && this.state[this.state.tmp.area].opt.collapse.length)
        || (this.state[this.state.tmp.area].opt.cite_group_delimiter 
            && this.state[this.state.tmp.area].opt.cite_group_delimiter.length)) {

        if (this.state.tmp.authorstring_request) {
            // Avoid running this on every call to getAmbiguousCite()?
            mystr = "";
            myqueue = this.state.tmp.name_node.top.blobs.slice(-1)[0].blobs;
            oldchars = this.state.tmp.offset_characters;
            if (myqueue) {
                mystr = this.state.output.string(this.state, myqueue, false);
            }
            // Avoid side-effects on character counting: we're only interested
            // in the final rendering.
            this.state.tmp.offset_characters = oldchars;
            this.state.registry.authorstrings[this.Item.id] = mystr;
        } else if (!this.state.tmp.just_looking
                   && !this.state.tmp.suppress_decorations && ((this.state[this.state.tmp.area].opt.collapse && this.state[this.state.tmp.area].opt.collapse.length) || this.state[this.state.tmp.area].opt.cite_group_delimiter && this.state[this.state.tmp.area].opt.cite_group_delimiter)) {
            // XX1 print("RENDER: "+this.Item.id);
            mystr = "";
            myqueue = this.state.tmp.name_node.top.blobs.slice(-1)[0].blobs;
            oldchars = this.state.tmp.offset_characters;
            if (myqueue) {
                mystr = this.state.output.string(this.state, myqueue, false);
            }
            if (mystr === this.state.tmp.last_primary_names_string) {
                if (this.item["suppress-author"] || (this.state[this.state.tmp.area].opt.collapse && this.state[this.state.tmp.area].opt.collapse.length)) {
                    // XX1 print("    CUT!");
                    this.state.tmp.name_node.top.blobs.pop();
                    this.state.tmp.name_node.children = [];
                    // If popped, avoid side-effects on character counting: we're only interested
                    // in things that actually render.
                    this.state.tmp.offset_characters = oldchars;
                }
                // Needed
                if (this.state[this.state.tmp.area].opt.cite_group_delimiter && this.state[this.state.tmp.area].opt.cite_group_delimiter) {
                    this.state.tmp.use_cite_group_delimiter = true;
                }
            } else {
                // XX1 print("remembering: "+mystr);
                this.state.tmp.last_primary_names_string = mystr;
                // XXXXX A little more precision would be nice.
                // This will clobber variable="author editor" as well as variable="author".

                if (this.variables.indexOf(this._first_creator_variable) > -1 && this.item && this.item["suppress-author"] && this.Item.type !== "legal_case") {
                    this.state.tmp.name_node.top.blobs.pop();
                    this.state.tmp.name_node.children = [];
                    // If popped, avoid side-effects on character counting: we're only interested
                    // in things that actually render.
                    this.state.tmp.offset_characters = oldchars;

                    // A wild guess, but will usually be correct
                    this.state.tmp.term_predecessor = false;
                }
                // Arcane and probably unnecessarily complicated?
                this.state.tmp.have_collapsed = false;
                // Needed
                if (this.state[this.state.tmp.area].opt.cite_group_delimiter && this.state[this.state.tmp.area].opt.cite_group_delimiter) {
                    this.state.tmp.use_cite_group_delimiter = false;
                }
            }
        }
    }
};

/*
CSL.NameOutput.prototype.suppressNames = function() {
    suppress_condition = suppress_min && display_names.length >= suppress_min;
    if (suppress_condition) {
        continue;
    }
}
*/

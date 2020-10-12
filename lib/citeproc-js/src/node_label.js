/*global CSL: true */

CSL.Node.label = {
    build: function (state, target) {
        
        if (this.strings.term) {
            // Non-names labels
            var func = function (state, Item, item) {
                // Must accomplish this without touching strings
                // shared with the calling application: "sub verbo"
                // and "sub-verbo" must both pass, as they stand.
                //if (item && item.label === "sub verbo") {
                //    item.label = "sub-verbo";
                //}
                // This is abstracted away, because the same
                // logic must be run in cs:names.
                var termtxt = CSL.evaluateLabel(this, state, Item, item);
                if (item && this.strings.term === "locator") {

                    item.section_form_override = this.strings.form;

                }
                if (termtxt) {
                    state.tmp.group_context.tip.term_intended = true;
                }
                CSL.UPDATE_GROUP_CONTEXT_CONDITION(state, termtxt, null, this);
                if (termtxt.indexOf("%s") === -1) {
                    // ^ Suppress output here if we have an embedded term
                    if (this.strings.capitalize_if_first) {
                        if (!state.tmp.term_predecessor && !(state.opt["class"] === "in-text" && state.tmp.area === "citation")) {
                            termtxt = CSL.Output.Formatters["capitalize-first"](state, termtxt);
                        }
                    }
                    state.output.append(termtxt, this);
                }
            };
            this.execs.push(func);
        } else {
            if (!this.strings.form) {
                this.strings.form = "long";
            }
            // Names labels
            // Picked up in names END
            var namevars = state.build.names_variables[state.build.names_variables.length-1];
            var namelabels = state.build.name_label[state.build.name_label.length-1];
            for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                if (!namelabels[namevars[i]]) {
                    namelabels[namevars[i]] = {};
                }
            }
            if (!state.build.name_flag) {
                for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                    namelabels[namevars[i]].before = this;
                }
            } else {
                for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                    namelabels[namevars[i]].after = this;
                }
            }
        }
        target.push(this);
    }
};

/*global CSL: true */

CSL.evaluateLabel = function (node, state, Item, item) {
    var myterm;
    if ("locator" === node.strings.term) {
        if (item && item.label) {
            if (item.label === "sub verbo") {
                myterm = "sub-verbo";
            } else {
                myterm = item.label;
            }
        }
        if (!myterm) {
            myterm = "page";
        }
    } else {
        myterm = node.strings.term;
    }
    
    // Plurals detection.
    var plural = node.strings.plural;
    if ("number" !== typeof plural) {
        // (node, ItemObject, variable, type)
        var theItem = (item && node.strings.term === "locator") ? item : Item;
        if (theItem[node.strings.term]) {
            state.processNumber(false, theItem, node.strings.term, Item.type);
            plural = state.tmp.shadow_numbers[node.strings.term].plural;
            if (!state.tmp.shadow_numbers[node.strings.term].labelForm
                && !state.tmp.shadow_numbers[node.strings.term].labelDecorations) {
                if (node.strings.form) {
                    state.tmp.shadow_numbers[node.strings.term].labelForm = node.strings.form;
                } else if (state.tmp.group_context.tip.label_form) {
                    state.tmp.shadow_numbers[node.strings.term].labelForm = state.tmp.group_context.tip.label_form;
                }
                state.tmp.shadow_numbers[node.strings.term].labelCapitalizeIfFirst = node.strings.capitalize_if_first;
                state.tmp.shadow_numbers[node.strings.term].labelDecorations = node.decorations.slice();
            }
            
            if (["locator", "number", "page"].indexOf(node.strings.term) > -1 && state.tmp.shadow_numbers[node.strings.term].label) {
                myterm = state.tmp.shadow_numbers[node.strings.term].label;
            }
            if (node.decorations && state.opt.development_extensions.csl_reverse_lookup_support) {
                node.decorations.reverse();
                node.decorations.push(["@showid","true", node.cslid]);
                node.decorations.reverse();
            }
        }
    }
    return CSL.castLabel(state, node, myterm, plural, CSL.TOLERANT);
};

CSL.castLabel = function (state, node, term, plural, mode) {
    var label_form = node.strings.form;
    var label_capitalize_if_first = node.strings.capitalize_if_first;
    if (state.tmp.group_context.tip.label_form) {
        if (label_form === "static") {
            state.tmp.group_context.tip.label_static = true;
        } else {
            label_form = state.tmp.group_context.tip.label_form;
        }
    }

    if (state.tmp.group_context.tip.label_capitalize_if_first) {
        label_capitalize_if_first = state.tmp.group_context.tip.label_capitalize_if_first;
    }
    var ret = state.getTerm(term, label_form, plural, false, mode, node.default_locale);
    if (label_capitalize_if_first) {
        ret = CSL.Output.Formatters["capitalize-first"](state, ret);
    }
    // XXXXX Cut-and-paste code in multiple locations. This code block should be
    // collected in a function.
    // Tag: strip-periods-block
    if (state.tmp.strip_periods) {
        ret = ret.replace(/\./g, "");
    } else {
        for (var i = 0, ilen = node.decorations.length; i < ilen; i += 1) {
            if ("@strip-periods" === node.decorations[i][0] && "true" === node.decorations[i][1]) {
                ret = ret.replace(/\./g, "");
                break;
            }
        }
    }
    return ret;
};

/*global CSL: true */

CSL.Node.alternative = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {

            var choose_tok = new CSL.Token("choose", CSL.START);
            CSL.Node["choose"].build.call(choose_tok, state, target);

            var if_tok = new CSL.Token("if", CSL.START);
            CSL.Attributes["@alternative-node-internal"].call(if_tok, state);
            CSL.Node["if"].build.call(if_tok, state, target);

            var func = function(state, Item) {

                state.tmp.oldItem = Item;
                state.tmp.oldLang = state.opt.lang;
                state.tmp.abort_alternative = true;

                if (Item["language-name"] && Item["language-name-original"]) {

                    var newItem = JSON.parse(JSON.stringify(Item));

                    newItem.language = newItem["language-name"];
                    var langspec = CSL.localeResolve(newItem.language, state.opt["default-locale"][0]);

                    if (state.opt.multi_layout) {
                        for (var i in state.opt.multi_layout) {
                            var locale_list = state.opt.multi_layout[i];
                            var gotlang = false;
                            for (var j in locale_list) {
                                var tryspec = locale_list[j];
                                if (langspec.best === tryspec.best || langspec.base === tryspec.base || langspec.bare === tryspec.bare) {
                                    gotlang = locale_list[0].best;
                                    break;
                                }
                            }
                            if (!gotlang) {
                                gotlang = state.opt["default-locale"][0];
                            }
                            state.opt.lang = gotlang;
                        }
                    }

                    for (var key in newItem) {
                        if (["id", "type", "language", "multi"].indexOf(key) === -1 && key.slice(0, 4) !== "alt-") {
                            if (newItem.multi && newItem.multi._keys[key]) {
                                var deleteme = true;
                                for (var lang in newItem.multi._keys[key]) {
                                    if (langspec.bare === lang.replace(/^([a-zA-Z]+).*/, "$1")) {
                                        deleteme = false;
                                        break;
                                    }
                                }
                                if (deleteme) {
                                    delete newItem[key];
                                }
                            } else {
                                delete newItem[key];
                            }
                        }
                    }
                    for (var key in newItem) {
                        if (key.slice(0, 4) === "alt-") {
                            newItem[key.slice(4)] = newItem[key];
                            state.tmp.abort_alternative = false;
                        } else {
                            if (newItem.multi && newItem.multi._keys) {
                                if (!newItem["alt-" + key] && newItem.multi._keys[key]) {
                                    if (newItem.multi._keys[key][langspec.best]) {
                                        newItem[key] = newItem.multi._keys[key][langspec.best];
                                        state.tmp.abort_alternative = false;
                                    } else if (newItem.multi._keys[key][langspec.base]) {
                                        newItem[key] = newItem.multi._keys[key][langspec.base];
                                        state.tmp.abort_alternative = false;
                                    } else if (newItem.multi._keys[key][langspec.bare]) {
                                        newItem[key] = newItem.multi._keys[key][langspec.bare];
                                        state.tmp.abort_alternative = false;
                                    }
                                }
                            }
                        }
                    }
                }

                state.output.openLevel(this);
                state.registry.refhash[Item.id] = newItem;
                state.nameOutput = new CSL.NameOutput(state, newItem);
            };
            this.execs.push(func);
            target.push(this);

            var choose_tok = new CSL.Token("choose", CSL.START);
            CSL.Node["choose"].build.call(choose_tok, state, target);

            var if_tok = new CSL.Token("if", CSL.START);
            CSL.Attributes["@alternative-node-internal"].call(if_tok, state);
            var func = function(state) {
                state.tmp.abort_alternative = true;
            }
            if_tok.execs.push(func);
            CSL.Node["if"].build.call(if_tok, state, target);

        } else if (this.tokentype === CSL.END) {

            var if_tok = new CSL.Token("if", CSL.END);
            CSL.Node["if"].build.call(if_tok, state, target);

            var choose_tok = new CSL.Token("choose", CSL.END);
            CSL.Node["choose"].build.call(choose_tok, state, target);

            var func = function(state, Item) {
                state.output.closeLevel();
                state.registry.refhash[Item.id] = state.tmp.oldItem;
                state.opt.lang = state.tmp.oldLang;
                state.nameOutput = new CSL.NameOutput(state, state.tmp.oldItem);
                state.tmp.abort_alternative = false;
            };
            this.execs.push(func);
            target.push(this);

            var if_tok = new CSL.Token("if", CSL.END);
            CSL.Node["if"].build.call(if_tok, state, target);

            var choose_tok = new CSL.Token("choose", CSL.END);
            CSL.Node["choose"].build.call(choose_tok, state, target);

        }
    }
};

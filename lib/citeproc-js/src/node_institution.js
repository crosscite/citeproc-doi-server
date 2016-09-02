/*global CSL: true */

CSL.Node.institution = {
    build: function (state, target) {
        if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {

            var func = function (state, Item) {

                if ("string" === typeof state.build.name_delimiter && !this.strings.delimiter) {
                    this.strings.delimiter = state.tmp.name_delimiter;
                }

                var myand, and_default_prefix, and_suffix;
                // This is the same code for the same result as in node_name.js, 
                // but when cs:institution comes on stream, it may produce
                // different results.
                if ("text" === this.strings.and) {
                    this.and_term = state.getTerm("and", "long", 0);
                } else if ("symbol" === this.strings.and) {
                    if (state.opt.development_extensions.expect_and_symbol_form) {
                        this.and_term = state.getTerm("and", "symbol", 0);
                    } else {
                        this.and_term = "&";
                    }
                } else if ("none" === this.strings.and) {
                    this.and_term = this.strings.delimiter;
                }
                if ("undefined" === typeof this.and_term && state.tmp.and_term) {
                    this.and_term = state.getTerm("and", "long", 0);
                }
                if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(this.and_term)) {
                    this.and_prefix_single = " ";
                    this.and_prefix_multiple = ", ";
                    if ("string" === typeof this.strings.delimiter) {
                        this.and_prefix_multiple = this.strings.delimiter;
                    }
                    this.and_suffix = " ";
                } else {
                    this.and_prefix_single = "";
                    this.and_prefix_multiple = "";
                    this.and_suffix = "";
                }
                if (this.strings["delimiter-precedes-last"] === "always") {
                    this.and_prefix_single = this.strings.delimiter;
                } else if (this.strings["delimiter-precedes-last"] === "never") {
                    // Slightly fragile: could test for charset here to make
                    // this more certain.
                    if (this.and_prefix_multiple) {
                        this.and_prefix_multiple = " ";
                    }
                }
                
                this.and = {};
                if ("undefined" !== typeof this.and_term) {
                    state.output.append(this.and_term, "empty", true);
                    this.and.single = state.output.pop();
                    this.and.single.strings.prefix = this.and_prefix_single;
                    this.and.single.strings.suffix = this.and_suffix;
                    state.output.append(this.and_term, "empty", true);
                    this.and.multiple = state.output.pop();
                    this.and.multiple.strings.prefix = this.and_prefix_multiple;
                    this.and.multiple.strings.suffix = this.and_suffix;
                } else if ("undefined" !== this.strings.delimiter) {
                    this.and.single = new CSL.Blob(this.strings.delimiter);
                    this.and.single.strings.prefix = "";
                    this.and.single.strings.suffix = "";
                    this.and.multiple = new CSL.Blob(this.strings.delimiter);
                    this.and.multiple.strings.prefix = "";
                    this.and.multiple.strings.suffix = "";
                }
                
                /*
                  if (this.strings["delimiter-precedes-last"] === "always") {
                  this.and.single.strings.prefix = this.strings.delimiter;
                  this.and.multiple.strings.prefix = this.strings.delimiter;
                  } else if (this.strings["delimiter-precedes-last"] === "contextual") {
                  this.and.single.strings.prefix = and_default_prefix;
                  this.and.multiple.strings.prefix = this.strings.delimiter;
                  } else {
                  this.and.single.strings.prefix = and_default_prefix;
                  this.and.multiple.strings.prefix = and_default_prefix;
                  }
                */
                state.nameOutput.institution = this;
            };
            this.execs.push(func);
        }
        target.push(this);
    },
    configure: function (state, pos) {
        if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
            state.build.has_institution = true;
        }
    }
};

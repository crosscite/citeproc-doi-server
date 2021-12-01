/*global CSL: true */

CSL.Node["date-part"] = {
    build: function (state, target) {
        var func, pos, len, first_date, value, value_end, real, have_collapsed, invoked, precondition, known_year, bc, ad, bc_end, ad_end, ready, curr, dcurr, number, num, formatter, item;
        if (!this.strings.form) {
            this.strings.form = "long";
        }
        // used in node_date, to send a list of rendering date parts
        // to node_key, for dates embedded in macros.
        state.build.date_parts.push(this.strings.name);
        //
        // Set delimiter here, if poss.
        //

        var date_variable = state.build.date_variables[0];

        function formatAndStrip(myform, gender, val) {
            if (!val) {
                return val;
            }
            val = "" + CSL.Util.Dates[this.strings.name][myform](state, val, gender, this.default_locale);
            if ("month" === this.strings.name) {
                if (state.tmp.strip_periods) {
                    val = val.replace(/\./g, "");
                } else {
                    for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
                        if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
                            val = val.replace(/\./g, "");
                            break;
                        }
                    }
                }
            }
            return val;
        }

        func = function (state, Item) {

            if (!state.tmp.date_object) {
                return;
            } else {
                state.tmp.probably_rendered_something = true;
            }

            var last_string_output = "";

            first_date = true;
            value = "";
            value_end = "";
            state.tmp.donesies.push(this.strings.name);

            // Render literal only when year is included in date output
            if (state.tmp.date_object.literal && "year" === this.strings.name) {
                last_string_output = state.tmp.date_object.literal;
                state.output.append(state.tmp.date_object.literal, this);
            }

            if (state.tmp.date_object) {
                value = state.tmp.date_object[this.strings.name];
                value_end = state.tmp.date_object[(this.strings.name + "_end")];
            }
            if ("year" === this.strings.name && value === 0 && !state.tmp.suppress_decorations) {
                value = false;
            }
            real = !state.tmp.suppress_decorations;
            have_collapsed = state.tmp.have_collapsed;
            invoked = state[state.tmp.area].opt.collapse === "year-suffix" || state[state.tmp.area].opt.collapse === "year-suffix-ranged";
            precondition = state.opt["disambiguate-add-year-suffix"];
            if (real && precondition && invoked) {
                state.tmp.years_used.push(value);
                known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
                if (known_year && have_collapsed) {
                    if (state.tmp.last_years_used[(state.tmp.years_used.length - 1)] === value) {
                        value = false;
                    }
                }
            }
            if ("undefined" !== typeof value) {
                bc = false;
                ad = false;
                bc_end = false;
                ad_end = false;
                if ("year" === this.strings.name) {
                    if (parseInt(value, 10) < 500 && parseInt(value, 10) > 0) {
                        ad = state.getTerm("ad");
                    }
                    if (parseInt(value, 10) < 0) {
                        bc = state.getTerm("bc");
                        value = (parseInt(value, 10) * -1);
                    }
                    if (value_end) {
                        if (parseInt(value_end, 10) < 500 && parseInt(value_end, 10) > 0) {
                            ad_end = state.getTerm("ad");
                        }
                        if (parseInt(value_end, 10) < 0) {
                            bc_end = state.getTerm("bc");
                            value_end = (parseInt(value_end, 10) * -1);
                        }
                    }
                }

                // For gendered locales
                var monthnameid = ""+state.tmp.date_object.month;
                while (monthnameid.length < 2) {
                    monthnameid = "0"+monthnameid;
                }
                monthnameid = "month-"+monthnameid;
                var gender = state.locale[state.opt.lang]["noun-genders"][monthnameid];
                if (this.strings.form) {
                    var myform = this.strings.form;
                    var myform_end = this.strings.form;
                    if (this.strings.name === "day") {
                        if (myform === "ordinal" && state.locale[state.opt.lang].opts["limit-day-ordinals-to-day-1"]) {
                            if (value != 1) {
                                myform = "numeric";
                            }
                            if (value_end != 1) {
                                myform_end = "numeric";
                            }
                        }
                    }
                    value = formatAndStrip.call(this, myform, gender, value);
                    value_end = formatAndStrip.call(this, myform_end, gender, value_end);
                }
                state.output.openLevel("empty");
                if (state.tmp.date_collapse_at.length) {
                    //state.output.startTag(this.strings.name,this);
                    ready = true;
                    len = state.tmp.date_collapse_at.length;
                    for (pos = 0; pos < len; pos += 1) {
                        item = state.tmp.date_collapse_at[pos];
                        if (state.tmp.donesies.indexOf(item) === -1) {
                            ready = false;
                            break;
                        }
                    }
                    if (ready) {
                        if ("" + value_end !== "0") {
                            if (state.dateput.queue.length === 0) {
                                first_date = true;
                            }

                            // OK! So if the actual data has no month, day or season,
                            // and we reach this block, then we can combine the dates
                            // to a string, run minimial-two, and output the trailing
                            // year right here. No impact on other functionality.
                            
                            if (state.opt["year-range-format"]
                                && state.opt["year-range-format"] !== "expanded"
                                && !state.tmp.date_object.day
                                && !state.tmp.date_object.month
                                && !state.tmp.date_object.season
                                && this.strings.name === "year"
                                && value && value_end) {
                                
                                // second argument adjusts collapse as required for years
                                // See OSCOLA section 1.3.2
                                value_end = state.fun.year_mangler(value + "-" + value_end, true);
                                var range_delimiter = state.getTerm("year-range-delimiter");
                                value_end = value_end.slice(value_end.indexOf(range_delimiter) + 1);
                            }
                            last_string_output = value_end;
                            state.dateput.append(value_end, this);
                            if (first_date) {
                                state.dateput.current.value().blobs[0].strings.prefix = "";
                            }
                        }
                        last_string_output = value;
                        state.output.append(value, this);
                        curr = state.output.current.value();
                        curr.blobs[(curr.blobs.length - 1)].strings.suffix = "";
                        if (this.strings["range-delimiter"]) {
                            state.output.append(this.strings["range-delimiter"]);
                        } else {
                            state.output.append(state.getTerm("year-range-delimiter"), "empty");
                        }
                        state.dateput.closeLevel();
                        dcurr = state.dateput.current.value();
                        curr.blobs = curr.blobs.concat(dcurr);
                        // This may leave the stack pointer on a lower level.
                        // It's not a problem because the stack will be clobbered
                        // when the queue is initialized by the next cs:date node.
                        state.dateput.string(state, state.dateput.queue);
                        state.dateput.openLevel(state.tmp.date_token);
                        state.tmp.date_collapse_at = [];
                    } else {
                        last_string_output = value;
                        state.output.append(value, this);
                        // print("collapse_at: "+state.tmp.date_collapse_at);
                        if (state.tmp.date_collapse_at.indexOf(this.strings.name) > -1) {
                            //
                            // Use ghost dateput queue
                            //
                            if ("" + value_end !== "0") {
                                //
                                // XXXXX: It's a workaround.  It's ugly.
                                // There's another one above.
                                //
                                if (state.dateput.queue.length === 0) {
                                    first_date = true;
                                }
                                state.dateput.openLevel("empty");
                                last_string_output = value_end;
                                state.dateput.append(value_end, this);
                                if (first_date) {
                                    state.dateput.current.value().blobs[0].strings.prefix = "";
                                }
                                if (bc) {
                                    last_string_output = bc;
                                    state.dateput.append(bc);
                                }
                                if (ad) {
                                    last_string_output = ad;
                                    state.dateput.append(ad);
                                }
                                state.dateput.closeLevel();
                            }
                        }
                    }
                } else {
                    last_string_output = value;
                    state.output.append(value, this);
                }

                if (bc) {
                    last_string_output = bc;
                    state.output.append(bc);
                }
                if (ad) {
                    last_string_output = ad;
                    state.output.append(ad);
                }
                state.output.closeLevel();
                //state.output.endTag();
            } else if ("month" === this.strings.name) {
                // XXX The simpler solution here will be to
                // directly install season and season_end on
                // month, with a value of 13, 14, 15, 16, or
                // (to allow correct ranging with Down Under
                // dates) 17 or 18.  That will allow ranging
                // to take place in the normal way.  With this
                // "approach", it doesn't.
                //
                // No value for this target variable
                //
                if (state.tmp.date_object.season) {
                    value = "" + state.tmp.date_object.season;
                    if (value && value.match(/^[1-4]$/)) {
                        // XXXXXXXXXXXXXXXXXXX was replace([false, false, true]);
                        //state.tmp.group_context.replace([false, false, true]);
                        state.tmp.group_context.tip.variable_success = true;
                        last_string_output = "winter";
                        state.output.append(state.getTerm(("season-0" + value)), this);
                    } else if (value) {
                        last_string_output = value;
                        state.output.append(value, this);
                    }
                }
            }
            state.tmp.value = [];
            if (Item[date_variable] && (value || state.tmp.have_collapsed) && !state.opt.has_year_suffix && "year" === this.strings.name && !state.tmp.just_looking) {
                if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig.year_suffix !== false && !state.tmp.has_done_year_suffix) {
                    state.tmp.has_done_year_suffix = true;
                    last_string_output = "x";
                    num = parseInt(state.registry.registry[Item.id].disambig.year_suffix, 10);
                    // first argument is for number particle [a-zA-Z], never present on dates
                    number = new CSL.NumericBlob(state, false, num, this, Item.id);
                    this.successor_prefix = state[state.build.area].opt.layout_delimiter;
                    this.splice_prefix = state[state.build.area].opt.layout_delimiter;
                    formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
                    number.setFormatter(formatter);
                    if (state[state.tmp.area].opt.collapse === "year-suffix-ranged") {
                        number.range_prefix = state.getTerm("citation-range-delimiter");
                    }
                    if (state[state.tmp.area].opt.cite_group_delimiter) {
                        number.successor_prefix = state[state.tmp.area].opt.cite_group_delimiter;
                    } else if (state[state.tmp.area].opt["year-suffix-delimiter"]) {
                        number.successor_prefix = state[state.tmp.area].opt["year-suffix-delimiter"];
                    } else {
                        number.successor_prefix = state[state.tmp.area].opt.layout_delimiter;
                    }
                    number.UGLY_DELIMITER_SUPPRESS_HACK = true;
                    state.output.append(number, "literal");
                }
            }
            if (last_string_output && !state.tmp.group_context.tip.condition) {
                state.tmp.just_did_number = last_string_output.match(/[0-9]$/);
                if (state.output.current.tip.strings.suffix) {
                    state.tmp.just_did_number = false;
                }
            }
        };
        this.execs.push(func);
        target.push(this);
    }
};



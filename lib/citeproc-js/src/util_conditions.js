CSL.Conditions = {};

CSL.Conditions.TopNode = function (state) {
    var func;
    if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
        if (this.locale) {
            state.opt.lang = this.locale;
        }
        if (!this.tests || !this.tests.length) {
            // Set up the condition compiler with our current context
            state.tmp.conditions = new CSL.Conditions.Engine(state, this);
        } else {
            // The usual.
            this.test = state.fun.match[this.match](this, state, this.tests);
        }
        if (state.build.substitute_level.value() === 0) {
            func = function(state) {
                state.tmp.condition_counter++;
            }
            this.execs.push(func);
        }
    }
    if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
        if (state.build.substitute_level.value() === 0) {
            func = function (state) {
                state.tmp.condition_counter--;
                if (state.tmp.condition_lang_counter_arr.length > 0) {
                    var counter = state.tmp.condition_lang_counter_arr.slice(-1)[0];
                    if (counter === state.tmp.condition_counter) {
                        state.opt.lang = state.tmp.condition_lang_val_arr.pop();
                        state.tmp.condition_lang_counter_arr.pop();
                    }
                }
                if (this.locale_default) {
                    // Open output tag with locale marker
                    state.output.current.value().old_locale = this.locale_default;
                    state.output.closeLevel("empty");
                    state.opt.lang = this.locale_default;
                }
            };
            this.execs.push(func);
        }
        // closingjump
        func = function (state) {
            var next = this[state.tmp.jump.value()];
            return next;
        };
        this.execs.push(func);
        if (this.locale_default) {
            state.opt.lang = this.locale_default;
        }
    }
};

CSL.Conditions.Configure = function (state, pos) {
    if (this.tokentype === CSL.START) {
        // jump index on failure
        this.fail = state.configure.fail.slice(-1)[0];
        this.succeed = this.next;
        state.configure.fail[(state.configure.fail.length - 1)] = pos;
    } else if (this.tokentype === CSL.SINGLETON) {
        // jump index on failure
        this.fail = this.next;
        this.succeed = state.configure.succeed.slice(-1)[0];
        state.configure.fail[(state.configure.fail.length - 1)] = pos;
    } else {
        // jump index on success
        this.succeed = state.configure.succeed.slice(-1)[0];
        this.fail = this.next;
    }
};

CSL.Conditions.Engine = function (state, token) {
    this.token = token;
    this.state = state;
};

CSL.Conditions.Engine.prototype.addTest = function (test) {
    this.token.tests ? {} : this.token.tests = [];
    this.token.tests.push(test);
};

CSL.Conditions.Engine.prototype.addMatch = function (match) {
    this.token.match = match;
};

CSL.Conditions.Engine.prototype.matchCombine = function () {
    this.token.test = this.state.fun.match[this.token.match](this.token, this.state, this.token.tests);
};

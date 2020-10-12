/*global CSL: true */

CSL.Node.substitute = {
    build: function (state, target) {
        var func;
        if (this.tokentype === CSL.START) {
            /* */
            // set conditional
            var choose_start = new CSL.Token("choose", CSL.START);
            CSL.Node.choose.build.call(choose_start, state, target);
            var if_singleton = new CSL.Token("if", CSL.SINGLETON);
            func = function() {
                if (state.tmp.value.length && !state.tmp.common_term_match_fail) {
                    return true;
                }
                return false;
            }
            if_singleton.tests = [func];
            if_singleton.test = state.fun.match.any(if_singleton, state, if_singleton.tests);
            target.push(if_singleton);

            func = function (state) {
                state.tmp.can_block_substitute = true;
                if (state.tmp.value.length && !state.tmp.common_term_match_fail) {
                    state.tmp.can_substitute.replace(false, CSL.LITERAL);
                }
                state.tmp.common_term_match_fail = false;
            };
            this.execs.push(func);
            target.push(this);
            /* */
        }
        if (this.tokentype === CSL.END) {
            //var if_end = new CSL.Token("if", CSL.END);
            //CSL.Node["if"].build.call(if_end, state, target);
            /* */
            target.push(this);
            var choose_end = new CSL.Token("choose", CSL.END);
            CSL.Node.choose.build.call(choose_end, state, target);
            /* */
        }
    }
};



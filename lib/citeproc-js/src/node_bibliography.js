/*global CSL: true */

CSL.Node = {};

CSL.Node.bibliography = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {

            state.build.area = "bibliography";
            state.build.root = "bibliography";
            state.build.extension = "";

            var func = function(state) {
                state.tmp.area = "bibliography";
                state.tmp.root = "bibliography";
                state.tmp.extension = "";
            };
            this.execs.push(func);

        }
        target.push(this);
    }
};


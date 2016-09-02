/*global CSL: true */

CSL.Node.info = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {
            state.build.skip = "info";
        } else {
            state.build.skip = false;
        }
    }
};


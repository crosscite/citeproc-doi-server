/*global CSL: true */

CSL.Node["name-part"] = {
    build: function (state, target) {
        state.build[this.strings.name] = this;
    }
};

/*global CSL: true */

CSL.Node["name-part"] = {
    build: function (state) {
        state.build[this.strings.name] = this;
    }
};

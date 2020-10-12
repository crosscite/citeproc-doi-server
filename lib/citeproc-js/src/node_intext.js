/*global CSL: true */

CSL.Node.intext = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {

            state.build.area = "intext";
            state.build.root = "intext";
            state.build.extension = "";

            var func = function(state, Item) {
                state.tmp.area = "intext";
                state.tmp.root = "intext";
                state.tmp.extension = "";
            }
            this.execs.push(func);
        }
        if (this.tokentype === CSL.END) {

            // Do whatever cs:citation does with sorting.
            state.intext_sort = {
                opt: {
                    sort_directions: state.citation_sort.opt.sort_directions
                }
            }
            state.intext.srt = state.citation.srt;
        }
        target.push(this);
    }
};


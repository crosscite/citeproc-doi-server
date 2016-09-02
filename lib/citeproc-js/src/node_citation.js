/*global CSL: true */

CSL.Node.citation = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {

            state.fixOpt(this, "names-delimiter", "delimiter");
            state.fixOpt(this, "name-delimiter", "delimiter");
            state.fixOpt(this, "name-form", "form");
            state.fixOpt(this, "and", "and");
            state.fixOpt(this, "delimiter-precedes-last", "delimiter-precedes-last");
            state.fixOpt(this, "delimiter-precedes-et-al", "delimiter-precedes-et-al");
            state.fixOpt(this, "initialize-with", "initialize-with");
            state.fixOpt(this, "initialize", "initialize");
            state.fixOpt(this, "name-as-sort-order", "name-as-sort-order");
            state.fixOpt(this, "sort-separator", "sort-separator");
            state.fixOpt(this, "and", "and");

            state.fixOpt(this, "et-al-min", "et-al-min");
            state.fixOpt(this, "et-al-use-first", "et-al-use-first");
            state.fixOpt(this, "et-al-use-last", "et-al-use-last");
            state.fixOpt(this, "et-al-subsequent-min", "et-al-subsequent-min");
            state.fixOpt(this, "et-al-subsequent-use-first", "et-al-subsequent-use-first");

            state.build.area = "citation";
        }
        if (this.tokentype === CSL.END) {

            // Open an extra key at first position for use in
            // grouped sorts.
            // print("in cs:citation END");
            state.opt.grouped_sort = state.opt.xclass === "in-text" 
                && (state.citation.opt.collapse 
                    && state.citation.opt.collapse.length)
                || (state.citation.opt.cite_group_delimiter
                    && state.citation.opt.cite_group_delimiter.length)
                && state.opt.update_mode !== CSL.POSITION
                && state.opt.update_mode !== CSL.NUMERIC;
            
            if (state.opt.grouped_sort 
                && state.citation_sort.opt.sort_directions.length) {
                
                var firstkey = state.citation_sort.opt.sort_directions[0].slice();
                //print("extending sort keys "+state.citation_sort.opt.sort_directions+" with "+firstkey);
                state.citation_sort.opt.sort_directions = [firstkey].concat(state.citation_sort.opt.sort_directions);
                // print("new key directions in effect: "+state.citation_sort.opt.sort_directions);
            }
            // print("creating new comparifier");
            state.citation.srt = new CSL.Registry.Comparifier(state, "citation_sort");
        }
    }
};


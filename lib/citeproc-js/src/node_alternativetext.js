CSL.Node["alternative-text"] = {
    build: function (state, target) {
        if (this.tokentype === CSL.SINGLETON) {
            // do stuff
            var func = function(state, Item) {
                var Item = state.refetchItem(Item.id);
                CSL.getCite.call(state, Item);
            };
            this.execs.push(func);
        }
        target.push(this);
    }
};



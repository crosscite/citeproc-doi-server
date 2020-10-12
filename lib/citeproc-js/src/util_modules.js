CSL.Engine.prototype.getJurisdictionList = function (jurisdiction) {
    var jurisdictionList = [];
    var jurisdictionElems = jurisdiction.split(":");
    for (var j=jurisdictionElems.length;j>0;j--) {
        jurisdictionList.push(jurisdictionElems.slice(0,j).join(":"));
    }
    if (jurisdictionList.indexOf("us") === -1) {
        jurisdictionList.push("us");
    }
    return jurisdictionList;
};

CSL.Engine.prototype.retrieveAllStyleModules = function (jurisdictionList) {
    var ret = {};
    var preferences = this.locale[this.opt.lang].opts["jurisdiction-preference"];
    preferences = preferences ? preferences : [];
    preferences = [""].concat(preferences);
    for (var i=preferences.length-1;i>-1;i--) {
        var preference = preferences[i];
        for (var j=0,jlen=jurisdictionList.length;j<jlen;j++) {
            var jurisdiction = jurisdictionList[j];
            // If we've "seen" it, we have it already, or we're not going to get it.
            if (this.opt.jurisdictions_seen[jurisdiction]) {
                continue;
            }
            // Try to get the module
            var res = this.sys.retrieveStyleModule(jurisdiction, preference);
            // If we fail and we've run out of preferences, mark as "seen"
            // Otherwise mark as "seen" if we get something.
            if ((!res && !preference) || res) {
                this.opt.jurisdictions_seen[jurisdiction] = true;
            }
            // Don't memo unless get got style code.
            if (!res) {
                continue;
            }
            ret[jurisdiction] = res;
        }
    }
    // Give 'em what we got.
    return ret;
};

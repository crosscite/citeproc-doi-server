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
}

CSL.Engine.prototype.retrieveAllStyleModules = function (jurisdictionList) {
    var ret = {};
    var preferences = this.locale[this.opt.lang].opts["jurisdiction-preference"];
    preferences = preferences ? preferences : [];
    preferences = [null].concat(preferences);
    for (var i=preferences.length-1;i>-1;i--) {
        var preference = preferences[i];
        for (var j=0,jlen=jurisdictionList.length;j<jlen;j++) {
            var jurisdiction = jurisdictionList[j];
            // Skip jurisdictions we already have on file.
            if (this.opt.jurisdictions_seen[jurisdiction]) continue;
            var res = this.sys.retrieveStyleModule(jurisdiction, preference);
            this.opt.jurisdictions_seen[jurisdiction] = true;
            if (!res) continue;
            ret[jurisdiction] = res;
        }
    }
    return ret;
}

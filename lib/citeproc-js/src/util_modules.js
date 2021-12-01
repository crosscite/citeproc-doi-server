CSL.Engine.prototype.getJurisdictionList = function (jurisdiction) {
    var jurisdictionList = [];
    var jurisdictionElems = jurisdiction.split(":");
    for (var j=jurisdictionElems.length;j>0;j--) {
        var composedID = jurisdictionElems.slice(0,j).join(":");
        jurisdictionList.push(composedID);
        if (this.opt.jurisdiction_fallbacks[composedID]) {
            var fallback = this.opt.jurisdiction_fallbacks[composedID];
            jurisdictionList.push(fallback);
        }
    }
    if (jurisdictionList.indexOf("us") === -1) {
        jurisdictionList.push("us");
    }
    return jurisdictionList;
};

CSL.Engine.prototype.loadStyleModule = function (jurisdiction, xmlSource, skipFallback) {
    var myFallback = null;
    var macroCount = 0;
    this.juris[jurisdiction] = {};
    var myXml = CSL.setupXml(xmlSource);
    myXml.addMissingNameNodes(myXml.dataObj);
    myXml.addInstitutionNodes(myXml.dataObj);
    myXml.insertPublisherAndPlace(myXml.dataObj);
    myXml.flagDateMacros(myXml.dataObj);
    var myNodes = myXml.getNodesByName(myXml.dataObj, "law-module");
    for (var i=0,ilen=myNodes.length;i<ilen;i++) {
        var myTypes = myXml.getAttributeValue(myNodes[i],"types");
        if (myTypes) {
            this.juris[jurisdiction].types = {};
            myTypes =  myTypes.split(/\s+/);
            for (var j=0,jlen=myTypes.length;j<jlen;j++) {
                this.juris[jurisdiction].types[myTypes[j]] = true;
            }
        }
        if (!skipFallback) {
            myFallback = myXml.getAttributeValue(myNodes[i],"fallback");
            if (myFallback) {
                if (jurisdiction !== "us") {
                    this.opt.jurisdiction_fallbacks[jurisdiction] = myFallback;
                }
            }
        }
    }
    var lang = this.opt.lang ? this.opt.lang : this.opt["default-locale"][0];
    CSL.SET_COURT_CLASSES(this, lang, myXml, myXml.dataObj);
    
    if (!this.juris[jurisdiction].types) {
        this.juris[jurisdiction].types = CSL.MODULE_TYPES;
    }
    var myNodes = myXml.getNodesByName(myXml.dataObj, "macro");
    for (var i=0,ilen=myNodes.length;i<ilen;i++) {
        var myName = myXml.getAttributeValue(myNodes[i], "name");
        if (!CSL.MODULE_MACROS[myName]) {
            CSL.debug("CSL: skipping non-modular macro name \"" + myName + "\" in module context");
            continue;
        }
        macroCount++;
        this.juris[jurisdiction][myName] = [];
        // Must use the same XML parser for style and modules.
        this.buildTokenLists(myNodes[i], this.juris[jurisdiction][myName]);
        this.configureTokenList(this.juris[jurisdiction][myName]);
    }
    //if (macroCount < Object.keys(CSL.MODULE_MACROS).length) {
    //    var missing = [];
    //    throw "CSL ERROR: Incomplete jurisdiction style module for: " + jurisdiction;
    //}
    return myFallback;
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

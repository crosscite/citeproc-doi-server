var StdRhinoTest = function(myname,engineNickname){
    this.myname = myname;
    this.engineNickname = engineNickname;
    this._cache = {};
    this._acache = {};
    this._acache["default"] = new CSL.AbbreviationSegments();
    this._ids = [];
    if (myname){
        var test;
        if (this.engineNickname == "rhino") {
            test = readFile("./tests/fixtures/run/machines/" + myname + ".json", "UTF-8");
        } else if (this.engineNickname == "jsc") {
            test = readFile("./tests/fixtures/run/machines/" + myname + ".json");
        } else if (this.engineNickname === "mozjs") {
            test = snarf("./tests/fixtures/run/machines/" + myname + ".json", "UTF-8");
        } else if (this.engineNickname == "v8") {
            test = read("./tests/fixtures/run/machines/" + myname + ".json");
        } else {
            print("Aiyeeee!");
        }
        eval( "this.test = "+test);
        this.result = this.test.result;
        this._setCache();
    }
};

// Retrieve properly composed item from phoney database.
// (Deployments MUST provide an instance object with
// this method.)
StdRhinoTest.prototype.retrieveItem = function(id){
    return this._cache[id];
};

// Retrieve locale object from filesystem
// (Deployments MUST provide an instance object with
// this method.)
StdRhinoTest.prototype.retrieveLocale = function(lang){
    try {
        var ret = null;
        if (this.engineNickname == "rhino") {
            ret = readFile("./locale/locales-"+lang+".xml", "UTF-8");
        } else if (this.engineNickname == "jsc") {
            ret = readFile("./locale/locales-"+lang+".xml");
        } else if (this.engineNickname === "mozjs") {
            ret = snarf("./locale/locales-"+lang+".xml", "UTF-8");
        } else if (this.engineNickname == "v8") {
            ret = read("./locale/locales-"+lang+".xml");
        }
        ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
    } catch (e) {
        ret = false;
    }
    if (this.engineNickname == "rhino") {
        if (ret) {
            ret = CSL.stripXmlProcessingInstruction(ret);
            ret = XML(ret);
        } else {
            ret = false;
        }
    }
    return ret;
};

// Retrieve style module, for law support
// (Deployments MAY provide an instance object with
// this method.)
StdRhinoTest.prototype.retrieveStyleModule = function(jurisdiction, preference) {
    var ret = null;
    if (this.submode.nojuris) {
        return ret;
    }
    var id = [jurisdiction];
    if (preference) {
        id.push(preference);
    }
    id = id.join("-");
    try {
        if (this.engineNickname == "rhino") {
            ret = readFile("./tests/fixtures/local/styles/juris-" + id + ".csl", "UTF-8");
        } else if (this.engineNickname == "jsc") {
            ret = readFile("./tests/fixtures/local/styles/juris-" + id + ".csl");
        } else if (this.engineNickname === "mozjs") {
            ret = snarf("./tests/fixtures/local/styles/juris-" + id + ".csl", "UTF-8");
        } else if (this.engineNickname == "v8") {
            ret = read("./tests/fixtures/local/styles/juris-" + id + ".csl");
        }
    } catch (e) {}
    if (this.engineNickname == "rhino") {
        if (ret) {
            ret = CSL.stripXmlProcessingInstruction(ret);
            ret = XML(ret);
        } else {
            ret = false;
        }
    }
    return ret;
}
 
StdRhinoTest.prototype.getAbbreviation = function(dummyListNameVar, obj, jurisdiction, category, key){
    var newkey = key;
    if (!this._acache[jurisdiction]) {
        this._acache[jurisdiction] = new CSL.AbbreviationSegments();
    }
    if (!obj[jurisdiction]) {
        obj[jurisdiction] = new CSL.AbbreviationSegments();
    }    
    var jurisdictions = ["default"];
    if (jurisdiction !== "default") {
        jurisdictions.push(jurisdiction);
    }
    jurisdictions.reverse();
    var haveHit = false;
    for (var i = 0, ilen = jurisdictions.length; i < ilen; i += 1) {
        var myjurisdiction = jurisdictions[i];
        if (this._acache[myjurisdiction][category][key]) {
            obj[myjurisdiction][category][key] = this._acache[myjurisdiction][category][key];
            jurisdiction = myjurisdiction;
            haveHit = true;
            break;
        }
    }
    if (!haveHit) {
        for (var i = 0, ilen = jurisdictions.length; i < ilen; i += 1) {
            if (["container-title", "collection-title", "number"].indexOf(category) > -1) {
                // Let's just be inefficient
                for (var phrase in this._acache[jurisdictions[i]]["container-phrase"]) {
                    var newphrase = this._acache[jurisdictions[i]]["container-phrase"][phrase];
                    newkey = newkey.replace(phrase, newphrase);
                }
            } else if (["institution-part", "title", "place"].indexOf(category) > -1) {
                // And again
                for (var phrase in this._acache[jurisdictions[i]]["title-phrase"]) {
                    var newphrase = this._acache[jurisdictions[i]]["title-phrase"][phrase];
                    newkey = newkey.replace(phrase, newphrase);
                }
            }
        }
        if (key !== newkey) {
            obj[jurisdiction][category][key] = newkey;
        } else {
            obj[jurisdiction][category][key] = "";
        }
    }
    return jurisdiction;
};

StdRhinoTest.prototype.addAbbreviation = function(jurisdiction,category,key,val){
    if (!this._acache[jurisdiction]) {
        this._acache[jurisdiction] = new CSL.AbbreviationSegments();
    }
    this._acache[jurisdiction][category][key] = val;
};

// Build phoney database.
StdRhinoTest.prototype._setCache = function(){
    for (var i=0,ilen=this.test.input.length;i<ilen;i++) {
        var item = this.test.input[i];
        this._cache[item.id] = item;
        this._ids.push(item.id);
    }
};


StdRhinoTest.prototype._readTest = function(){
    var test;
    var filename = "std/machines/" + this.myname + ".json";
    
    var teststring = null;
    if (this.engineNickname == "rhino") {
        ret = readFile(filename, "UTF-8");
    } else if (this.engineNickname == "jsc") {
        ret = readFile(filename);
    } else if (this.engineNickname === "mozjs") {
        ret = snarf(filename, "UTF-8");
    } else if (this.engineNickname == "v8") {
        ret = read(filename);
    }

    // Grab test data in an object.
    try {
        eval( "test = "+teststring );
    } catch(e){
        throw e + teststring;
    }
    this.test = test;
};


StdRhinoTest.prototype.run = function(){
    //print("-->"+this.myname);
    var result, data, nosort;
    // print(this.myname);
    var len, pos, ret, id_set, nick;
    ret = new Array();

    function variableWrapper(params, prePunct, str, postPunct) {
        //print(JSON.stringify(params,null,2));
        if (params.variableNames[0] === 'title' 
            && params.itemData.URL 
            && params.context === "citation" 
            && params.position === "first") {

            return prePunct + '<a href="' + params.itemData.URL + '">' + str + '</a>' + postPunct;
        } else if (params.variableNames[0] === 'first-reference-note-number' 
                   && params.context === "citation" 
                   && params.position !== "first") {

            return prePunct + '<b>' + str + '</b>' + postPunct;
        } else {
            return (prePunct + str + postPunct);
        }
    };


    // this.csl_reverse_lookup_support = true;

    if (this.test.options.variableWrapper) {
        this.variableWrapper = variableWrapper;
    }
    var lang_bases_needed = {};
    for (var lang in CSL.LANGS) {
        var lang_base = lang.split("-")[0];
        lang_bases_needed[lang_base] = true;
    } 
    for (var lang_base in lang_bases_needed) {
        if (!CSL.LANG_BASES[lang_base]) {
            throw "ERROR: missing in CSL.LANG_BASES: " + lang_base;
        }
    }
    var testCSL = this.test.csl;
    if (this.engineNickname == "rhino") {
        testCSL = CSL.stripXmlProcessingInstruction(this.test.csl);
        testCSL = XML(testCSL);
    }
    this.style = new CSL.Engine(this,testCSL);
    this.style.fun.dateparser.addDateParserMonths(["ocak", "Şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık", "bahar", "yaz", "sonbahar", "kış"]);

    var mode = this.test.mode.split("-");
    this.submode = {};
    for (var i=1,ilen=mode.length;i<ilen;i++) {
        this.submode[mode[i]] = true;
    }
    this.test.mode = mode[0];

    if (this.submode["rtf"]) {
        this.style.setOutputFormat("rtf");
    }
    //this.style.setParseNames(true);
    //this.style.opt.development_extensions.static_statute_locator = true;
    //this.style.opt.development_extensions.clobber_locator_if_no_statute_section = true;
    //this.style.opt.development_extensions.handle_parallel_articles = true;
    //this.style.opt.development_extensions.rtl_support = true;
	for (var opt in this.test.options) {
        if (opt === "variableWrapper") continue;
		this.style.opt.development_extensions[opt] = this.test.options[opt];
	}

    

    //this.style.opt.development_extensions.thin_non_breaking_space_html_hack = true;
    //this.style.opt.development_extensions.wrap_url_and_doi = true;
    var langParams = {
        persons:["translit"],
        institutions:["translit"],
        titles:["translit", "translat"],
        publishers:["translat"],
        places:["translat"]
    }
    if (this.test.langparams) {
        for (var key in this.test.langparams) {
            langParams[key] = this.test.langparams[key];
        }
    }
    this.style.setLangPrefsForCites(langParams);
    if (this.test.multiaffix) {
        this.style.setLangPrefsForCiteAffixes(this.test.multiaffix);
    }
    if (this.test.abbreviations) {
        for (jurisdiction in this.test.abbreviations) {
            for (field in this.test.abbreviations[jurisdiction]) {
                for (key in this.test.abbreviations[jurisdiction][field]) {
                    this.addAbbreviation(jurisdiction,field,key,this.test.abbreviations[jurisdiction][field][key]);
                }
            }
        }
    }

    if (this.test.bibentries){
        for (i=0,ilen=this.test.bibentries.length;i<ilen;i++) {
            var id_set = this.test.bibentries[i];
            this.style.updateItems(id_set, this.submode["nosort"]);
        }
    } else if (!this.test.citations) {
        this.style.updateItems(this._ids, this.submode["nosort"]);
    }
    if (!this.test.citation_items && !this.test.citations){
        var citation = [];
        for (var i=0,ilen=this.style.registry.reflist.length;i<ilen;i++) {
            var item = this.style.registry.reflist[i];
            citation.push({"id":item.id});
        }
        this.test.citation_items = [citation];
    }
    var citations = [];
    if (this.test.citation_items){
        for (var i=0,ilen=this.test.citation_items.length;i<ilen;i++) {
            var citation = this.test.citation_items[i];
            citations.push(this.style.makeCitationCluster(citation));
        }
    } else if (this.test.citations){
        for (var i=0,ilen=this.test.citations.slice(0, -1).length;i<ilen;i++) {
            var citation = this.test.citations.slice(0,-1)[i];
            this.style.processCitationCluster(citation[0],citation[1],citation[2]);
        };
        if (this.test.input2) {
            this.test.input = this.test.input2;
            this._setCache();
        }
        var citation = this.test.citations.slice(-1)[0];
        [data, result] = this.style.processCitationCluster(citation[0],citation[1],citation[2]);
    };
    var indexMap = new Object();
    for (var pos in result){
        indexMap[""+result[pos][0]] = pos;
    };
    for (var cpos=0;cpos<this.style.registry.citationreg.citationByIndex.length;cpos++){
        var citation = this.style.registry.citationreg.citationByIndex[cpos];
        if (indexMap[""+cpos]){
            citations.push(">>["+cpos+"] "+result[indexMap[cpos]][1]);
        } else {
            citations.push("..["+cpos+"] "+this.style.process_CitationCluster.call(this.style,this.style.registry.citationreg.citationByIndex[cpos].sortedItems));
        }
    };
    ret = citations.join("\n");
    if (this.test.mode == "bibliography" && !this.submode["header"]){
        if (this.test.bibsection){
            var ret = this.style.makeBibliography(this.test.bibsection);
        } else {
            var ret = this.style.makeBibliography();
        }
        ret = ret[0]["bibstart"] + ret[1].join("") + ret[0]["bibend"];
    } else if (this.test.mode == "bibliography" && this.submode["header"]){
        var obj = this.style.makeBibliography()[0];
        var lst = [];
        for (var key in obj) {
            var keyval = [];
            keyval.push(key);
            keyval.push(obj[key]);
            lst.push(keyval);
        }
        lst.sort(
            function (a, b) {
                if (a > b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                } else {
                    return 0;
                }
            }
        );
        ret = "";
        for (pos = 0, len = lst.length; pos < len; pos += 1) {
            ret += lst[pos][0] + ": " + lst[pos][1] + "\n";
        }
        ret = ret.replace(/^\s+/,"").replace(/\s+$/,"");
    }
    if (this.test.mode !== "bibliography" && this.test.mode !== "citation") {
        throw "Invalid mode in test file "+this.myname+": "+this.test.mode;
    }
    return ret;
};


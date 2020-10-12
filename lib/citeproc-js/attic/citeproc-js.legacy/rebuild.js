dojo.provide("citeproc_js.rebuild");

var mycsl = "<style>"
	+ "<citation disambiguate-add-givenname=\"true\">"
    + "<sort>"
    + "  <key variable=\"author\"/>"
    + "</sort>"
	+ "  <layout delimiter=\"; \" prefix=\"(\" suffix=\")\">"
	+ "    <names variable=\"author\">"
	+ "    <name form=\"short\" initialize-with=\". \"/>"
	+ "    </names>"
	+ "    <date variable=\"issued\" form=\"text\" date-parts=\"year\" prefix=\" \"/>"
	+ "  </layout>"
	+ "</citation>"
	+ "<bibliography>"
    + "  <sort>"
    + "    <key variable=\"author\"/>"
    + "  </sort>"
	+ "  <layout>"
	+ "    <names variable=\"author\">"
	+ "    <name form=\"short\" initialize-with=\". \"/>"
	+ "    </names>"
	+ "    <date variable=\"issued\" form=\"text\" date-parts=\"year\" prefix=\" \"/>"
	+ "  </layout>"
	+ "</bibliography>"
	+ "</style>";


var ITEM1 = {
	"id": 1,
	"type": "book",
	"author": [
		{
			"family": "Doe",
			"given": "John"
		},
		{
			"family": "Roe",
			"given": "Jane"
		}
	]
};

var ITEM2 = {
	"id": 2,
	"type": "book",
	"author": [
		{
			"family": "Doe",
			"given": "John"
		},
		{
			"family": "Roe",
			"given": "Richard"
		}
	]
};

var ITEM3 = {
	"id": 3,
	"type": "book",
	"author": [
		{
			"family": "Wallbanger",
			"given": "Harvey"
		},
		{
			"family": "Smith",
			"given": "Horatio"
		}
	],
	"issued": {
		"date-parts": [
			[
				1999
			]
		]
	}
};


var CITATION1 = {
	"citationID": "CITATION-1",
	"citationItems": [
		{
			"id": 1
		}
	],
	"properties": {
		"index": 0,
		"noteIndex": 1
	}
};

var CITATION2 = {
	"citationID": "CITATION-2",
	"citationItems": [
		{
			"id": 2
		}
	],
	"properties": {
		"index": 1,
		"noteIndex": 3
	}
};

var CITATION4 = {
	"citationID": "CITATION-4",
	"citationItems": [
		{
			"id": 3
		}
	],
	"properties": {
		"index": 2,
		"noteIndex": 4
	}
};



doh.register("citeproc_js.rebuild", [
	function testRebuild() {
		var sys = new RhinoTest([ITEM1,ITEM2,ITEM3]);
        var citations = [CITATION1,CITATION2,CITATION4];
		var style = new CSL.Engine(sys,mycsl);
		var res = style.rebuildProcessorState(citations, "html");
        // First citation
		doh.assertEqual("CITATION-1", res[0][0]);
		doh.assertEqual("1", res[0][1]);
		doh.assertEqual("(Doe, J. Roe)", res[0][2]);
        // Second citation
		doh.assertEqual("CITATION-2", res[1][0]);
		doh.assertEqual("3", res[1][1]);
		doh.assertEqual("(Doe, R. Roe)", res[1][2]);
        // Third citation
		doh.assertEqual("CITATION-4", res[2][0]);
		doh.assertEqual("4", res[2][1]);
		doh.assertEqual("(Wallbanger, Smith 1999)", res[2][2]);
	},
	function testRebuildCitationsWithUncitedItems() {
		var sys = new RhinoTest([ITEM1,ITEM2,ITEM3]);
        var citations = [CITATION1,CITATION4];
        var uncitedItemIDs = {}
        uncitedItemIDs[ITEM2.id] = true;
		var style = new CSL.Engine(sys,mycsl);
		var res = style.rebuildProcessorState([citations[0]], "html", uncitedItemIDs);
		var res = style.rebuildProcessorState(citations, "html", uncitedItemIDs);
        // First citation
		doh.assertEqual("CITATION-1", res[0][0]);
		doh.assertEqual("1", res[0][1]);
		doh.assertEqual("(Doe, J. Roe)", res[0][2]);
        // Second citation
		doh.assertEqual("CITATION-4", res[1][0]);
		doh.assertEqual("4", res[1][1]);
		doh.assertEqual("(Wallbanger, Smith 1999)", res[1][2]);
	},
	function testRebuildBibliographyWithUncitedItems() {
		var sys = new RhinoTest([ITEM1,ITEM2,ITEM3]);
        var citations = [CITATION1,CITATION4];
        var uncitedItemIDs = {}
        uncitedItemIDs[ITEM2.id] = true;
		var style = new CSL.Engine(sys,mycsl);
		style.rebuildProcessorState([citations[0]], "html",uncitedItemIDs);
		style.rebuildProcessorState(citations, "html",uncitedItemIDs);
        var bib = style.makeBibliography();

        // bib count
        doh.assertEqual(3, bib[1].length)
        // First entry
        var bibzero = bib[1][0].replace(/^\s*(.*?)\s*$/,"$1")
		doh.assertEqual("<div class=\"csl-entry\">Doe, J. Roe</div>", bibzero);

        var bibone = bib[1][1].replace(/^\s*(.*?)\s*$/,"$1")
		doh.assertEqual("<div class=\"csl-entry\">Doe, R. Roe</div>", bibone);

        var bibtwo = bib[1][2].replace(/^\s*(.*?)\s*$/,"$1")
		doh.assertEqual("<div class=\"csl-entry\">Wallbanger, Smith 1999</div>", bibtwo);
	}
]);

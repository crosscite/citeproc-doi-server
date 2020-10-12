dojo.provide("citeproc_js.preview");

var mycsl = "<style>"
	  + "<citation disambiguate-add-givenname=\"true\">"
	  + "  <layout delimiter=\"; \" prefix=\"(\" suffix=\")\">"
	  + "    <names variable=\"author\">"
	  + "    <name form=\"short\" initialize-with=\". \"/>"
	  + "    </names>"
	  + "    <date variable=\"issued\" form=\"text\" date-parts=\"year\" prefix=\" \"/>"
	  + "  </layout>"
	  + "</citation>"
	+ "</style>";

var mycsl2 = "<style>"
	  + "<citation disambiguate-add-givenname=\"true\" disambiguate-add-year-suffix=\"true\">"
	  + "  <layout delimiter=\"; \" prefix=\"(\" suffix=\")\">"
	  + "    <names variable=\"author\">"
	  + "    <name form=\"short\" initialize-with=\". \"/>"
	  + "    </names>"
	  + "    <date variable=\"issued\" form=\"text\" date-parts=\"year\" prefix=\" \"/>"
	  + "  </layout>"
	  + "</citation>"
	+ "</style>";

var ITEM1 = {
	"id": "ITEM-1",
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
	"id": "ITEM-2",
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
	"id": "ITEM-3",
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


var ITEM4 = {
	"id": "ITEM-4",
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

var ITEM5 = {
	"id": "ITEM-5",
	"type": "book",
	"author": [
		{
			"family": "Gershwin",
			"given": "George"
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


var ITEM6 = {
	"id": "ITEM-6",
	"type": "book",
	"author": [
		{
			"family": "Gershwin",
			"given": "George"
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
			"id": "ITEM-1"
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
			"id": "ITEM-2"
		}
	],
	"properties": {
		"index": 1,
		"noteIndex": 2
	}
};

var CITATION2x = {
	"citationID": "CITATION-2",
	"citationItems": [
		{
			"id": "ITEM-2"
		}
	],
	"properties": {
		"index": 0,
		"noteIndex": 1
	}
};

var CITATION3 = {
	"citationID": "CITATION-3",
	"citationItems": [
		{
			"id": "ITEM-1"
		}
	],
	"properties": {
		"index": 1,
		"noteIndex": 2
	}
};

var CITATION4 = {
	"citationID": "CITATION-4",
	"citationItems": [
		{
			"id": "ITEM-3"
		}
	],
	"properties": {
		"index": 2,
		"noteIndex": 3
	}
};

var CITATION5 = {
	"citationID": "CITATION-5",
	"citationItems": [
		{
			"id": "ITEM-1"
		}
	],
	"properties": {
		"index": 1,
		"noteIndex": 2
	}
};



var CITATION6 = {
	"citationItems": [
		{
			"id": "ITEM-3"
		},
		{
			"id": "ITEM-4"
		}
	],
	"properties": {
		"index": 0,
		"noteIndex": 0
	}
};

var CITATION7 = {
	"citationItems": [
		{
			"id": "ITEM-5"
		},
		{
			"id": "ITEM-6"
		}
	],
	"properties": {
		"index": 0,
		"noteIndex": 0
	}
};



doh.register("citeproc_js.preview", [
	function testInstantiation() {
		function testme () {
			if ("undefined" == typeof Item){
				Item = {"id": "Item-1"};
			}
			try {
				var sys = new RhinoTest();
				var style = new CSL.Engine(sys,mycsl);
				return "Success";
			} catch (e) {
				return "Failure";
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testThatItWorksAtAll() {
		var sys = new RhinoTest([ITEM1]);
		var style = new CSL.Engine(sys,mycsl);
		var res = style.previewCitationCluster(CITATION1, [], [], "html");
		doh.assertEqual("(Doe, Roe)", res);
	},
	function testOverlayPreview() {
		var sys, style, res1, res2, data;
		sys = new RhinoTest([ITEM1]);
		style = new CSL.Engine(sys,mycsl);
		[data, res1] = style.processCitationCluster(CITATION1, [], []);
		res2 = style.previewCitationCluster(CITATION1, [], [], "html");
		doh.assertEqual("(Doe, Roe)", res1[0][1]);
		doh.assertEqual("(Doe, Roe)", res2);
	},
	function testRollbackGivennameDisambig() {
		var sys, style, res1, res2, res3, data;
		sys = new RhinoTest([ITEM1, ITEM2]);
		style = new CSL.Engine(sys,mycsl);
		[data, res1] = style.processCitationCluster(CITATION1, [], []);
		res2 = style.previewCitationCluster(CITATION2, [["CITATION-1", 1]], [], "html");
		[data, res3] = style.processCitationCluster(CITATION3, [["CITATION-1", 1]], []);
		//doh.assertEqual("(Doe, Roe)", res1[0][1]);
		//doh.assertEqual("(Doe, R. Roe)", res2);
		//doh.assertEqual(1, res3.length);
		doh.assertEqual("(Doe, Roe)", res3[0][1]);
	},
	function testInitialsNeededOnlyWithOriginalCitationItemContent() {
		var sys, style, res1, res2, res3, res4, res5, data;
		sys = new RhinoTest([ITEM1, ITEM2, ITEM3]);
		style =new CSL.Engine(sys,mycsl);
		[data, res1] = style.processCitationCluster(CITATION1, [], []);
		[data, res2] = style.processCitationCluster(CITATION2, [["CITATION-1", 1]], []);
		// names rendered are:
		//   C1i1: John Doe, Jane Roe
		//   C2i2: John Doe, Richard Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		res3 = style.processCitationCluster(CITATION4, [["CITATION-1", 1], ["CITATION-2", 2]], []);
		// names rendered are:
        //   C1i1: John Doe, Jane Roe
		//   C5i1: John Doe, Jane Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		res4 = style.previewCitationCluster(CITATION5, [["CITATION-1", 1]], [["CITATION-4", 3]], "html", CITATION2);
		doh.assertEqual("(Doe, Roe)", res4);
		// same as before preview:
		//   C1i1: John Doe, Jane Roe
		//   C2i2: John Doe, Richard Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		[data, res5] = style.processCitationCluster(CITATION2, [["CITATION-1", 1]], [["CITATION-4", 3]]);
		// This is the critical test in this fixture: if the processor
		// state have been restored correctly following the preview,
		// there will be no update to other citations.
		doh.assertEqual(1, res5.length);
		doh.assertEqual("(Doe, R. Roe)", res5[0][1]);
	},
	function testInitialsChangeWithExternalDelete() {
		var sys, style, res1, res2, res3, res4, res5, data;
		sys = new RhinoTest([ITEM1, ITEM2, ITEM3]);
		style =new CSL.Engine(sys,mycsl);
		[data, res1] = style.processCitationCluster(CITATION1, [], []);
		// print("~~~~~~~~~~~~~~~~~~~~~~ print1 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		[data, res2] = style.processCitationCluster(CITATION2, [["CITATION-1", 1]], []);
		// names rendered are:
		//   C1i1: John Doe, Jane Roe
		//   C2i2: John Doe, Richard Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		// print("~~~~~~~~~~~~~~~~~~~~~~ print2 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		res3 = style.processCitationCluster(CITATION4, [["CITATION-1", 1], ["CITATION-2", 2]], []);


		// names rendered are:
        //   C1i1: John Doe, Jane Roe
		//   C5i1: John Doe, Jane Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		// print("~~~~~~~~~~~~~~~~~~~~~~ preview ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		res4 = style.previewCitationCluster(CITATION5, [["CITATION-1", 1]], [["CITATION-4", 3]], "html", CITATION2);
		doh.assertEqual("(Doe, Roe)", res4);



		// changes to:
		//   C2i2: John Doe, Richard Roe
		//   C4i3: Harvey Wallbanger, Horatio Smith
		// print("~~~~~~~~~~~~~~~~~~~~~~ print3 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		[data, res5] = style.processCitationCluster(CITATION2x, [], [["CITATION-4", 2]]);
		//doh.assertEqual(1, res5);
		doh.assertEqual("(Doe, Roe)", res5[0][1]);

	},
	function testFirstCiteTwoMatchingRefs() {
		var sys = new RhinoTest([ITEM1, ITEM3, ITEM4]);
		var style = new CSL.Engine(sys,mycsl);
		var res = style.previewCitationCluster(CITATION6, [], [], "html");
		doh.assertEqual("(Wallbanger, Smith 1999; Wallbanger, Smith 1999)", res);
	},
	function testFirstCiteYearSuffixPreviewEditPreviewEdit() {
		var res;
		var sys = new RhinoTest([ITEM5, ITEM6]);
		var style = new CSL.Engine(sys,mycsl2);
		[date, res] = style.processCitationCluster(CITATION7, [], [], "html");
		res = style.previewCitationCluster(CITATION7, [], [], "html");
		doh.assertEqual("(Gershwin 1999a; Gershwin 1999b)", res);
		[date, res] = style.processCitationCluster(CITATION7, [], [], "html");
		doh.assertEqual("(Gershwin 1999a; Gershwin 1999b)", res[0][1]);
	}
]);

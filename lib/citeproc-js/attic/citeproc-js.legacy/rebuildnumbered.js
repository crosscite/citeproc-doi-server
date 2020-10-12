dojo.provide("citeproc_js.rebuildnumbered");

var mycsl = "<style class=\"in-text\">"
	+ "<citation disambiguate-add-givenname=\"true\">"
	+ "  <layout>"
	+ "    <text variable=\"citation-number\"/>"
	+ "  </layout>"
	+ "</citation>"
	+ "<bibliography>"
	+ "  <layout>"
	+ "    <names variable=\"author\">"
	+ "      <name/>"
	+ "    </names>"
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
		}
	]
};

var ITEM2 = {
	"id": 2,
	"type": "book",
	"author": [
		{
			"family": "Roe",
			"given": "Jane"
		}
	]
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
		"noteIndex": 0
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
		"noteIndex": 0
	}
};

var CITATION3 = {
	"citationID": "CITATION-3",
	"citationItems": [
		{
			"id": 1
		}
	],
	"properties": {
		"index": 2,
		"noteIndex": 0
	}
};



doh.register("citeproc_js.rebuild", [
	function testRebuildBibliography() {
		var sys = new RhinoTest([ITEM1,ITEM2]);
        var citations = [CITATION1,CITATION2,CITATION3];
		var style = new CSL.Engine(sys,mycsl);
		var res = style.rebuildProcessorState(citations, "html");
        var bib = style.makeBibliography();
        // First citation
		doh.assertEqual(bib[1].length, 2);
        var bibzero = bib[1][0].replace(/^\s*(.*?)\s*$/,"$1")
		doh.assertEqual('<div class="csl-entry">John Doe</div>',bibzero);
	}
]);

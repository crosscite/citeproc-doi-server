dojo.provide("citeproc_js.slug");


doh.registerGroup("citeproc_js.slug",
	[
		function testSlug(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<text value=\"bogus\"/>"
					  + "</layout>"
					  + "</citation>"
					  + "<bibliography>"
					  + "<layout>"
					  + "<text variable=\"citation-number\" prefix=\"[\" suffix=\"]\"/>"
					  + "</layout>"
					  + "</bibliography>"
				+ "</style>";
			var result = citeproc_js.slug.makeBib(xml, [{id: "Item-1"}]);
			doh.assertEqual("  <div class=\"csl-entry\">[{SLUG}]</div>\n", result[1][0]);
			doh.assertEqual("  <div class=\"csl-entry\">[{SLUG}]</div>\n", result[1][1]);
		}
	],
	function(){  //setup
		citeproc_js.slug.makeBib = function(myxml,items){
			var sys = new RhinoTest(items);
			sys._cache["Item-1"] = { id: "Item-1", title: "Title One" };
			sys._cache["Item-2"] = { id: "Item-2", title: "Title Two" };
			var style = new CSL.Engine(sys,myxml);
			style.updateItems(["Item-1", "Item-2"]);
			return style.makeBibliography("{SLUG}");
		};
	},
	function(){	// teardown
	}

);

/*
*/
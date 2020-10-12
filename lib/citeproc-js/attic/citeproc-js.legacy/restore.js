dojo.provide("citeproc_js.restore");

doh.registerGroup("citeproc_js.restore",
	[
		function testInstantiation() {
			var t = citeproc_js.restore;
			function testme () {
				if ("undefined" == typeof Item){
					Item = {"id": "Item-1"};
				}
				try {
					var sys = new RhinoTest();
					var style = new CSL.Engine(sys,t.csl);
					return "Success";
				} catch (e) {
					return "Failure";
				}
			}
			var res = testme();
			doh.assertEqual( "Success", res );
		},
		function testThatItWorksAtAll() {
			var t = citeproc_js.restore;
			function testme () {
				var sys, style, res1, res2, data;
				sys = new RhinoTest([t.item1, t.item2]);
				style = new CSL.Engine(sys,t.csl);
				try {
					[data, res1] = style.processCitationCluster(t.citation1, [], []);
					[data, res2] = style.processCitationCluster(t.citation2, [], []);
					style.restoreProcessorState([t.citation1x, t.citation2x]);
					return "Success";
				} catch (e) {
					return e;
				}
			}
			doh.assertEqual("Success", testme());
		},
		function testThatItWorksWithUndefinedSortkeysObject() {
			var t = citeproc_js.restore;
			function testme () {
				var sys, style, res1, res2, data;
				sys = new RhinoTest([t.item1, t.item2]);
				style = new CSL.Engine(sys,t.csl);
				try {
					delete t.citation1x.citationItems[0].sortkeys;
					delete t.citation1x.citationItems[1].sortkeys;
					delete t.citation2x.citationItems[0].sortkeys;
					style.restoreProcessorState([t.citation1x, t.citation2x]);
					return "Success";
				} catch (e) {
					return e;
				}
			}
			doh.assertEqual("Success", testme());
		},
		function testThatItWorksWithDuplicateCitationIDs() {
			var t = citeproc_js.restore;
			function testme () {
				var sys, style, res1, res2, data;
				sys = new RhinoTest([t.item1, t.item2]);
				style = new CSL.Engine(sys,t.csl);
				try {
					var res = style.restoreProcessorState([t.citation1x, t.citation2x, t.citation1xx]);
					return "Success";
				} catch (e) {
					return e;
				}
			}
			doh.assertEqual("Success", testme());
		},
		function testRestore() {
			var sys, style, res1, res2, res3, data;
			var t = citeproc_js.restore;
			sys = new RhinoTest([t.item1, t.item2, t.item3]);
			style = new CSL.Engine(sys,t.csl);
			[data, res1] = style.processCitationCluster(t.citation1, [], []);
			[data, res2] = style.processCitationCluster(t.citation2, [["CITATION-1", 1]], []);
			style.restoreProcessorState([t.citation1x, t.citation2x]);
			[data, res3] = style.processCitationCluster(t.citation3, [["CITATION-1", 1],["CITATION-2", 2]], []);
			doh.assertEqual("(Roe; J. Doe)", res3[0][1]);
			doh.assertEqual(2, res3.length);
			doh.assertEqual(0, res3[0][0]);
			doh.assertEqual("(Roe; J. Doe)", res3[0][1]);
		},
		function testEmptyRestore() {
			var sys, style, res1, res2, res3, data;
			var t = citeproc_js.restore;
			sys = new RhinoTest([t.item1, t.item2, t.item3]);
			style = new CSL.Engine(sys,t.csl);
			[data, res1] = style.processCitationCluster(t.citation1, [], []);
			[data, res2] = style.processCitationCluster(t.citation2, [["CITATION-1", 1]], []);
			style.restoreProcessorState();
			[data, res3] = style.processCitationCluster(t.citation3, [], []);
			doh.assertEqual(1, res3.length);
			doh.assertEqual(0, res3[0][0]);
			doh.assertEqual("(Doe)", res3[0][1]);
		}
	],
	function(){  //setup
		citeproc_js.restore.csl = "<style>"
			+ "<citation disambiguate-add-givenname=\"true\">"
			+ "  <sort>"
			+ "    <key variable=\"title\"/>"
			+ "  </sort>"
			+ "  <layout delimiter=\"; \" prefix=\"(\" suffix=\")\">"
			+ "    <names variable=\"author\">"
			+ "    <name form=\"short\" initialize-with=\". \"/>"
			+ "    </names>"
			+ "    <date variable=\"issued\" form=\"text\" date-parts=\"year\" prefix=\" \"/>"
			+ "  </layout>"
			+ "</citation>"
			+ "</style>";
		citeproc_js.restore.item1 = {
			"id": "ITEM-1",
			"type": "book",
			"title": "Book B",
			"author": [
				{
					"family": "Doe",
					"given": "John"
				}
			]
		};
		citeproc_js.restore.item2 = {
			"id": "ITEM-2",
			"type": "book",
			"title": "Book A",
			"author": [
				{
					"family": "Roe",
					"given": "Jane"
				}
			]
		};
		citeproc_js.restore.item3 = {
			"id": "ITEM-3",
			"type": "book",
			"title": "Book C",
			"author": [
				{
					"family": "Doe",
					"given": "Richard"
				}
			]
		};
		citeproc_js.restore.citation1 = {
			"citationID": "CITATION-1",
			"citationItems": [
				{
					"id": "ITEM-1"
				},
				{
					"id": "ITEM-2"
				}
			],
			"properties": {
				"index": 0,
				"noteIndex": 1
			}
		};
		citeproc_js.restore.citation1x = {
			"citationID": "CITATION-1",
			"citationItems": [
				{
					"id": "ITEM-1",
					"position": 0,
					"sortkeys": ["Book B"]
				},
				{
					"id": "ITEM-2",
					"position": 0,
					"sortkeys": ["Book A"]
				}
			],
			"properties": {
				"index": 0,
				"noteIndex": 1
			}
		};
		citeproc_js.restore.citation1xx = {
			"citationID": "CITATION-1",
			"citationItems": [
				{
					"id": "ITEM-1",
					"position": 0,
					"sortkeys": ["Book B"]
				},
				{
					"id": "ITEM-2",
					"position": 0,
					"sortkeys": ["Book A"]
				}
			],
			"properties": {
				"index": 0,
				"noteIndex": 1
			}
		};
		citeproc_js.restore.citation2 = {
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
		citeproc_js.restore.citation2x = {
			"citationID": "CITATION-2",
			"citationItems": [
				{
					"id": "ITEM-2",
					"position": 0,
					"sortkeys": ["Book A"]
				}
			],
			"properties": {
				"index": 1,
				"noteIndex": 2
			}
		};
		citeproc_js.restore.citation3 = {
			"citationID": "CITATION-3",
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
	},
	function(){ // teardown
		delete citeproc_js.restore.csl;
		delete citeproc_js.restore.item1;
		delete citeproc_js.restore.item2;
		delete citeproc_js.restore.item3;
		delete citeproc_js.restore.citation1;
		delete citeproc_js.restore.citation1x;
		delete citeproc_js.restore.citation2;
		delete citeproc_js.restore.citation2x;
		delete citeproc_js.restore.citation3;
	}
);


var x = [
]
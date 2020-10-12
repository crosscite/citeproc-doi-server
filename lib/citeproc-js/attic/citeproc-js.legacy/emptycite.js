dojo.provide("citeproc_js.emptycite");
doh.registerGroup("citeproc_js.emptycite",
	[
		function testInstantiation() {
			var t = citeproc_js.emptycite;
			var res = false;
			try {
				var citeproc = new CSL.Engine(t.sys, t.csl);
				res = "Success";
			} catch (e) {
				res = "Failure";
			}
			doh.assertEqual( "Success", res );
		},
		function testCiteOk() {
		var t = citeproc_js.emptycite;
			var citeproc = new CSL.Engine(t.sys, t.csl);
			var res = citeproc.processCitationCluster(t.citation1, [], []);
			doh.assertEqual(0, res[0].citation_errors.length);
		},
		function testEmptyCite() {
		var t = citeproc_js.emptycite;
			var citeproc = new CSL.Engine(t.sys, t.csl);
			var res = citeproc.processCitationCluster(t.citation2, [], []);
			// One error returned, with value of [0, "citation2", 2, "ITEM-3", 1]
			doh.assertEqual(1, res[0].citation_errors.length);
			doh.assertEqual(0, res[0].citation_errors[0].index);
			doh.assertEqual(5, res[0].citation_errors[0].noteIndex);
			doh.assertEqual("citation2", res[0].citation_errors[0].citationID);
			doh.assertEqual(2, res[0].citation_errors[0].citationItems_pos);
			doh.assertEqual("ITEM-3", res[0].citation_errors[0].itemID);
			doh.assertEqual(CSL.ERROR_NO_RENDERED_FORM, res[0].citation_errors[0].error_code);
		}
	],
	function () {
		var t = citeproc_js.emptycite;
		var Sys = function () {
			var ITEMS = {
				"ITEM-1": {
					"id": "ITEM-1",
					"title": "Title One"
				},
				"ITEM-2": {
					"id": "ITEM-2",
					"title": "Title Two"
				},
				"ITEM-3": {
					"id": "ITEM-3"
				},
				"ITEM-4": {
					"id": "ITEM-4",
					"title": "Title Four"
				},
			};
			this.retrieveItem = function (id) {
				return ITEMS[id];
			};
			this.retrieveLocale = function (lang) {
				return "<locale xmlns=\"http://purl.org/net/xbiblio/csl\" version=\"1.0\" xml:lang=\"en\">"
					   + "<terms>"
					   + "  <term name=\"open-quote\"></term>"
					   + "  <term name=\"close-quote\"></term>"
					   + "  <term name=\"open-inner-quote\"></term>"
					   + "  <term name=\"close-inner-quote\"></term>"
					   + "  <term name=\"ordinal-01\"></term>"
					   + "  <term name=\"ordinal-02\"></term>"
					   + "  <term name=\"ordinal-03\"></term>"
					   + "  <term name=\"ordinal-04\"></term>"
					   + "  <term name=\"long-ordinal-01\"></term>"
					   + "  <term name=\"long-ordinal-02\"></term>"
					   + "  <term name=\"long-ordinal-03\"></term>"
					   + "  <term name=\"long-ordinal-04\"></term>"
					   + "  <term name=\"long-ordinal-05\"></term>"
					   + "  <term name=\"long-ordinal-06\"></term>"
					   + "  <term name=\"long-ordinal-07\"></term>"
					   + "  <term name=\"long-ordinal-08\"></term>"
					   + "  <term name=\"long-ordinal-09\"></term>"
					   + "  <term name=\"long-ordinal-10\"></term>"
					   + "</terms>"
					   + "</locale>";
			};
		};
		t.sys = new Sys();
		t.csl = "<style>"
					+ "<citation>"
					+ "  <layout>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</citation>"
			+ "</style>";
		t.citation1 = {
			citationID: "citation1",
			citationItems: [
				{id:"ITEM-1"}
			],
			properties: {
				noteIndex: 1
			}
		};
		t.citation2 = {
			citationID: "citation2",
			citationItems: [
				{id:"ITEM-1"},
				{id:"ITEM-2"},
				{id:"ITEM-3"},
				{id:"ITEM-4"}
			],
			properties: {
				noteIndex: 5
			}
		};
	},
	function () {}
);


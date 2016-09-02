dojo.provide("citeproc_js.emptybib");
doh.registerGroup("citeproc_js.emptybib",
	[
		function testInstantiation() {
			var t = citeproc_js.emptybib;
			var res = false;
			try {
				var citeproc = new CSL.Engine(t.sys, t.csl_nobib);
				res = "Success";
			} catch (e) {
				res = "Failure";
			}
			doh.assertEqual( "Success", res );
		},
		function testNoBibliographyAtAll() {
			var t = citeproc_js.emptybib;
			var citeproc = new CSL.Engine(t.sys, t.csl_nobib);
			citeproc.updateItems(["ITEM-1"]);
			var res = citeproc.makeBibliography();
			doh.assertEqual(true, res === false);
		},
		function testEmptyBibliographyEntry() {
			var t = citeproc_js.emptybib;
			var citeproc = new CSL.Engine(t.sys, t.csl_hasbib);
			citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4"]);
			var res = citeproc.makeBibliography();
			// One error returned, with value of [2, "ITEM-3", 1]
			doh.assertEqual(1, res[0].bibliography_errors.length);
			doh.assertEqual(2, res[0].bibliography_errors[0].index);
			doh.assertEqual("ITEM-3", res[0].bibliography_errors[0].itemID);
			doh.assertEqual(1, res[0].bibliography_errors[0].error_code);
		},
		function testEmptyBibliographyEntryExceptCitationNumber() {
			var t = citeproc_js.emptybib;
			var citeproc = new CSL.Engine(t.sys, t.csl_hasnumberedbib);
			citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4"]);
			var res = citeproc.makeBibliography();
			// One error returned, with value of [2, "ITEM-3", 1]
			doh.assertEqual(1, res[0].bibliography_errors.length);
			doh.assertEqual(2, res[0].bibliography_errors[0].index);
			doh.assertEqual("ITEM-3", res[0].bibliography_errors[0].itemID);
			doh.assertEqual(CSL.ERROR_NO_RENDERED_FORM, res[0].bibliography_errors[0].error_code);
		},
		function testBibliographyOk() {
			var t = citeproc_js.emptybib;
			var citeproc = new CSL.Engine(t.sys, t.csl_hasbib);
			citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-4"]);
			var res = citeproc.makeBibliography();
			// One error returned, with value of [2, "ITEM-3", 1]
			doh.assertEqual(0, res[0].bibliography_errors.length);
		}
	],
	function () {
		var t = citeproc_js.emptybib;
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
		t.csl_nobib = "<style>"
					+ "<citation>"
					+ "  <layout>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</citation>"
			+ "</style>";
		t.csl_hasbib = "<style>"
					+ "<citation>"
					+ "  <layout>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</citation>"
					+ "<bibliography>"
					+ "  <layout>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</bibliography>"
			+ "</style>";
		t.csl_hasnumberedbib = "<style>"
					+ "<citation>"
					+ "  <layout>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</citation>"
					+ "<bibliography>"
					+ "  <layout>"
					+ "    <text variable=\"citation-number\" prefix=\"[\" suffix=\"] \"/>"
					+ "    <text variable=\"title\"/>"
					+ "  </layout>"
					+ "</bibliography>"
			+ "</style>";
		t.makeTestBib = function (ids) {

		};
	},
	function () {}
);

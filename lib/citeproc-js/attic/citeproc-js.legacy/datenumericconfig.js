dojo.provide("citeproc_js.datenumericconfig");

CSL.debug = print;

doh.register("tests.datenumericconfig", [
		function test_MericanDefault() {
			var parser = new CSL.DateParser;
			var res = parser.parse("1-12-2000");
			doh.assertEqual(1, res.month);
		},
		function test_YurupStyle() {
			var parser = new CSL.DateParser;
			parser.setOrderDayMonth();
			var res = parser.parse("1-12-2000");
			doh.assertEqual(12, res.month);
		}
]);

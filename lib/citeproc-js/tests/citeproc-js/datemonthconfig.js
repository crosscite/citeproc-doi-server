dojo.provide("citeproc_js.datemonthconfig");

CSL.debug = print;

doh.register("tests.datemonthconfig", [
		function test_ExtendAmbigMonthAbbrev() {
			var parser = new CSL.DateParser;
			parser.addMonths("jan januberry mar apr may jun jul aug sep oct nov dec");
			doh.assertEqual(2, parser.mabbrevs[1].length);
			doh.assertEqual("feb", parser.mabbrevs[1][0]);
			doh.assertEqual("janub", parser.mabbrevs[1][1]);
		},
        function test_SimpleParse() {
			var parser = new CSL.DateParser;
			var res = parser.parse("Wed 24 Oct 2000");
			doh.assertEqual("10", res["month"]);
			doh.assertEqual("24", res["day"]);
			doh.assertEqual("2000", res["year"]);
		},
		function test_SimpleReset() {
			var parser = new CSL.DateParser;
			parser.resetMonths();
			var res = parser.parse("Wed 24 Oct 2000");
			doh.assertEqual("10", res["month"]);
			doh.assertEqual("24", res["day"]);
			doh.assertEqual("2000", res["year"]);
		},
		function test_ExtendBadLength() {
			var parser = new CSL.DateParser;
			parser.addMonths("januberry");
			var res = parser.parse("Wed 24 Oct 2000");
			doh.assertEqual("10", res["month"]);
			doh.assertEqual("24", res["day"]);
			doh.assertEqual("2000", res["year"]);
		},
		function test_ExtendSameMonthAbbrev() {
			var parser = new CSL.DateParser;
			parser.addMonths("jan februberry mar apr may jun jul aug sep oct nov dec");
			doh.assertEqual(1, parser.mabbrevs[1].length);
			doh.assertEqual("feb", parser.mabbrevs[1][0]);
		},
		function test_ExtendSimpleNewMonthAbbrev() {
			var parser = new CSL.DateParser;
			parser.addMonths("jan fezruary mar apr may jun jul aug sep oct nov dec");
			doh.assertEqual(2, parser.mabbrevs[1].length);
			doh.assertEqual("feb", parser.mabbrevs[1][0]);
			doh.assertEqual("fez", parser.mabbrevs[1][1]);
		},
		function test_ExtendAmbigMonthAbbrevTwice() {
			var parser = new CSL.DateParser;
			parser.addMonths("jan januberry mar apr may jun jul aug sep oct nov dec");
			doh.assertEqual(2, parser.mabbrevs[1].length);
			doh.assertEqual("feb", parser.mabbrevs[1][0]);
			doh.assertEqual("janub", parser.mabbrevs[1][1]);
			parser.addMonths("jan bebruary mar apr may jun jul aug sep oct nov dec");
			doh.assertEqual(3, parser.mabbrevs[1].length);
			doh.assertEqual("beb", parser.mabbrevs[1][2]);
			doh.assertEqual(1, parser.mabbrevs[2].length);
		}
]);

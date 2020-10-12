dojo.provide("citeproc_js.ambigconfig");

doh.register("citeproc_js.ambigconfig", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.AmbigConfig();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testValues() {
		var obj = new CSL.AmbigConfig();
		doh.assertEqual("object", typeof obj.maxvals);
		doh.assertEqual(0, obj.maxvals.length);
		doh.assertEqual("object", typeof obj.names);
		doh.assertEqual(0, obj.names.length);
	}
]);

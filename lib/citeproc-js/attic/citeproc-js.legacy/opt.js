dojo.provide("citeproc_js.opt");

doh.register("citeproc_js.opt", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Opt();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testValue() {
		var obj = new CSL.Engine.Opt();
		doh.assertNotEqual( "undefined", typeof obj.has_disambiguate );
	},

]);

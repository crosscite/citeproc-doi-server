dojo.provide("citeproc_js.sys_stdrhino_load");

doh.register("citeproc_js.sys_stdrhino_load", [

	function testInstantiationTestEmpty() {
		function testme () {
			try {
				var obj = new StdRhinoTest();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationTestLoad() {
		function testme () {
			try {
				var obj = new StdRhinoTest("name_WesternSimple");
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

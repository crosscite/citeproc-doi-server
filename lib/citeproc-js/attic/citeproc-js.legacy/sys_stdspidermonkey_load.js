dojo.provide("citeproc_js.sys_stdspidermonkey_load");
doh.register("citeproc_js.sys_stdspidermonkey_load", [

	function testInstantiationRhinoTestEmpty() {
		function testme () {
			try {
				var obj = new RhinoTest();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationRhinoTestLoad() {
		function testme () {
			try {
				var obj = new RhinoTest(["simple-western-name-1"]);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationStdRhinoTest() {
		function testme () {
			try {
				var obj = new StdRhinoTest("name_WesternTwoAuthors");
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

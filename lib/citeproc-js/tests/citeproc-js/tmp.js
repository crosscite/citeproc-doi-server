dojo.provide("citeproc_js.tmp");

doh.register("citeproc_js.tmp", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Tmp();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

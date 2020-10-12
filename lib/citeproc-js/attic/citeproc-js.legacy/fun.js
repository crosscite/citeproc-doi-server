dojo.provide("citeproc_js.fun");

doh.register("citeproc_js.fun", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Fun();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
]);

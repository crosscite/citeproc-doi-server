dojo.provide("citeproc_js.render");

doh.register("citeproc_js.render", [

	function testInstantiation() {
		function testme () {
			try {
				var out = new CSL.Render();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

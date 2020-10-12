dojo.provide("citeproc_js.output");


doh.register("citeproc_js.output", [

	function testInstantiateOutput() {
		function testme () {
			try {
				var fmt = CSL.Output;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

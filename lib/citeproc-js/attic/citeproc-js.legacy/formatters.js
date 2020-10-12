dojo.provide("citeproc_js.formatters");


doh.register("citeproc_js.formatters", [
	function testIfItWorksAtAll() {
		function testme () {
			try {
				var fmt = CSL.Utilities;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testCaps() {
		doh.assertEqual( 'CAPS', CSL.Output.Formatters.uppercase(undefined,"caps") );
	},

]);

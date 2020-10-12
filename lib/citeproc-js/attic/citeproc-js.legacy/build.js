dojo.provide("citeproc_js.build");

var myxml = '<style><citation><text/></citation></style>';

// var s = dec("Šťěpán ČESNEK");
// print(escape(s));

doh.register("citeproc_js.build", [

	function testInstantiation() {
		function testme () {
			try {
				var sys = new RhinoTest();
				var obj = new CSL.Engine(sys,myxml);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testValue() {
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,myxml);
		doh.assertEqual("object", typeof obj.build.macro_stack);
	}
]);


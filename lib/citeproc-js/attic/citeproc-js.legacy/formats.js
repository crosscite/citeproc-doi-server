dojo.provide("citeproc_js.formats");

doh.register("citeproc_js.formats", [

	function testStringyDefs() {
		doh.assertEqual( '<b>%%STRING%%</b>', CSL.Output.Formats.html["@font-weight/bold"] );
	},

	function testFunctionDefs() {
		doh.assertEqual( "function", typeof CSL.Output.Formats.html["@passthrough/true"] );
	}
]);

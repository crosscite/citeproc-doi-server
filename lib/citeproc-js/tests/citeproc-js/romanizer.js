dojo.provide("citeproc_js.romanizer");


doh.register("citeproc_js.romanizer", [
	function testRomanize(){
		var romanizer = new CSL.Util.Romanizer();
		doh.assertEqual("xiv", romanizer.format(14));
	},
]);

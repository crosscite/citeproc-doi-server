dojo.provide("citeproc_js.dateparsetoarray");

var keycount = function(obj){
    var c=0;
    for (pos in obj) {
      c+=1;
    }
    return c;
};

doh.register("tests.dateparsetoarray", [
	function test_dateparsetoarray029() {
		var parser = new CSL.DateParser;
		parser.returnAsArray();
		var res = parser.parse("Aug 15 2000 - Aug 20 2000");
        doh.assertEqual("2000", res["date-parts"][1][0]);
        doh.assertEqual("8", res["date-parts"][0][1]);
        doh.assertEqual("20", res["date-parts"][1][2]);
        doh.assertEqual("2000", res["date-parts"][0][0]);
        doh.assertEqual("8", res["date-parts"][1][1]);
        doh.assertEqual("15", res["date-parts"][0][2]);
        doh.assertEqual(1, keycount(res) );
		}
]);

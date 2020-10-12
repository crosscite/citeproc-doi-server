dojo.provide("citeproc_js.dateparse");

var sys = new StdRhinoTest();

var citeproc = new CSL.Engine(sys,'<style version="1.0"><citation><layout><text value="BOGUS"/></layout></citation></style>');

var keycount = function(obj){
    var c=0;
    for (pos in obj) {
      c+=1;
    }
    return c;
};

doh.register("tests.dateparse", [
    function test_dateparse001() {
        var res = citeproc.fun.dateparser.parse("Wed 24 Oct 2000");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("24", res["day"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse002() {
        var res = citeproc.fun.dateparser.parse("\u5e73\u621012\u5e7410\u670824\u65e5");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("24", res["day"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse003() {
        var res = citeproc.fun.dateparser.parse("19??-10");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("19??", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse004() {
        var res = citeproc.fun.dateparser.parse("myauntsally 23");
        doh.assertEqual("myauntsally 23", res["literal"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse005() {
        var res = citeproc.fun.dateparser.parse("\"[Dec 23, 2009]\"");
        doh.assertEqual("[Dec 23, 2009]", res["literal"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse006() {
        var res = citeproc.fun.dateparser.parse("Aug 31, 2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse007() {
        var res = citeproc.fun.dateparser.parse("31 Aug 2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse008() {
        var res = citeproc.fun.dateparser.parse("08-31-2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse009() {
        var res = citeproc.fun.dateparser.parse("2000-8-31");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse010() {
        var res = citeproc.fun.dateparser.parse("Sum 2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("14", res["month"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse011() {
        var res = citeproc.fun.dateparser.parse("Trinity 2001");
        doh.assertEqual("Trinity", res["season"]);
        doh.assertEqual("2001", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse012() {
        var res = citeproc.fun.dateparser.parse("Spring 2000 - Summer 2001");
        doh.assertEqual("14", res["month_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("2001", res["year_end"]);
        doh.assertEqual("13", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse013() {
        var res = citeproc.fun.dateparser.parse("circa 08-31-2000");
        doh.assertEqual("1", res["circa"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse014() {
        var res = citeproc.fun.dateparser.parse("circa 2000-31-08");
        doh.assertEqual("1", res["circa"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse015() {
        var res = citeproc.fun.dateparser.parse("circa Aug 31, 2000");
        doh.assertEqual("1", res["circa"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse016() {
        var res = citeproc.fun.dateparser.parse("Aug 31 2000 ?");
        doh.assertEqual("1", res["circa"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse017() {
        var res = citeproc.fun.dateparser.parse("[31 Aug 2000?]");
        doh.assertEqual("1", res["circa"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse018() {
        var res = citeproc.fun.dateparser.parse("200BC");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse019() {
        var res = citeproc.fun.dateparser.parse("200bc");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse020() {
        var res = citeproc.fun.dateparser.parse("200 b.c.");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse021() {
        var res = citeproc.fun.dateparser.parse("250AD");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse022() {
        var res = citeproc.fun.dateparser.parse("250ad");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse023() {
        var res = citeproc.fun.dateparser.parse("250 a.d.");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse024() {
        var res = citeproc.fun.dateparser.parse("2000-2001");
        doh.assertEqual("2001", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse025() {
        var res = citeproc.fun.dateparser.parse("Aug - Sep 2000");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse026() {
        var res = citeproc.fun.dateparser.parse("Aug 15-20 2000");
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("20", res["day_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("8", res["month_end"]);
        doh.assertEqual("15", res["day"]);
        doh.assertEqual(6, keycount(res) );
    },
    function test_dateparse027() {
        var res = citeproc.fun.dateparser.parse("Aug 2000-Sep 2000");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse028() {
        var res = citeproc.fun.dateparser.parse("\u5e73\u621012\u5e748\u6708\u301c\u5e73\u621012\u5e749\u6708");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse029() {
        var res = citeproc.fun.dateparser.parse("Aug 15 2000 - Aug 20 2000");
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("20", res["day_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("8", res["month_end"]);
        doh.assertEqual("15", res["day"]);
        doh.assertEqual(6, keycount(res) );
	},
    function test_dateparse030() {
        var res = citeproc.fun.dateparser.parseDateToArray("May 1 2000");
        doh.assertEqual("2000", res["date-parts"][0][0]);
        doh.assertEqual("5", res["date-parts"][0][1]);
        doh.assertEqual("1", res["date-parts"][0][2]);
    },
    function test_dateparse030() {
        var res = citeproc.fun.dateparser.parseDateToArray("June 3 1998 - 1999");
        doh.assertEqual("1998", res["date-parts"][0][0]);
        doh.assertEqual("6", res["date-parts"][0][1]);
        doh.assertEqual("3", res["date-parts"][0][2]);
        doh.assertEqual("1999", res["date-parts"][1][0]);
        doh.assertEqual("6", res["date-parts"][1][1]);
        doh.assertEqual("3", res["date-parts"][1][2]);
    },
    function test_dateparse031() {
        var res = {year:2000,month:7,day:21,year_end:2001};
        res = citeproc.fun.dateparser.convertDateObjectToArray(res);
        doh.assertEqual("2000", res["date-parts"][0][0]);
        doh.assertEqual("7", res["date-parts"][0][1]);
        doh.assertEqual("21", res["date-parts"][0][2]);
        doh.assertEqual(1, res["date-parts"].length);
    }
]);

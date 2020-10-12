dojo.provide("citeproc_js.bibpaging");

var mycsl = "<style><citation><layout><text value=\"ignoreme\"/></layout></citation><bibliography><layout><text variable=\"title\"/></layout></bibliography></style>";

var myitems = [
    {
        "id":"ITEM-1",
        "type": "book",
        "title": "Item One"
    },
    {
        "id":"ITEM-2",
        "type": "book",
        "title": "Item Two"
    },
    {
        "id":"ITEM-3",
        "type": "book",
        "title": "Item Three"
    },
    {
        "id":"ITEM-4",
        "type": "book",
        "title": "Item Four"
    }
];

doh.register("citeproc_js.bibpaging", [

	function testOne() {
		function testme () {
			try {
			    var mysys = new RhinoTest();
                var myids = [];
                for (var i = 0, ilen = myitems.length; i < ilen; i += 1) {
                    mysys._cache[myitems[i].id] = myitems[i];
                    myids.push(myitems[i].id);
                }
				var citeproc = new CSL.Engine(mysys,mycsl);
                citeproc.updateItems(myids);
                var myparams = {page_start:true,page_length:1};
                var ret = citeproc.makeBibliography(myparams);
				return ret;
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( false, res[0].done);
		doh.assertEqual( res[1][0], "  <div class=\"csl-entry\">Item One</div>\n" );
	},

	function testTwo() {
		function testme () {
			try {
			    var mysys = new RhinoTest();
                var myids = [];
                for (var i = 0, ilen = myitems.length; i < ilen; i += 1) {
                    mysys._cache[myitems[i].id] = myitems[i];
                    myids.push(myitems[i].id);
                }
				var citeproc = new CSL.Engine(mysys,mycsl);
                citeproc.updateItems(myids);
                var myparams = {page_start:true,page_length:20};
                var ret = citeproc.makeBibliography(myparams);
				return ret;
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( true, res[0].done);
	},

	function testThree() {
		function testme () {
			try {
			    var mysys = new RhinoTest();
                var myids = [];
                for (var i = 0, ilen = myitems.length; i < ilen; i += 1) {
                    mysys._cache[myitems[i].id] = myitems[i];
                    myids.push(myitems[i].id);
                }
				var citeproc = new CSL.Engine(mysys,mycsl);
                citeproc.updateItems(myids);
                var myparams = {page_start:"ITEM-1",page_length:2};
                var ret = citeproc.makeBibliography(myparams);
				return ret;
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( false, res[0].done);
        doh.assertEqual( 2, res[1].length);
        doh.assertEqual( "  <div class=\"csl-entry\">Item Two</div>\n", res[1][0]);
        doh.assertEqual( "  <div class=\"csl-entry\">Item Three</div>\n", res[1][1]);
	}
]);


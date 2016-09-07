dojo.provide("citeproc_js.urlwrapper");

var mycsl = "<style><citation><layout><text variable=\"URL\"/></layout></citation></style>";

var myitems = [
    {
        "id":"ITEM-1",
        "type": "book",
        "URL": "http://example.com"
    }
];

doh.register("citeproc_js.urlwrapper", [

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
                var ret1 = citeproc.makeCitationCluster([{id:"ITEM-1"}]);
                citeproc.opt.development_extensions.wrap_url_and_doi = true;
                var ret2 = citeproc.makeCitationCluster([{id:"ITEM-1"}]);
                citeproc.opt.development_extensions.wrap_url_and_doi = false;
                var ret3 = citeproc.makeCitationCluster([{id:"ITEM-1"}]);
                return [ret1, ret2, ret3];
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "http://example.com", res[0]);
		doh.assertEqual( "<a href=\"http://example.com\">http://example.com</a>", res[1]);
		doh.assertEqual( "http://example.com", res[2]);
	}
]);


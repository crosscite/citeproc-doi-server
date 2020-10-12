dojo.provide("citeproc_js.sys_rhino_load");

var myitem = {
   "id":"simple-western-name-1",
   "type": "book",
   "author": [
        { "name":"Doe, John", "uri":"http://people.org/doej" }
   ],
   "issued": {"year": "1965", "month":"6", "day":"1"},
   "title": "His Anonymous Life"
};


doh.register("citeproc_js.sys_rhino_load", [

	function testInstantiationRhinoTestEmpty() {
		function testme () {
			try {
				var obj = new RhinoTest();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationRhinoTestLoad() {
		function testme () {
			try {
				var obj = new RhinoTest(myitem);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);

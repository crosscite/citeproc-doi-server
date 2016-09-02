dojo.provide("citeproc_js.sys_stdrhino_locale");

doh.register("citeproc_js.sys_stdrhino_locale", [
	function testMakeXmlFromPlainXml(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,'<style></style>');
		var alreadyxml = new XML('<style><citation><text/></citation></style>');
		var res = obj.sys.xml.makeXml(alreadyxml);
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testMakeXml(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,'<style></style>');
		var res = obj.sys.xml.makeXml('<style><citation><text/></citation></style>');
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testSetAccess(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("af-ZA") );
		obj.localeSet(myxml,"af-ZA","af-ZA");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		obj.localeSet(myxml,"de-DE","de-DE");
		doh.assertEqual("und", obj.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleStringValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		obj.localeSet(myxml,"de-DE","de-DE");
		doh.assertEqual("und", obj.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleEmptyValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		doh.assertEqual("and", obj.locale["en-US"].terms["and"]["long"]);
	},
	function testLocaleGlobalWorksAtAll(){
		try {
			var sys = new RhinoTest();
			var obj = new CSL.Engine(sys,"<style></style>");
			var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
			obj.localeSet(myxml,"de-DE","de-DE");
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertNotEqual("undefined", typeof obj.locale["de-DE"].terms);
	},
]);


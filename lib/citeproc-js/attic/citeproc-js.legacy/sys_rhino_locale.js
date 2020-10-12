dojo.provide("citeproc_js.sys_rhino_locale");

doh.register("citeproc_js.sys_rhino_locale", [

	function testGetTermSymbolFallbackToShort(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"edition","symbol");
		doh.assertEqual("ed.",res);
	},
	function testGetTermNoPluralSpecifiedFallbackToSingular(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long");
		doh.assertEqual("book",res);
	},
	function testGetTermSingularExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",0);
		doh.assertEqual("book",res);
	},
	function testGetTermPluralExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",1);
		doh.assertEqual("books",res);
	},
	function testSetAccess(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("af-ZA") );
		obj.localeSet(myxml,"af-ZA","af-ZA");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		obj.localeSet(myxml,"de-DE","de-DE");
		doh.assertEqual("und", obj.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleNilValueNoStyleDefault(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		doh.assertEqual("en-US", obj.opt["default-locale"][0]);
		doh.assertEqual("books", obj.locale["en-US"].terms["book"]["long"][1]);
	},
	function testSetLocaleNilValueStyleHasDefault(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style default-locale=\"de-DE\"></style>");
		doh.assertEqual("de-DE", obj.opt["default-locale"][0]);
		doh.assertEqual("Bücher", obj.locale["de-DE"].terms["book"]["long"][1]);
	},
	function testSetLocaleHasValueNoStyleDefault(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>", "de-DE");
		doh.assertEqual("de-DE", obj.opt["default-locale"][0]);
		doh.assertEqual("Bücher", obj.locale["de-DE"].terms["book"]["long"][1]);
	},
	function testSetLocaleHasValueAndStyleDefault(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style default-locale=\"de-AT\"></style>", "de-DE");
		doh.assertEqual("de-AT", obj.opt["default-locale"][0]);
		// Odd that this should be the value for Austrian, but that's
		// what the current de-AT locale reports.
		doh.assertEqual("books", obj.locale["de-AT"].terms["book"]["long"][1]);
	},
	function testSetLocaleHasValueAndStyleDefaultWithForceValue(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style default-locale=\"de-AT\"></style>", "de-DE", true);
		doh.assertEqual("de-DE", obj.opt["default-locale"][0]);
		doh.assertEqual("Bücher", obj.locale["de-DE"].terms["book"]["long"][1]);
	},
	function testSetLocaleUnknownLocaleForced(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style default-locale=\"xx-XX\"></style>", "yy-YY", true);
		doh.assertEqual("en-US", obj.opt["default-locale"][0]);
		doh.assertEqual("books", obj.locale["en-US"].terms["book"]["long"][1]);
	},
	function testSetLocaleUnknownLocaleOnStyle(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style default-locale=\"xx-XX\"></style>");
		doh.assertEqual("en-US", obj.opt["default-locale"][0]);
		doh.assertEqual("books", obj.locale["en-US"].terms["book"]["long"][1]);
	},
	function testLocalSetLocaleWorksAtAll(){
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
		doh.assertEqual("object", typeof obj.locale["de-DE"].terms);
	}
]);

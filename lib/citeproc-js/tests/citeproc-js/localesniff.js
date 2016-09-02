dojo.provide("citeproc_js.localesniff");

// var s = dec("Šťěpán ČESNEK");
// print(escape(s));

doh.register("citeproc_js.build", [

	function testSniff() {
		function testme () {
            var myxml = <style default-locale="en"></style>;
			try {
				var localeNames = CSL.getLocaleNames(myxml);
                localeNames = localeNames.join(",");
				return localeNames;
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( res, "en" );
	}
]);


const fs = require("fs");


describe("CiteprocJS.Bibliography", function () {
	beforeEach(function () {
        // Get the processor image
        var CSL = require("../citeproc_commonjs.js");
        // Get the sys image with locales and input data
        var sys = require("./data/sys.js");
	});
	
	
	describe("#uncitedUpdate", function () {
		it("should update a bibliography entry when the item data is changed", function* () {
            // Fetch the input item
            sys.items = JSON.parse(fs.readFileSync("./data. input01.json"));
            // Fetch the CSL code
            var styleCode = fs.readFileSync("./data/style01.csl");
            // Instantiate the processor with sys and the CSL
            var citeproc = Citeproc.Engine(styleCode, sys, "en");
            citeproc.updateUncited(["ITEM-1"]);
            var res = citeproc.makeBibliography();
			assert.equal(XX, YY);
            citeproc.updateUncited(["ITEM-1"]);
            var res2 = citeproc.makeBibliography();
            assert.equal(res, res2);
		});
	});
});

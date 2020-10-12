const fs = require("fs");
const path = require("path");
const randomize = require("randomatic");
const getopts = require("getopts");

/* Global vars */

var seenIDs = {};

var citationTemplate = [
    {
        citationID: null,
        citationItems: [],
        properties: {
            noteIndex: null
        }
    },
    [],
    []
];

function errorHandler(e) {
    console.log(path.basename(process.argv[1]) + ": " + e.message);
    process.exit(1);
}

function diskItemsToItemsAndRawCitations(options) {
    var rawCitations = [];
    var items = JSON.parse(fs.readFileSync(options.f));
    for (var item of items) {
        item.id = randomize("a0", 10);
        citation = JSON.parse(JSON.stringify(citationTemplate));
        citation[0].citationID = randomize("A0", 10);
        citation[0].citationItems.push({
            id: item.id
        });
        rawCitations.push(citation);
    }
    console.log("Composed " + items.length + " items");
    console.log("Composed " + rawCitations.length + " raw citations");
    return {
        rawCitations: rawCitations,
        items: items
    }
}

function readExistingCitations(idx) {
    // idx is a number between 1 and 7
    var citations = JSON.parse(fs.readFileSync("citations-" + idx + ".json").toString());
    return citations;
}

function readExistingItems(idx) {
    // idx is a number between 1 and 7
    var items = JSON.parse(fs.readFileSync("items-" + idx + ".json").toString());
    return items;
}

function itemsAndRawCitationsToDiskCitationsAndItems(options, items, citations, citationsPre) {
    if (citations.length > 1000) {
        throw "No more than 1000 citations per data file, please";
    }
    if (citationsPre.length) {
        console.log("citationsPre: " + citationsPre.length + ", lastNote: " + citationsPre.slice(-1)[0][1] + ", now note: " + (citationsPre.length + 0 + 1));
    }
    for (var i=0, ilen=citations.length; i<ilen; i++) {
        var citation = citations[i];
        if (seenIDs[citation[0].citationID]) {
            console.log("  Already seen: " +citation[0].citationID + " at " + i + ", assigning new ID");
            citation[0].citationID = randomize("A0", 10);
        }
        citation[0].properties.noteIndex = (citationsPre.length + 1);
        citations[i][1] = citationsPre.slice();
        citations[i][2] = [];
        citationsPre.push([citation[0].citationID, citation[0].properties.noteIndex]);
        seenIDs[citation[0].citationID] = true;
    }
    fs.writeFileSync("items-" + options.n + ".json", JSON.stringify(items));
    console.log("Wrote " + items.length + " items to items-" + options.n + ".json");
    fs.writeFileSync("citations-" + options.n + ".json", JSON.stringify(citations));
    console.log("Wrote " + citations.length + " citations to citations-" + options.n + ".json");
    return citationsPre;
}

function composeAllCitations(options) {
    var citationsPre = [];
    for (var i=1, ilen=8; i<ilen; i++) {
        if (options.n == i) {
            var res = diskItemsToItemsAndRawCitations(options);
            citationsPre = itemsAndRawCitationsToDiskCitationsAndItems(options, res.items, res.rawCitations, citationsPre);
        } else if (!fs.existsSync("citations-" + i + ".json") || !fs.existsSync("items-" + i + ".json")) {
            fs.writeFileSync("citations-" + i + ".json", "[]");
            fs.writeFileSync("items-" + i + ".json", "[]");
            console.log("Wrote empty files citations-" + i + ".json and items-" + i + ".json");
        } else {
            var citations = readExistingCitations(i);
            var items = readExistingItems(i);
            citationsPre = itemsAndRawCitationsToDiskCitationsAndItems({n:i}, items, citations, citationsPre);
        }
    }
    console.log("Total of " + citationsPre.length + " citations")
}

try {
    const optParams = {
        alias: {
            f: "input-file",
            n: "number-of-file",
            h: "help"
        },
        string: ["f", "n"],
        boolean: ["h"],
        unknown: option => {
            throw new Error("Unknown option \"" +option + "\"");
        }
    };

    const usage = "A script to compose data sets for the citeproc-js demo.\n"
          + "The demo mimics inserting citations one by one in sequence into\n"
          + "a document, followed by insertion of a bibliography. The processor\n"
          + "will throw an error if input data violates certain constraints.\n"
          + "Non-zero note numbers in input data must occur in sequence; and\n"
          + "no citationID can occur more than once in an input transaction.\n"
          + "The demo contains seven item and citation data sets. These can\n"
          + "contain up to 1,000 items/citations. This script rewrites the\n"
          + "data sets, replacing one with citations derived from a CSL JSON\n"
          + "export file, and adjusting all others to work with it as part of\n"
          + "a single valid run of processor transactions.\n"
          + "\n"
          + "Feel free to extend this script in ways that are fun and useful.\n"
          + "\n"
          + "Usage: " + path.basename(process.argv[1])
          + " -i <inputFilename>\n\n";

    const options = getopts(process.argv.slice(2), optParams);

    if (options.h) {
        console.log(usage);
        process.exit();
    }
    if (!options.f) {
        throw new Error("Must set an input file with -f");
    }
    if (!options.n) {
        throw new Error("Must set an output file number with -n");
    }

    if (!fs.existsSync(options.f)) {
        throw new Error("File \"" + options.f + "\" not found");
    }
    if (!options.n.match(/^[0-7]$/)) {
        throw new Error("Value of -n must be a number between 1 and 7");
    }
    composeAllCitations(options);
} catch (e) {
    errorHandler(e);
}

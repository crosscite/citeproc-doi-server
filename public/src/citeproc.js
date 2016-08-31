var CSL = require("../lib/citeproc").CSL;
var fs = require("fs");

var styles = {};
var locales = {};

function init() {
	console.log("loading styles...");
	styles = loadDir("./public/styles/", /(.*)\.csl$/);
	console.log(Object.keys(styles).length + " styles loaded.");

	console.log("loading locales...");
	locales = loadDir("./public/locales/", /locales-(.*)\.xml$/);
	console.log(Object.keys(locales).length + " locales loaded.");
}

function loadDir(dir, regexp) {
	var files = {};
	fs.readdirSync(dir).forEach(function(file) {
		if (file.match(regexp)) {
			var label = RegExp.$1;
			var content = fs.readFileSync(dir + file, "UTF-8");
			files[label] = content;
		}
	});
	return files;
}

exports.getStyles = function() {
	return Object.keys(styles);
};

exports.getLocales = function() {
	return Object.keys(locales);
};

exports.format = function(item, style, lang, callback, errback) {
	if (style == null)
		style = "nature";
	if (lang == null)
		lang = "en-GB";

	var csl = styles[style];
	var locale = locales[lang];
	if (csl == undefined)
		errback("unknown style");
	else if (locale == undefined)
		errback("unknown language");
	else {
		item["id"] = "item";
		var sys = {};
		sys.retrieveItem = function(id) {
			return item;
		};
		sys.retrieveLocale = function(id) {
			return locale;
		};

		var citeProc = new CSL.Engine(sys, csl);

		citeProc.updateItems([ "item" ]);
		citeProc.setOutputFormat("text");

		var bib = citeProc.makeBibliography();
		if (bib[0]["bibliography_errors"].length == 0) {
			result = bib[1][0];
			callback(result);
		} else
			errback("Not enough metadata to construct bibliographic item.");
	}
}

init();

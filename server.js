var http = require('http');
var fs = require('fs');
var url = require('url');
var request = require('request');
var CSL = require("../lib/citeprocmodule").CSL;

var connegUrl = "http://test.datacite.org:80/data";
//var connegUrl = "http://dx.doi.org:80";

var styles;
var locales;

function init() {
	console.log("loading styles...");
	styles = loadDir("../csl/", /(.*)\.csl$/);
	console.log(Object.keys(styles).length + " styles loaded.");

	console.log("loading locales...");
	locales = loadDir("../csl-locales/", /locales-(.*)\.xml$/);
	console.log(Object.keys(locales).length + " locales loaded.");

	console.log("creating server...");
	port = 8006;
	http.createServer(server).listen(port);
	console.log("server listening on port " + port + ".");
}

function server(req, res) {
	var path = url.parse(req.url).pathname;
	switch (path) {
	case "/format":
		formatHandler(req, res);
		break;
	case "/styles":
		listHandler(req, res, Object.keys(styles));
		break;
	case "/locales":
		listHandler(req, res, Object.keys(locales));
		break;
	default:
		sendResponse(res, 404, "url not found");
	}
}

function listHandler(req, res, array) {
	var json = JSON.stringify(array);
	sendResponse(res, 200, json, {
		"Content-Type" : "application/json"
	});
}

function formatHandler(req, res) {
	var query = getQuery(req.url);
	var doi = query.doi;
	if (doi == undefined)
		sendResponse(res, 400, "doi param required");
	else {
		retrieveCiteprocJson(connegUrl + "/" + doi, function(data) {
			item = JSON.parse(data);
			format(item, query.style, query.lang, function(text) {
				sendResponse(res, 200, text);
			}, function(msg) {
				sendResponse(res, 400, msg);
			});
		}, function() {
			sendResponse(res, 404, "doi not found");
		});
	}
}

function getQuery(url) {
	return require('url').parse(url, true).query;
}

function sendResponse(res, code, body, options) {
	if (options == null)
		options = {};
	if (options["Content-Type"] == undefined)
		options["Content-Type"] = "text/plain";
	res.writeHead(code, options);
	res.write(body);
	res.end();
}

function retrieveCiteprocJson(urlStr, callback, errback) {
	var pUrl = url.parse(urlStr);
	var options = {
		host : pUrl.hostname,
		headers : {
			'Accept': 'application/citeproc+json'
		},
		port : pUrl.port,
		path : pUrl.pathname
	};
	console.log(options);
	return http.get(options, function(res) {
		var chunks = [];
		console.log(res.statusCode);
		if (res.statusCode == 200) {
			res.on('data', function(chunk) {
				chunks.push(chunk);
			});
			res.on('end', function() {
				var data = chunks.join("");
				callback(data);
			});
		} else
			errback(res);
	});
}

function format(item, style, lang, callback, errback) {
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

init();
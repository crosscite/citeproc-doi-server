var http = require('http');
var url = require('url');
var request = require('request');
var citeproc = require('./citeproc');

var connegUrl = "http://test.datacite.org/data";
//var connegUrl = "http://dx.doi.org";

function init() {
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
		listHandler(req, res, citeproc.getStyles());
		break;
	case "/locales":
		listHandler(req, res, citeproc.getLocales());
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
			console.log(data);
			item = JSON.parse(data);
			citeproc.format(item, query.style, query.lang, function(text) {
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
	var requestType = 'application/citeproc+json';
	request( {
		uri : urlStr,
		headers : {
			'Accept': requestType
		}
	}, function (error, response, body) {
		var responseType = response.headers["content-type"];
		if (error) 
			errback("unknown error");
		else if (!responseType.startsWith(requestType))
			errback("cannot get metadata");
		else if (response.statusCode == 200)
			callback(body);
		else 
			errback(body);
	});
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

init();
var http = require('http');
var connect = require('connect');
var url = require('url');
var request = require('request');
var citeproc = require('./citeproc');
var doi = require('./doi');
var settings = require('./settings');

console.log(settings);

function init() {
	console.log("creating server...");

	var server = connect();
	server.use(connect.query());
	server.use(connect.logger());
	server.use(connect.static('./html'));

	server.use('/styles', listHandler(citeproc.getStyles()));
	server.use('/locales', listHandler(citeproc.getLocales()));
	server.use('/format', formatHandler);

	http.createServer(server).listen(settings.port);
	console.log("server listening on port " + settings.port + ".");
}

function listHandler(array) {
	return function(req, res) {
		var json = JSON.stringify(array);
		sendResponse(res, 200, json, {
			"Content-Type" : "application/json"
		});
	};
}

function formatHandler(req, res) {
	var query = req.query;
	var doi = query.doi;
	if (doi == undefined)
		sendResponse(res, 400, "doi param required");
	else {
		require("./doi").resolve(
				doi,
				function(data) {
					try {
						item = JSON.parse(data);
						citeproc.format(item, query.style, query.lang,
								function(text) {
									sendResponse(res, 200, text);
								}, function(msg) {
									sendResponse(res, 400, msg);
								});
					} catch (err) {
						sendResponse(res, 500, "error while formatting: "
								+ err.message);
					}
				}, function(code, msg) {
					sendResponse(res, code, msg);
				}, "application/citeproc+json");
	}
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

init();
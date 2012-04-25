var request = require('request');
var settings = require('./settings');

console.log(settings);

// callback = function(data)
// errback = function(code, msg)
exports.resolve = function(doi, callback, errback, mediaType) {
	options = {
		uri : settings.doiProxy + "/" + doi,
		headers : {}
	};

	if (mediaType)
		options.headers['Accept'] = mediaType;

	request(options, function(error, response, body) {
		var responseType = response.headers["content-type"];
		if (error)
			errback(500, "unknown error");
		else if (response.statusCode == 404)
			errback(404, "doi not found");
		else if (response.statusCode == 406
				|| !responseType.startsWith(mediaType))
			errback(404, "metadata for doi not found");
		else if (response.statusCode == 200)
			callback(body);
		else {
			console.log(response);
			errback(500, "response code of resolver not 200");
		}
	});
};

String.prototype.startsWith = function(prefix) {
	return prefix == undefined || prefix == null || this.indexOf(prefix) === 0;
};

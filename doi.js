var request = require('request');

var connegUrl = "http://test.datacite.org/data";
//var connegUrl = "http://dx.doi.org";

// callback = function(data)
// errback = function(code, msg)
exports.resolve = function(doi, callback, errback) {
	var requestType = 'application/citeproc+json';
	request( {
		uri : connegUrl + "/" + doi,
		headers : {
			'Accept': requestType
		}
	}, function (error, response, body) {
		var responseType = response.headers["content-type"];
		if (error) 
			errback(500, "unknown error");
		else if (response.statusCode == 404)
			errback(404, "doi not found");
		else if (response.statusCode == 406 || !responseType.startsWith(requestType))
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
	return prefix == undefined || prefix == null || this.indexOf(prefix) === 0 ;
};

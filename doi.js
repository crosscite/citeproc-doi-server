var request = require('request');

var connegUrl = "http://test.datacite.org/data";
//var connegUrl = "http://dx.doi.org";

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

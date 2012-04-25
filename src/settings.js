var fs = require("fs");

exports.load = function (filename) {
	console.log("loading settings <" + filename + ">");
	var file = fs.readFileSync(filename, "UTF-8");
	var json = JSON.parse(file);
	console.log(json);
	return json;
}
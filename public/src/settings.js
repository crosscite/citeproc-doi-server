var fs = require("fs");
var filename = "config.json";
console.log("loading settings <" + filename + ">");
var file = fs.readFileSync(filename, "UTF-8");
var json = JSON.parse(file);
console.log(json);
module.exports = json;

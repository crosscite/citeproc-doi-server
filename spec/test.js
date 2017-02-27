
var Cite = require("../src/app.js");


var query = {
  style:"chicago-author-date",
  doi:"10.1145/2783446.2783605",
  lang:"en-GB"
};
var req = {
  query: query
};
Cite.formatHandler(req);

var query = {
  style:"apa",
  doi:"10.1145/2783446.2783605",
  lang:"en-GB"
};
var req = {
  query: query
};

Cite.formatHandler(req);

var query = {
  style:"chicago-author-date",
  doi:"10.1145/2783446.2783605",
  lang:"en-GB"
};
var req = {
  query: query
};


Cite.formatHandler(req);

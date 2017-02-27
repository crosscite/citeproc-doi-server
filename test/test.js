
var Cite = require("../src/app.js");

describe("Citation#works", function () {
  it("should get a Chicago citation for the DOI: 10.1145/2783446.2783605.", function (done) {
    var query = {
      style:"chicago-author-date",
      doi:"10.1145/2783446.2783605",
      lang:"en-GB"
    };
    var req = {
      query: query
    };
    Cite.formatHandler(req);
    done();
  });
});


describe('Citation#chicago', function() {
  describe('#formatHandler()', function() {
    it('should get a Chicago citation for the DOI: 10.1145/2783446.2783605.', function() {
      var query = {
        style:"chicago-author-date",
        doi:"10.1145/2783446.2783605",
        lang:"en-GB"
      };
      var req = {
        query: query
      };
      Cite.formatHandler(req).should.equal("Garza, Kristian, Carole Goble, John Brooke, and Caroline Jay. 2015. `Framing the Community Data System Interface`. Proceedings of the 2015 British HCI Conference on - British HCI `15. Association for Computing Machinery (ACM). doi:10.1145/2783446.2783605.");
    });
  });
});

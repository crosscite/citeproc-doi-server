/*global CSL: true */

CSL.Node["#comment"] = {
       // This is a comment in the CSL file.
       build: function (state, target) {
        // Save some space in the log files -- no need to mention this, really.
        // CSL.debug("CSL processor warning: comment node reached");
       }
};

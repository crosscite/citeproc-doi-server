/*global CSL: true */

if ("undefined" === typeof console) {
    CSL.debug = function (str) {
        dump("CSL: " + str + "\n");
    };
    CSL.error = function (str) {
        dump("CSL error: " + str + "\n");
    };
} else {
    CSL.debug = function (str) {
        console.log("CSL: " + str);
    };
    CSL.error = function (str) {
        //print("CSL error: " + str + "\n");
        console.log("CSL error: " + str);
    };
}

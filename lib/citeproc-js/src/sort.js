/*global CSL: true */

CSL.getSortCompare = function (default_locale) {
    if (CSL.stringCompare) {
        return CSL.stringCompare;
    }
    var me = this;
    var strcmp;
    var strcmp_opts = {
        sensitivity:"base",
        ignorePunctuation:true,
        numeric:true
    };
    // In order, attempt the following:
    //   (1) Set locale collation from processor language
    //   (2) Use localeCompare()
    if (!default_locale) {
        default_locale = "en-US";
    }
    strcmp = function (a, b) {
        return CSL.toLocaleLowerCase.call(me, a).localeCompare(CSL.toLocaleLowerCase.call(me, b),default_locale,strcmp_opts);
    };
    var stripPunct = function (str) {
        return str.replace(/^[\[\]\'\"]*/g, "");
    };
    var getBracketPreSort = function () {
        if (!strcmp("[x","x")) {
            return false;
        } else {
            return function (a, b) {
                return strcmp(stripPunct(a), stripPunct(b));
            };
        }
    };
    var bracketPreSort = getBracketPreSort();
    var sortCompare = function (a, b) {
        if (bracketPreSort) {
            return bracketPreSort(a, b);
        } else {
            return strcmp(a, b);
        }
    };
    return sortCompare;
};

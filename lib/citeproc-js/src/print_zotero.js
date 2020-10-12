/*global CSL: true, Zotero: true */

CSL.debug = function (str) {
    Zotero.debug("CSL: " + str);
};

CSL.error = function (str) {
    Zotero.debug("CSL error: " + str);
};

function DOMParser() {
	return Components.classes["@mozilla.org/xmlextras/domparser;1"]
		.createInstance(Components.interfaces.nsIDOMParser);
}

CSL.getLocaleNames = function (myxml) {
    var parser = CSL.System.Xml.Parsing();  
    var primary = parser.getAttributeValue("default-locale");
    return [primary];
};

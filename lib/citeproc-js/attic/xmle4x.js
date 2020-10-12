/**
 * Functions for parsing an XML object using E4X.
 */
CSL.XmlE4X = function (dataObj) {
    this.dataObj = dataObj;
};

/**
 * E4X can't handle XML declarations, so we lose them here.
 * (this will be used for all XML string inputs)
 */
CSL.XmlE4X.prototype.clean = function (xml) {
    xml = xml.replace(/<\?[^?]+\?>/g, "");
    xml = xml.replace(/<![^>]+>/g, "");
    xml = xml.replace(/^\s+/g, "");
    xml = xml.replace(/\s+$/g, "");
    return xml;
};


/**
 * Methods to call on a node.
 */
CSL.XmlE4X.prototype.getStyleId = function (myxml, styleName) {
    var text = "";
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    var tagName = 'id';
    var node = myxml..id;
    if (styleName) {
        tagName = myxml..title;
    }
    if (node && node.length()) {
        text = node[0].toString();
    }
    return text;
};

CSL.XmlE4X.prototype.children = function (myxml) {
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    return myxml.children();
};

CSL.XmlE4X.prototype.nodename = function (myxml) {
    var ret = myxml.localName();
    return ret;
};

CSL.XmlE4X.prototype.attributes = function (myxml) {
    var ret, attrs, attr, key, xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    ret = new Object();
    attrs = myxml.attributes();
    for each (attr in attrs) {
        var key = "@" + attr.localName();
        //
        // Needed in rhino
        //
        if (key.slice(0,5) == "@e4x_") {
            continue;
        }
        //var value = attr;
        ret[key] = attr.toString();
    }
    return ret;
};


CSL.XmlE4X.prototype.content = function (myxml) {
    return myxml.toString();
};


CSL.XmlE4X.prototype.namespace = {
    "xml":"http://www.w3.org/XML/1998/namespace"
}

CSL.XmlE4X.prototype.numberofnodes = function (myxml) {
    if (typeof myxml === "xml") {
        return myxml.length();
    } else if (myxml) {
        return myxml.length;
    } else {
        return 0;
    }
};

CSL.XmlE4X.prototype.getAttributeName = function (attr) {
    var ret = attr.localName();
    return ret;
}

CSL.XmlE4X.prototype.getAttributeValue = function (myxml,name,namespace) {
    var xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    //
    // Oh, okay, I get it.  The syntax does not lend itself to parameterization,
    // but one of the elements is a variable, so it can be set before
    // the call.  Jeez but this feels ugly.  Does work, though.
    //
    if (namespace) {
        var ns = new Namespace(this.namespace[namespace]);
        var ret = myxml.@ns::[name].toString();
    } else {
        if (name) {
            var ret = myxml.attribute(name).toString();
        } else {
            var ret = myxml.toString();
        }
    }
    return ret;
}

CSL.XmlE4X.prototype.getNodeValue = function (myxml,name) {
    var xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    if (name){
        return myxml[name].toString();
    } else {
        return myxml.toString();
    }
}

CSL.XmlE4X.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function (myxml,nodename,attrname,attr,val) {
    var xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    if (attr[0] != '@'){
        attr = '@'+attr;
    }
    myxml[nodename].(@name == attrname)[0][attr] = val;
}

CSL.XmlE4X.prototype.deleteNodeByNameAttribute = function (myxml,val) {
    delete myxml.*.(@name==val)[0];
}

CSL.XmlE4X.prototype.deleteAttribute = function (myxml,attr) {
    delete myxml["@"+attr];
}

CSL.XmlE4X.prototype.setAttribute = function (myxml,attr,val) {
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    myxml['@'+attr] = val;
}

CSL.XmlE4X.prototype.nodeCopy = function (myxml) {
    return myxml.copy();
}

CSL.XmlE4X.prototype.getNodesByName = function (myxml,name,nameattrval) {
    var xml, ret, retnodes;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    retnodes = myxml.descendants(name);
    ret = [];
    if (nameattrval){
        retnodes = retnodes.(@name == nameattrval);
        if (retnodes.toXMLString()) {
            ret.push(retnodes);
        }
    } else {
        for each(var retnode in retnodes) {
            ret.push(retnode);
        }
    }
    return ret;
}

CSL.XmlE4X.prototype.nodeNameIs = function (myxml,name) {
    var xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    if (myxml.localName() && myxml.localName().toString() == name){
        return true;
    }
    return false;
}

CSL.XmlE4X.prototype.makeXml = function (myxml) {
    var xml;
    // Reset to XML defaults before plunging into E4X.
    // Per https://www.zotero.org/trac/ticket/1780
    XML.ignoreComments = true;
    XML.ignoreProcessingInstructions = true;
    XML.ignoreWhitespace = true;
    XML.prettyPrinting = true;
    XML.prettyIndent = 2;
    
    if ("xml" == typeof myxml){
        // print("forcing serialization of xml to fix up namespacing");
        myxml = myxml.toXMLString();
    };
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    xml = new Namespace("http://www.w3.org/XML/1998/namespace");
    if (myxml){
        // print("deserializing xml");
        myxml = myxml.replace(/\s*<\?[^>]*\?>\s*\n*/g, "");
        myxml = new XML(myxml);
    } else {
        // print("no xml");
        myxml = new XML();
    }
    return myxml;
};

CSL.XmlE4X.prototype.insertChildNodeAfter = function (parent,node,pos,datexml) {
    var myxml, xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    myxml = XML(datexml.toXMLString());
    parent.insertChildAfter(node,myxml);
    delete parent.*[pos];
    return parent;
};

CSL.XmlE4X.prototype.insertPublisherAndPlace = function(myxml) {
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    for each (var node in myxml..group) {
            if (node.children().length() === 2) {
                var twovars = [];
                for each (var child in node.children()) {
                        if (child.children().length() === 0
) {
                            twovars.push(child.@variable.toString());
                            if (child.@suffix.toString()
                                || child.@prefix.toString()) {
                                
                                twovars = [];
                                break;
                            }

                        }
                    }
                if (twovars.indexOf("publisher") > -1 && twovars.indexOf("publisher-place") > -1) {
                    node["@has-publisher-and-publisher-place"] = "true";
                }
            }
        }
};

CSL.XmlE4X.prototype.isChildOfSubstitute = function(node) {
    if (node.parent()) {
        if (node.parent().localName() === "substitute") {
            return true;
        } else {
            return this.isChildOfSubstitute(node.parent());
        }
    }
    return false;
};

CSL.XmlE4X.prototype.addMissingNameNodes = function(myxml) {
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    for each (node in myxml..names) {
        if ("xml" == typeof node && !this.isChildOfSubstitute(node) && node.elements("name").length() === 0) {
            var name = <name/>;
            node.appendChild(name);
        }
    }
};

CSL.XmlE4X.prototype.addInstitutionNodes = function(myxml) {
    var institution_long, institution_short, name_part, children, node, xml;
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    //institution_short = <institution
    //    institution-parts="long"
    //    delimiter=", "
    //    substitute-use-first="1"
    //    use-last="1"/>;
    for each (node in myxml..names) {
        //print("names");
        if ("xml" == typeof node && node.elements("name").length() > 0) {
            var name = node.name[0];
            if (node.institution.length() === 0) {
                institution_long = <institution
                    institution-parts="long"
                    delimiter=", "
                    substitute-use-first="1"
                    use-last="1"/>
                institution_part = <institution-part name="long"/>;
                node.insertChildAfter(name,institution_long);
                if (node.name.@delimiter.toString()) {
                    node.institution.@delimiter = node.name.@delimiter.toString();
                }
                if (node.name.@and.toString()) {
                    node.institution.@and = "text";
                }

                node.institution[0].appendChild(institution_part);
                for each (var attr in CSL.INSTITUTION_KEYS) {
                    if (node.name.@[attr].toString()) {
                        node.institution['institution-part'][0].@[attr] = node.name.@[attr].toString();
                    }
                }
                for each (var namepartnode in node.name['name-part']) {
                       if (namepartnode.@name.toString() === 'family') {
                        for each (var attr in CSL.INSTITUTION_KEYS) {
                            if (namepartnode.@[attr].toString()) {
                                node.institution['institution-part'][0].@[attr] = namepartnode.@[attr].toString();
                            }
                        }
                       }
                }
            }
        }
    }
};

CSL.XmlE4X.prototype.flagDateMacros = function(myxml) {
    default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
    for each (node in myxml..macro) {
        if (node..date.length()) {
            node.@['macro-has-date'] = 'true';
        }
    }
};



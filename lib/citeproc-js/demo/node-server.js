// node-server.js
// for citeproc-js CSL citation formatter

var port = 16005;

var http = require('http');
var url = require('url');
var fs = require('fs');

// This is the list of files this server will serve - no others.
var filesToServe = [
    '/demo/demo.html',
    '/demo/local.css',
    '/xmldom.js',
    '/citeproc.js',
    '/demo/demo.js',
    '/demo/citations.json',
    '/demo/locales-en-US.xml',
    '/demo/chicago-fullnote-bibliography.csl',
    '/demo/README.md'
];

http.createServer(function (request, response) {
    var uriObj = url.parse(request.url);
    var uri_href = uriObj.href;
    console.log("Request for " + uri_href);

    // Root resources will redirect
    if (uri_href == '/') {
        response.writeHead(302, {'Location': '/demo/demo.html'});
        response.end();
    }

    else if (filesToServe.indexOf(uri_href) > -1) {
        // Translate URL path into filename.  This assumes the file is either
        // in the local directory (/demo) or in the parent.
        var filename = (uri_href.substr(0, 6) == '/demo/')
            ? uri_href.substr(6)
            : '../' + uri_href.substr(1);

        returnFile(response, filename);
    }

    else {
        resp_error(response, 400, "Sorry, I don't know about that file");
    }
}).listen(port);

function returnFile(response, filename) {
    fs.readFile(filename, function(err, data) {
        if (err) {
            resp_error(response, 500, "Error trying to retrieve that file: " + err);
        }
        else {
            response.writeHead(200, {'Content-Type': media_type(filename)});
            response.end(data);
        }
    });
};

function resp_error(response, status, msg) {
    console.log("  " + msg);
    response.writeHead(status, {'Content-Type': 'text/plain'});
    response.end(msg);
}

function media_type(filename) {
    if (filename.slice(-3) === '.js') {
        return 'text/javascript';
    }
    else if (filename.slice(-5) === '.json') {
        return 'application/json';
    }
    else if (filename.slice(-5) === '.html') {
        return 'text/html';
    }
    else if (filename.slice(-4) === '.css') {
        return 'text/css';
    }
    else if (filename.slice(-4) === '.xml') {
        return 'text/xml';
    }
    else {
        return "text/plain";
    }
}

console.log("Point your browser at http://localhost:" + port + "/");
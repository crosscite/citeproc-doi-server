# `citeproc-js` Demo Page

The code in this folder can be used to spin up a local `citeproc-js`
demo page.  It is mainly intended as a sample of running code for
developers working with the processor.

The demo.html page must be served from an HTTP server.  (Because it uses AJAX
requests, it won't work if you open it in your browser from the filesystem.)
So, either put this citeproc-js repository in a directory served by, for example,
Apache, or you can use Node.js with the included tiny server script,
node-server.js.

To start the server, clone this repo to your local machine, open a terminal,
enter this `./demo` subdirectory, and run the following command:

    node ./node-server.js

Point a browser at the address reported by the server, and the
demo page should appear.

See the demo.js file for more information about how it works.

----
Hope this helps. If you run into any snags, feel free to give me a shout.

Frank Bennett
Nagoya
Japan

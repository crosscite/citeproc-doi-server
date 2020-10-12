dojo.provide("citeproc_js.makecitationcluster");


doh.registerGroup("citeproc_js.makecitationcluster",
    [
        function testMakeCitationCluster(){
            var xml = "<style "
                + "      xmlns=\"http://purl.org/net/xbiblio/csl\""
                + "      class=\"note\""
                + "      version=\"1.0\">"
                + "      <info>"
                + "        <id />"
                + "        <title />"
                + "        <updated>2009-08-10T04:49:00+09:00</updated>"
                + "      </info>"
                + "      <citation>"
                + "        <sort>"
                + "          <key variable=\"title\"/>"
                + "        </sort>"
                + "        <layout delimiter=\"; \">"
                + "          <group delimiter=\", \">"
                + "            <text variable=\"title\"/>"
                + "            <group delimiter=\" \">"
                + "              <label variable=\"locator\" form=\"short\"/>"
                + "              <text variable=\"locator\"/>"
                + "            </group>"
                + "          </group>"
                + "        </layout>"
                + "      </citation>"
                + "      <bibliography>"
                + "        <layout delimiter=\"x \">"
                + "          <text variable=\"title\"/>"
                + "        </layout>"
                + "      </bibliography>"
                + "    </style>"
            var style = citeproc_js.makecitationcluster.initCiteproc(xml);

            style.updateUncitedItems(["Item-3", "Item-4"]);
            var bib = style.makeBibliography();
            doh.assertEqual(2, bib[1].length);

            var result = citeproc_js.makecitationcluster.doMakeCitationClusterItemOneTwo(style);
            doh.assertEqual("Hello Alan Partridge!, p. 15; Hello ZZ Top!, p. 10", result);

            var bib = style.makeBibliography();
            doh.assertEqual(2, bib[1].length);
            doh.assertEqual("  <div class=\"csl-entry\">Goodbye!</div>\n", bib[1][0]);
            doh.assertEqual("  <div class=\"csl-entry\">Goodbye again!</div>\n", bib[1][1]);
        }
    ],
    function(){  //setup
        citeproc_js.makecitationcluster.initCiteproc = function(myxml){
            var sys = new StdRhinoTest(null, "jsc");
            sys.test.input = [
                {
                    id: "Item-1",
                    title: "Hello ZZ Top!",
                    type: "book"
                },
                {
                    id: "Item-2",
                    title: "Hello Alan Partridge!",
                    type: "book"
                },
                {
                    id: "Item-3",
                    title: "Goodbye!",
                    type: "book"
                },
                {
                    id: "Item-4",
                    title: "Goodbye again!",
                    type: "book"
                }
            ];
            sys._setCache();
            var style = new CSL.Engine(sys, myxml);
            return style;
        }
        citeproc_js.makecitationcluster.doMakeCitationClusterItemOne = function(style){
            var ret = style.makeCitationCluster([
                {
                    id: "Item-1",
                    position: 0
                }
            ])
            return ret;
        };
        citeproc_js.makecitationcluster.doMakeCitationClusterItemTwo = function(style){
            var ret = style.makeCitationCluster([
                {
                    id: "Item-2",
                    position: 0
                }
            ])
            return ret;
        };
        citeproc_js.makecitationcluster.doMakeCitationClusterItemOneTwo = function(style){
            var ret = style.makeCitationCluster([
                {
                    id: "Item-1",
                    position: 0,
                    locator: "10"
                },
                {
                    id: "Item-2",
                    position: 0,
                    locator: "15"
                }
            ])
            return ret;
        };
    },
    function(){    // teardown
    }
);

/*
*/

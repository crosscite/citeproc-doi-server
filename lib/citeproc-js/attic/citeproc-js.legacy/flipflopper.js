dojo.provide("citeproc_js.flipflopper");

doh.register("citeproc_js.flipflopper", [
	function testProcessTagsUnopenedCloseTags(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("head<i>italic</b>bold's");
		ff.processTags();
		doh.assertEqual(39,ff.blob.blobs.length);
		doh.assertEqual("head&#60;i&#62;italic&#60;/b&#62;bold\u2019s",ff.blob.blobs);
	},
	function testImmediateClosingSingleQuote(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("O\u2019Malley");
		ff.processTags();
		doh.assertEqual(8,ff.blob.blobs.length);
		doh.assertEqual("O\u2019Malley",ff.blob.blobs);
	},
	function testGetSplitStringsTwo(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello\\</b>again<i>ok</i>now");
		doh.assertEqual(5, ff.strs.length);
		doh.assertEqual("hello&#60;b&#62;hello&#60;/b&#62;again", ff.strs[0]);
		doh.assertEqual("ok", ff.strs[2]);
		doh.assertEqual("</i>",ff.strs[3]);
	},
	function testGetSplitStringsOne(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello");
		doh.assertEqual(1, ff.strs.length);
		doh.assertEqual(21, ff.strs[0].length);
		doh.assertEqual("hello&#60;b&#62;hello",ff.strs[0]);
	},
	function testProcessTagsOpenEnded(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>ITALIC \"quote -- <i>important");
		ff.processTags();
		doh.assertEqual(3,ff.blob.blobs.length);
		doh.assertEqual("hello ",ff.blob.blobs[0].blobs);
		doh.assertEqual("italic ",ff.blob.blobs[1].blobs[0].blobs);
		doh.assertEqual("bold+italic",ff.blob.blobs[1].blobs[1].blobs[0].blobs);
		doh.assertEqual(" YY ",ff.blob.blobs[1].blobs[2].blobs);
		doh.assertEqual("ITALIC \u201cquote -- &#60;i&#62;important",ff.blob.blobs[2].blobs);
	},
	function testProcessTagsCrossNesting(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>italic \"quote <b>XXhello</b>ZZ");
		ff.processTags();
		doh.assertEqual(5,ff.blob.blobs.length);
		doh.assertEqual("italic \u201cquote ",ff.blob.blobs[2].blobs);
		doh.assertEqual("XXhello",ff.blob.blobs[3].blobs[0].blobs);
		doh.assertEqual("ZZ",ff.blob.blobs[4].blobs);

		//doh.assertEqual("ZZ",ff.blob.blobs[2].blobs);
		//doh.assertEqual("hello</b>",ff.blob.blobs[4].blobs);
		//
		// i.e. [<blob.blobs:"italic ">,<blob>,<blob.blobs:" YY ">]
		//
		//doh.assertEqual(3, ff.blob.blobs[1].blobs.length);
	},
]);


var x = [
]

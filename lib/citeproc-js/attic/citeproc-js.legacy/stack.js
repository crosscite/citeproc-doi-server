dojo.provide("citeproc_js.stack");

doh.register("citeproc_js.stack", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Stack();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testInitEmpty(){
		var obj = new CSL.Stack();
		doh.assertEqual(0, obj.mystack.length);
	},
	function testInitValue(){
		var obj = new CSL.Stack("hello");
		doh.assertEqual("hello", obj.mystack[0]);
	},
	function testInitUndefinedLiteral(){
		var obj = new CSL.Stack(undefined,true);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[0]);
	},
	function testPushValue(){
		var obj = new CSL.Stack();
		obj.push("hello");
		doh.assertEqual("hello",obj.mystack[0]);
	},
	function testPushUndefinedValue(){
		var obj = new CSL.Stack();
		obj.push(undefined);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("", obj.mystack[0]);
	},
	function testPushUndefinedLiteral(){
		var obj = new CSL.Stack();
		obj.push(undefined,true);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[0]);
	},
	function testClear(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual(2, obj.mystack.length);
		obj.clear();
		doh.assertEqual(0, obj.mystack.length);
	},
	function testErrorOnEmptyStackReplace(){
		var obj = new CSL.Stack();
		try {
			obj.replace("hello");
			var res = "Ooops, this should raise an error";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Internal CSL processor error: attempt to replace nonexistent stack item with hello", res);
		CSL.debug(res + " (this error is correct)");
	},
	function testReplaceWithValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.replace("two-and-a-half");
		doh.assertEqual("two-and-a-half", obj.mystack[1]);
	},
	function testReplaceNoValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.replace();
		doh.assertEqual("", obj.mystack[1]);
	},
	function testPop(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.pop();
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[1]);
		doh.assertEqual("one", obj.mystack[0]);
	},
	function testValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual("two", obj.value());
	},
	function testLength(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual(2, obj.length());
	}

]);

module("randNumTest");
test("randNumTest", function(){
    equal(-100, randNum(0), "return to expected data");
});

//module("createLineColorChartInfoTest");
//test("createLineColorChartInfoTest", function(){
//    deepEqual({"id": 0, "x": 0, "y": 0, "width": 0, "height": 0, "color": "red"},
//	  createLineColorChartInfo(0, 0, 0, 0, 0, "red"),
//	  "return to expected data");
//    deepEqual({"id": 0, "x": 0, "y": 0, "width": 0, "height": 1, "color": "red"},
//	  createLineColorChartInfo(0, 0, 0, 0, 1, "red"),
//	  "return to expected data");
//});
//
//module("getHashSizeTest");
//test("getHashSizeTest", function(){
//    equal(0, getHashSize(0), "return to expected data");
//    equal(5, getHashSize([0, 1, 2, 3, 'a']), "return to expected data");
//    equal(0, getHashSize(-1), "return to expected data");
//});

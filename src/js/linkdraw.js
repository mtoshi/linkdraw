/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

*/


/* 

 global values

*/

var linkdraw = {};

/*

  console log for debug

*/
(function () {
  if (typeof window.console === "undefined") {
    window.console = {}
  }
  if (typeof window.console.log !== "function") {
    window.console.log = function () {}
  }
})();

/*

  functions

*/

function cLog(x) {
  // debug
  var debug = true;
  var debug = false;
  if (debug) console.log(x);
}

function randNum(n){
  var i = 100;
  var x = Math.floor(Math.random() * n);
  if (n - x > i) {
    return x + i/2;
  } else {
    return x - i;
  }
}

function createPositionData(sysId){
  var position = {};
  var nodes = linkdraw[sysId].nodes;
  for (var i in nodes) {
    var node = nodes[i];
    var id   = node.id;
    var name = node.name;
    $("circle#" + id).each(function() {
      var x = this.getAttribute("cx");
      var y = this.getAttribute("cy");
      position[name] = { "x": parseInt(x), "y": parseInt(y) };
    });
  }
  return { "file": linkdraw[sysId].positionPath, "data": { "position": position, "scale": linkdraw[sysId].scale, "translate": linkdraw[sysId].translate } }
}

function positionUpload(sysId) {

  var id = createSaveButtonId(sysId);

  $("." + id).click(function(){

    var json = createPositionData(sysId);
    var str = JSON.stringify(json);
    cLog("# position save data #");
    cLog(JSON.parse(str));

    $.ajax({
      type: 'POST',
      dataType:'text',
      contentType: "application/json; charset=utf-8",
      url: linkdraw[sysId].positionWriter,
      async: true,
      cache : false,
      data: str,
      success: function() {
        cLog("json upload successed.");
        alert("Position saved.");
      },
      error: function(jqXHR, textStatus, errorThrown){
        cLog("json upload failed.");
        cLog("status : " + textStatus);
        cLog("text : " + jqXHR.responseText);
      },
      complete: function(){
        cLog("json upload finished.");
      }
    });
  });
}

function getJson(filename) {
  var config = false;
  $.ajax({
    type: "GET",
    dataType: "json",
    async: false,
    cache: false,
    contentType: 'application/json',
    url: filename,
    success: function(data) {
      var json = JSON.stringify(data);
      config = JSON.parse(json)
      cLog("ajax config load");
      cLog(config);
    },
    error: function () {
      cLog("ajax config load error");
      //alert('ajax config load error');
    }
  });

  return config;
}

function lineIdFormat(str, sysId, source, target, n){
  return str + "_" + sysId + "_" + source + "_" + target + "_" + n;
}
function createLineId(sysId, source, target, n){
  return lineIdFormat("line", sysId, source, target, n);
}
function createLineTextId(sysId, source, target, n){
  return lineIdFormat("linetext", sysId, source, target, n);
}
function createLineTextPathId(sysId, source, target, n){
  return lineIdFormat("textpath", sysId, source, target, n);
}
function createLinePathId(sysId, source, target, n){
  return lineIdFormat("path", sysId, source, target, n);
}

function createSysGroupId(sysId){
  return "group_" + sysId;
}
function createNodeGroupId(sysId, nodeName){
  return "node_group_" + sysId + "_" + nodeName;
}
function createNodeId(sysId, nodeName){
  return "node_" + sysId + "_" + nodeName;
}
function createLineGroupId(sysId, lineId){
  return "line_group_" + sysId + "_" + lineId;
}
function createNodeTextId(sysId, nodeName){
  return "text_" + sysId + "_" + nodeName;
}

function createSaveButtonId(sysId){
  return "positionSave_" + sysId;
}

function createNodeTextPosition(x, y){
  return { "x": x + 10, "y": y - 10 };
}

function defaultNodeConfig(name){
  return { "name": name, "r":linkdraw.nodeR, "color":linkdraw.nodeColor, "link": "" };
}

function getPosition(name, sysId){
  var position = linkdraw[sysId].position;
  var p = position[name];
  if (p){
    return p;
  } else {
    var width  = linkdraw[sysId].width;
    var height = linkdraw[sysId].height;
    var x = randNum(width);
    var y = randNum(height);
    position[name] = { "x": x, "y": y };
    return position[name];
  }
}

function getAngle(x1,y1,x2,y2){
  var x = x2-x1;
  var y = y2-y1;
  return Math.atan2(y, x);
}

function getAngleAbs(x1,y1,x2,y2){
  var x = Math.abs(x2-x1);
  var y = Math.abs(y2-y1);
  return Math.atan2(y, x);
}

function getPoint(len, rad){
  var x = len*Math.cos(rad);
  var y = len*Math.sin(rad);
  return { "x": x, "y": y };
}

function createMidlePoint(x1, y1, x2, y2, num, maxNum){

  var rad = getAngleAbs(x1,y1,x2,y2);
  var r;

  if (rad < getAngleAbs(0,0,100,100)){
    r = getAngle(0,0,0,100);
  } else {
    r = getAngle(0,0,100,0);
  }

  if (maxNum == 2){
    num = num + 1
  } 
  if (num%2 == 0){
    num = num * -1;
  } else {
    num = num -1;
  }
  var len = 10 * num;
  var p = getPoint(len, r);
  var x = p.x + (x1+x2)/2;
  var y = p.y + (y1+y2)/2;

  return { "x": x, "y": y };
}

function getXY(r, x1, y1, x2, y2) {
  var rad = getAngle(x1,y1,x2,y2) / 2;
  var ad = r * Math.cos(rad);
  var bd = r * Math.sin(rad);
  var x = ad * Math.cos(rad) - bd * Math.sin(rad);
  var y = ad * Math.sin(rad) + bd * Math.cos(rad);
  return { "x": x, "y": y };
}

function createPoints(r1, r2, x1, y1, x2, y2, num, maxNum){

  var rad1 = getAngle(x1,y1,x2,y2) / 2;
  var rad2 = getAngle(x2,y2,x1,y1) / 2;

  var n1 = rad1 * r1;
  var n2 = rad2 * r2;

  p1 = getXY(r1, x1 + n1, y1 + n1, x2 + n2, y2 + n2);
  p2 = getXY(r2, x2 + n2, y2 + n2, x1 + n1, y1 + n1);

  x1 = p1.x + x1;
  y1 = p1.y + y1;

  x2 = p2.x + x2;
  y2 = p2.y + y2;

  if (maxNum == 1){
    return  x1 + "," + y1 +  " " + x2 + "," + y2;
  } else {
    var m = createMidlePoint(x1, y1, x2, y2, num, maxNum);
    return  x1 + "," + y1 + " " + m.x + "," + m.y + " " + x2 + "," + y2;
  }
}

function createPathData(r1, r2, x1, y1, x2, y2, num, maxNum){
  var pData = createPoints(r1, r2, x1, y1, x2, y2, num, maxNum);
  return  "M " + pData;
}


function sortPairDirection(pairs, source, target) {
  // for already A - B
  var bool = isAlreadyPair(pairs, source, target);
  if (bool) {
    return { "source": source, "target": target };
  }
  // for already B - A
  var bool = isAlreadyPair(pairs, target, source);
  if (bool) {
    return { "source": target, "target": source };
  }
  // not found
  return { "source": source, "target": target };
}

function isAlreadyPair(pairs, a, b) {
  if (pairs[a]){
    if (pairs[a][b]){
      return true; 
    }
  }
  return false; 
}

function addPair(obj, source, target, line) {
  if (obj[source]) {
    if (obj[source][target]) {
      obj[source][target].push(line);
    } else {
      obj[source][target] = [ line ];
    }
  } else {
    obj[source] = {};
    obj[source][target] = [ line ];
  }
}

function addNodeLineBind(obj, nodeName, line) {
  if (obj[nodeName]){
    obj[nodeName].push(line);
  } else {
    obj[nodeName] = [ line ];
  }
}

function transformView(sysId) {
  var sysGroupId = createSysGroupId(sysId);
  d3.selectAll("." + sysGroupId)
    .attr("transform", "translate(" + linkdraw[sysId].translate + ")" + " scale(" + linkdraw[sysId].scale + ")");
}

function makeLineColors(colors) {
  obj = {};
  for (var i in colors) {
    var id    = colors[i].id;
    var color = colors[i].color;
    obj[id] = color;
  }
  return obj;
}
function lineColorSelect(color, lineColors) {

  var _color = lineColors[color];

  // use "#123456"
  if (color.match(/#/)) {
    return color;

  // use default color
  } else if (color == "") {
    return linkdraw.lineColor;

  // use color name (ex: blue, red, green, etc.)
  } else if (typeof _color === "undefined") {
    return color;

  // use defined color name of line color chart config.
  } else {
    return _color;
  }
}

function randNumForNoCache() {
  return parseInt((new Date)/1000);
}

function initPositionData(obj) {
  var x = obj["position"];
  if (x) {
    return x;
  } else {
    return {};
  }
}

function initScaleData(obj) {
  var x = obj["scale"];
  if (x) {
    return x;
  } else {
    return 1;
  }
}

function initTranslateData(obj) {
  var x = obj["translate"];
  if (x) {
    return x;
  } else {
    return [ 0, 0 ];
  }
}

function initConfigData(obj) {
  if (obj) {
    return obj;
  } else {
    return { 
      "time": "",
      "descr": "",
      "nodeColors": [],
      "lineColors": [],
      "nodes": [],
      "lines": []
    };
  }
}

function mergeNodeConfig(sysId, nodes, lineNodes) {

  var x = {};

  // merge line node and node config
  for (var name in lineNodes) {
    var node = nodes[name];
    if (node) {
    } else {
      node = defaultNodeConfig(name);
      nodes[name] = node;
    }
  }

  for (var name in nodes) {

    // id
    var nodeId     = createNodeId(sysId, name);
    var textId     = createNodeTextId(sysId, name);
    var groupId    = createNodeGroupId(sysId, name);
    var sysGroupId = createSysGroupId(sysId);

    // add id
    var node = nodes[name];
    node.id         = nodeId;
    node.textId     = textId;
    node.groupId    = groupId;
    node.sysGroupId = sysGroupId;

    // store
    x[nodeId] = node;

  }
  return x; 
}

function extractLineNode(lines){
  var nodes = {}; 
  for (var i=0;i<lines.length;i++) {
    var line = lines[i];
    var source = line.source;
    var target = line.target;
    nodes[source] = line;
    nodes[target] = line;
  }
  return nodes;
}

function parseNodeConfig(sysId, nodes, nodeColors) {
  var x = {};
  if (nodes) {
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      var nodeName = node.name;
      var color = node.color;
      if (nodeColors[color]) {
        node.color = nodeColors[color];
      }
      x[nodeName] = node;
    }
  }
  return x;
}

function getPairLength(pairs, s, t) {
  if (pairs[s]) {
    if (pairs[s][t]) {
      return pairs[s][t].length;
    }
  }
  return 0;
}
function addLineConfigItem(hash, s, t, lines) {

  if (hash[s]) {
    if (hash[s][t]) {
      hash[s][t].concat(lines);
    } else {
      hash[s][t] = lines;
    }
  } else {
    hash[s] = {};
    hash[s][t] = lines;
  }
  return hash;
}

function lineConfigVals(mod, add, del) {
   return { "mod": mod, "add": add, "del": del };
}

function getLineConfigDiff(linesNew, linesOld, pairsNew, pairsOld) {

  var addItem = {};
  var modItem = {};
  var delItem = {};

  for (var s in pairsNew) {
    for (var t in pairsNew[s]) {

      var lines = pairsNew[s][t];
      var oldLen = getPairLength(pairsOld, s, t);
      var newLen = getPairLength(pairsNew, s, t);

      // only mod
      if (oldLen == newLen) {
        modItem = addLineConfigItem(modItem, s, t, lines);

      // add new line
      } else if (oldLen < newLen) {
        var _lines = lines.slice(0, oldLen);
        modItem = addLineConfigItem(modItem, s, t, _lines);
        var _lines = lines.slice(oldLen, newLen);
        addItem = addLineConfigItem(addItem, s, t, _lines);
      }
    }
  }

  // for deleted line (old exsisted line)
  for (var s in pairsOld) {
    for (var t in pairsOld[s]) {

      var lines = pairsOld[s][t];
      var oldLen = getPairLength(pairsOld, s, t);
      var newLen = getPairLength(pairsNew, s, t);

      // delete all line
      if ((oldLen > 0 ) && (newLen == 0)) {
        delItem = addLineConfigItem(delItem, s, t, lines);

      // delete line
      } else if (oldLen > newLen) {
        var newLines = pairsNew[s][t];
        var _lines = newLines.slice(0, newLen);
        modItem = addLineConfigItem(modItem, s, t, _lines);
        var _lines = lines.slice(newLen, oldLen);
        delItem = addLineConfigItem(delItem, s, t, _lines);
      }
    }
  }

  return { "add": addItem, "mod": modItem, "del": delItem }
  
}

function updateTime(svg, sysId, time) {

  var id = "sys_time_" + sysId;

  // delete time
  d3.select("text#" + id).remove();

  // create time
  createText(svg, id, time, "10", "20");
}

function updateDescr(svg, sysId, descr) {

  var id = "sys_descr_" + sysId;

  // delete descr
  d3.select("text#" + id).remove();

  // create descr
  createText(svg, id, descr, "10", "40");
}

function modLine(lines) {

  for (var i=0; i<lines.length; i++) {

    var line = lines[i];
    var lineId       = line.lineId;
    var pathId       = line.pathId;
    var textPathId   = line.textPathId;
    var lineTextId   = line.lineTextId;

    // position
    var pathData = line.pathData;
    var points   = line.points;

    // color
    var lineColor = line.color;

    // width
    var lineWidth = line.width;

    // descr
    var lineDescr = line.descr;

    // change polyline
    d3.select("polyline#" + lineId)
      .attr("points", points)
      .style("stroke-width", lineWidth)
      .style("stroke", lineColor);

    // change path
    d3.select("path#" + pathId)
      .attr("d", pathData);

    /*
      d3.js could not get "textPath" element. 
      So this setting uses jQuery. (2013/04/28)
    
      d3.select("textPath#" + textPathId)
        .text(lineDescr);
    */
    $("#" + textPathId).text(lineDescr);
      //.attr("startOffset", "50%")
      //.attr("text-anchor", "middle");
      //.attr("text", lineDescr);

    // change line style
    d3.select("text#" + lineTextId)
      .attr("x", "")// for Safari 5.1.7
      .attr("y", "")// for Safari 5.1.7
      .attr("startOffset", "50%") // for Safari 5.1.7
      .attr("text-anchor", "middle") // for Safari 5.1.7
      .style("fill", lineColor)
      .style("color", lineColor);

  }
}
function addLine(svg, lines) {
  createLine(svg, lines);
}
function delLine(svg, lines) {

  for (var i=0; i<lines.length; i++) {

    var line = lines[i];
    var lineId      = line.lineId;
    var pathId      = line.pathId;
    var textPathId  = line.textPathId;
    var lineTextId  = line.lineTextId;
    var lineGroupId = line.lineGroupId;

    var lineColor = line.color;
    var lineDescr = line.descr;

    // del group
    d3.select("g#" + lineGroupId).remove();

    // del line text
    d3.select("text#" + lineTextId).remove();

    /*
      d3.js could not get "textPath" element. 
      So this setting uses jQuery. (2013/04/28)
    
      d3.select("textPath#" + textPathId)
        .text(lineDescr);
    */
    $("textPath#" + textPathId).remove();

    // del polyline
    d3.select("polyline#" + lineId).remove();
  }

}

function updateLine(svg, lineItems){
  var addItem = lineItems.add;
  var modItem = lineItems.mod;
  var delItem = lineItems.del;

  // del
  for (var s in delItem) {
    for (var t in delItem[s]) {
      var lines = delItem[s][t];
      delLine(svg, lines);
    }
  }

  // mod
  for (var s in modItem) {
    for (var t in modItem[s]) {
      var lines = modItem[s][t];
      modLine(lines);
    }
  }

  // add
  for (var s in addItem) {
    for (var t in addItem[s]) {
      var lines = addItem[s][t];
      addLine(svg, lines);
    }
  }
 
}

function getNodeConfigDiff(nodeOld, nodeNew) {
  var addItem = {};
  var delItem = {};
  var modItem = {};

  // Add and Mod check
  for (var i in nodeNew) {
    if (nodeOld[i]) {
      modItem[i] = nodeNew[i];
    } else {
      addItem[i] = nodeNew[i];
    }
  }

  // Delete check
  for (var i in nodeOld) {
    if (nodeNew[i]) {
      // mod
    } else {
      delItem[i] = nodeOld[i];
    }
  }

  cLog("### node config diff add ###");
  cLog(addItem);

  cLog("### node config diff del ###");
  cLog(delItem);

  cLog("### node config diff mod ###");
  cLog(modItem);

  return { "add":addItem, "del":delItem, "mod":modItem };
}

function addNode(svg, sysId, nodes, drag) {

  // add new node
  createNode(svg, sysId, nodes, drag);

}

function delNode(svg, sysId, nodes) {

  for (var id in nodes) {

    var node = nodes[id];

    // del group
    d3.select("g#" + node.groupId).remove();

    // del circle
    d3.select("circle#" + node.id).remove();

    // del text 
    d3.select("text#" + node.textId).remove();

  }
}

function modNode(svg, nodes) {

  for (var id in nodes) {

    var node = nodes[id];
    var nodeName = node.name;
    var r = node.r;

    // mod circle
    var node = nodes[id];
    d3.select("circle#" + node.id)
      .style("stroke", node.color)
      .style("fill", node.color)
      .attr("r", node.r);

    // mod text 
    d3.select("text#" + node.textId)
      .attr("xlink:href", node.link)
      .style("color", linkdraw.fontColor)
      .style("font-size", linkdraw.fontSize)
      .style("font-weight", linkdraw.fontWeight)
      .style("font-family", linkdraw.fontFamily)
      .text(nodeName);
  }
}

function updateNode(svg, sysId, item, drag) {
  addNode(svg, sysId, item.add, drag);
  delNode(svg, sysId, item.del);
  modNode(svg, item.mod);
}

function createSVG(id, sys){

  var width  = sys.width;
  var height = sys.height;

  d3.select(id)
    .style("width", width + "px")
    .style("height", height + "px")
    .style("background-color", "#FFF")
    .style("margin-top", "12px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("margin-bottom", "12px");

  var svg = d3.select(id)
    .append("svg")
      .style("version", "1.1")
      .style("overflow", "hidden")
      .style("position", "relative")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 " + width + " " + height);

  return svg
}

function createSaveButton(svg, sysId) {

  var x = 10;
  var y = 60;
  var width = 100;
  var height = 20;
  var leftSpace = 10;
  var id = createSaveButtonId(sysId);

  svg.append("rect")
    .attr("class", id)
    .attr("width", width + "px")
    .attr("height", height + "px")
    .attr("x", x + "px")
    .attr("y", y + "px")
    .on("click", positionUpload(sysId))
    .attr("rx", "4px")
    .attr("ry", "4px")
    .attr("stroke", "#004666")
    .attr("fill", "#00688B");
  svg.append("text")
    .attr("class", id)
    .attr("x", width / 2 + leftSpace + "px")
    .attr("y", y + height - 4 + "px")
    //.attr("pointer-events", "none")
    .attr("startOffset", "50%")
    .attr("text-anchor", "middle")
    .style("fill", "#FFF")
    .style("font-size", linkdraw.fontSize)
    .style("font-weight", linkdraw.fontWeight)
    .style("font-family", linkdraw.fontFamily)
    .on("click", positionUpload(sysId))
    .text("Position Save");

}

function countColor(colors){
  var n = 0;
  for (var i in colors) {
    n++; 
  }
  return n;
}

function createText(svg, id, update, x, y) {
  if (update) {
    svg.append("text")
      .attr("id", id)
      .attr("x", x + "px")
      .attr("y", y + "px")
      .style("fill", linkdraw.fontColor)
      .style("font-size", linkdraw.fontSize)
      .style("font-weight", linkdraw.fontWeight)
      .style("font-family", linkdraw.fontFamily)
      .text(update);
  }
}

function updateNodeColorChart(svg, sysId, colors, marginTop) {

  // margin
  var marginLeft   = 10;
  var marginBottom = 8;

  // color circle r
  var r = 6;

  // html class for remove and create 
  var class_name = "node_color_chart" + sysId;

  // remove
  d3.selectAll("." + class_name).remove();

  // create
  if (colors) {

    // chart title
    svg.append("text")
      .attr("class", class_name)
        .attr("x", marginLeft + "px")
        .attr("y", marginTop + "px")
        .text("Node Colors");

    // chart item
    for (var i in colors) {
      var y = r * 3 * i + marginTop + marginBottom;
      svg.append("circle")
        .attr("class", class_name)
        .attr("r", r + "px")
        .attr("cx", r + marginLeft + "px")
        .attr("cy", r + y + "px")
        .attr("fill-opacity", 0.6)
        .attr("fill", colors[i].color)
        .style("stroke", colors[i].color);

      var text_left_space = 4;
      svg.append("text")
        .attr("class", class_name)
        .attr("x", r * 2 + marginLeft + text_left_space + "px")
        .attr("y", y + 10 + "px")
        .style("font-size", linkdraw.fontSize)
        .style("font-weight", linkdraw.fontWeight)
        .style("font-family", linkdraw.fontFamily)
        .style("fill", linkdraw.fontColor)
        .text(colors[i].descr);
    }
    cLog("# node color check");
    cLog(colors);
  }
}

function updateLineColorChart(svg, sysId, colors, marginTop) {

  // margin
  var marginLeft   = 10;
  var marginBottom = 4;

  // color box height and width
  var colorChartBoxHeight = 20;
  var colorChartBoxWidth  = 10;

  // html class for remove and create 
  var class_line_color_chart = "line_color_chart" + sysId;

  // remove
  d3.selectAll("." + class_line_color_chart).remove();

  // create
  if (colors) {

    // chart title
    svg.append("text")
      .attr("class", class_line_color_chart)
        .attr("x", marginLeft + "px")
        .attr("y", marginTop + "px")
        .text("Line Colors");

    // chart item
    for (var i in colors) {
      var y = colorChartBoxHeight * i + marginTop;
      var _y = y + marginBottom;
      svg.append("rect")
        .attr("class", class_line_color_chart)
        .attr("width", colorChartBoxWidth + "px")
        .attr("height", colorChartBoxHeight + "px")
        .attr("x", marginLeft + "px")
        .attr("y", _y + "px")
        .attr("fill", colors[i].color);

      _y = y + colorChartBoxHeight;
      var text_left_space = 4;
      svg.append("text")
        .attr("class", class_line_color_chart)
        .attr("x", colorChartBoxWidth + marginLeft + text_left_space + "px")
        .attr("y", _y + "px")
        .style("font-size", linkdraw.fontSize)
        .style("font-weight", linkdraw.fontWeight)
        .style("font-family", linkdraw.fontFamily)
        .style("fill", linkdraw.fontColor)
        .text(colors[i].descr);
    }
    cLog("# line color check");
    cLog(colors);
  }
}

function createLine(svg, lines) {

  for (var i=0;i<lines.length;i++) {

    var line = lines[i];

    // id
    var id          = line.id;
    var lineId      = line.lineId;
    var pathId      = line.pathId;
    var textPathId  = line.textPathId;
    var lineTextId  = line.lineTextId;
    var lineGroupId = line.lineGroupId;
    var sysGroupId  = line.sysGroupId;

    // position
    var pathData = line.pathData;
    var points   = line.points;

    // color
    var lineColor = line.color;

    // width
    var lineWidth = line.width;

   
    var lineGroup = svg.append("g")
      .attr("id", lineGroupId)
      //.attr("class", "lineGroup")
      .attr("class", sysGroupId)
      .style("fill", "none");

    lineGroup.append("path")
      .attr("id", pathId)
      .attr("d", pathData);

    lineGroup.append("a")
      .attr("xlink:href", line.link)
      .append("text")
      .attr("id", lineTextId)
      .style("fill", lineColor)
      .style("color", lineColor)
      .style("font-size", linkdraw.fontSize)
      .style("font-weight", linkdraw.fontWeight)
      .style("font-family", linkdraw.fontFamily)
      .append("textPath")
      .attr("id", textPathId)
      .attr("xlink:href", "#" + pathId)
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .text(line.descr);

    lineGroup.append("polyline")
      .attr("id", lineId)
      .style("stroke-linecap", "butt")
      .style("stroke", lineColor)
      .style("opacity", 1.0)
      .style("stroke-width", lineWidth)
      .attr("points", points);
  }
}

function createNode(svg, sysId, nodes, drag) {

  for (var id in nodes) {
    var node = nodes[id];
    var nodeName   = node.name;
    var nodeId     = node.id;
    var textId     = node.textId;
    var groupId    = node.groupId;
    var sysGroupId = node.sysGroupId;

    var p = getPosition(nodeName, sysId);
    var r = node.r;
    var nodeTextPosition = createNodeTextPosition(p.x, p.y);

    var nodeGroup = svg.append("g")
      .attr("id", groupId)
      .attr("class", sysGroupId);

    nodeGroup.append("circle")
      .style("stroke", node.color)
      .style("fill", node.color)
      .style("fill-opacity", 0.6)
      .attr("id", nodeId)
      .attr("cx", p.x)
      .attr("cy", p.y)
      .attr("r", r);

    // drag event
    if (drag) {
      d3.select("circle#" + nodeId).call(drag);
    }

    nodeGroup.append("a")
      .attr("xlink:href", node.link)
      .append("text")
      .attr("id", textId)
      .attr("x", nodeTextPosition.x)
      .attr("y", nodeTextPosition.y)
      .style("color", linkdraw.fontColor)
      .style("font-size", linkdraw.fontSize)
      .style("font-weight", linkdraw.fontWeight)
      .style("font-family", linkdraw.fontFamily)
      .text(nodeName);
  }

}

function getLineNumber(pairs, a, b) {
  if (pairs[a]){
    if (pairs[a][b]){
      return pairs[a][b].length;
    }
  }
  return 0;
}

function makePairs(sysId, lines, lineColors) {

  var pairs = {};

  for (var i=0;i<lines.length;i++) {

    var line = lines[i];
    var source = line.source;
    var target = line.target;

    var pair = sortPairDirection(pairs, source, target);
    source = pair.source;
    target = pair.target;

    // reset source and target
    line.source = source;
    line.target = target;

    // create node id
    var sourceId = createNodeId(sysId, source);
    var targetId = createNodeId(sysId, target);

    // each span(node span) line count
    var n = getLineNumber(pairs, sourceId, targetId);

    // append id
    var id          = i;
    var lineId      = createLineId(sysId, source, target, n);
    var pathId      = createLinePathId(sysId, source, target, n);
    var textPathId  = createLineTextPathId(sysId, source, target, n);
    var lineTextId  = createLineTextId(sysId, source, target, n);
    var lineGroupId = createLineGroupId(sysId, lineId);
    var sysGroupId  = createSysGroupId(sysId);
    line.id          = id;
    line.lineId      = lineId;
    line.pathId      = pathId;
    line.textPathId  = textPathId;
    line.lineTextId  = lineTextId;
    line.lineGroupId = lineGroupId;
    line.sysGroupId  = sysGroupId;

    // append color
    var lineColor = lineColorSelect(line.color, lineColors);
    line.color = lineColor;

    // add pair to pairs obj
    addPair(pairs, sourceId, targetId, line);

  }
  cLog("# config lines #");
  cLog(lines);

  return pairs;
}

function makeBind(lines) {

  var bind = {};

  for (var i=0;i<lines.length;i++) {
    var line = line[i];
    var source = line.source;
    var target = line.target;
    // add source node and line binding
    addNodeLineBind(bind, source, line);
    
    // add target node and line binding
    addNodeLineBind(bind, target, line);
  }

  return bind;
}

function appendPosition(sysId) {

  var pairs = linkdraw[sysId].pairs;
  var nodes = linkdraw[sysId].nodes;

  for (var source in pairs) {
    for (var target in pairs[source]) {
      var lines = pairs[source][target];
      for (var i=0; i<lines.length;i++) {

        var line = lines[i];
        var r1 = nodes[source].r;
        var r2 = nodes[target].r;
        var p1 = getPosition(nodes[source].name, sysId);
        var p2 = getPosition(nodes[target].name, sysId);
        var lineNumber = i + 1;
        var lineNumberMax = lines.length;
        var pathData = createPathData(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);
        var points = createPoints(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);

        // store 
        line.pathData = pathData;
        line.points   = points;
        pairs[source][target][i] = line;

      }
    }
  }
}

function zoomEvent(svg, sysId) {
  svg.on("click", function(){
    svg.call(d3.behavior.zoom()
      .scale(linkdraw[sysId].scale)
      .translate(linkdraw[sysId].translate)
      .on("zoom", function redraw() {

        linkdraw[sysId].scale = d3.event.scale;
        linkdraw[sysId].translate = d3.event.translate;

        transformView(sysId);
      })
    );
  });
}

function dragEvent(sysId) {
  return d3.behavior.drag()
    .on("drag", function() {

      var pairs = linkdraw[sysId].pairs;
      var nodes = linkdraw[sysId].nodes;
      var dx, dy; 
      var id = this.id;

      dx = this.cx.baseVal.value + d3.event.dx;
      dy = this.cy.baseVal.value + d3.event.dy;

      // store new position
      nodeName = nodes[id].name;
      linkdraw[sysId].position[nodeName].x = dx;
      linkdraw[sysId].position[nodeName].y = dy;

      d3.select(this)
        .attr('cx', dx)
        .attr('cy', dy);
      cLog("node position" + id);

      var textId = nodes[id].textId;
      var nodeTextPosition = createNodeTextPosition(dx, dy);
      d3.select("text#" + textId)
        .attr('x', nodeTextPosition.x)
        .attr('y', nodeTextPosition.y);
      cLog("text position");
      cLog(d3.select("text#" + textId));
      
      for (var source in pairs) {
        for (var target in pairs[source]) {

          // new position
          var p1 = getPosition(nodes[source].name, sysId);
          var p2 = getPosition(nodes[target].name, sysId);
          if (this.id == source){
            p1.x = dx;
            p1.y = dy;
          } else if (this.id == target){
            p2.x = dx;
            p2.y = dy;
          }

          var r1 = nodes[source].r;
          var r2 = nodes[target].r;
          var lines = pairs[source][target];
          for (var i=0;i<lines.length;i++) {

            // polyline
            var line = lines[i];
            var lineId = line.lineId;

            var lineNumber = i + 1;
            var lineNumberMax = lines.length;

            var pathData = createPathData(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);
            var points = createPoints(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);
            var polyline = d3.select("polyline#" + line["lineId"]);
            polyline.attr("points", points);
            cLog("# polyline #");
            cLog(polyline);

            // path
            var path = d3.select("path#" + line["pathId"]);
            path.attr("d", pathData);
            cLog("# path #");
            cLog(path);

            // textpath

            /*
              d3.js could not get "textPath" element. 
              So this setting uses jQuery. (2013/04/28)
              var textpath = d3.select("textPath#" + line["textPathId"]);
            */

            var textpath = $("textPath#" + line["textPathId"]);
            textpath
              .attr("startOffset", "50%")
              .attr("text-anchor", "middle");
            cLog("# textpath #");
            cLog(textpath);

            // line text
            var lineText = d3.select("text#" + line["lineTextId"]);
            lineText
              .attr("x", "")// for Safari 5.1.7
              .attr("y", "")// for Safari 5.1.7
              .attr("startOffset", "50%") // for Safari 5.1.7
              .attr("text-anchor", "middle"); // for Safari 5.1.7
            cLog("# linetext #");
            cLog(lineText);
          }
       }
     }
  });

}

function drawItem(svg, sysId) {

  // fetch new config
  var configJson = getJson(linkdraw[sysId].configPath);

  // update svg items
  if (configJson) {
    updateItem(svg, sysId, configJson);
  }

}

function updateItem(svg, sysId, configJson) {

  // fetch new config
  var configJson = getJson(linkdraw[sysId].configPath);

  // keep old config and get new config
  var _config = linkdraw[sysId].config;
  linkdraw[sysId].config = initConfigData(configJson);

  // node colors
  var nodeColorConf = linkdraw[sysId].config.nodeColors;
  var nodeColors = makeLineColors(nodeColorConf);

  // keep old config and get new config
  var _nodes = linkdraw[sysId].nodes;
  linkdraw[sysId].nodes = parseNodeConfig(sysId, linkdraw[sysId].config.nodes, nodeColors);

  // keep old config and get new config
  var _lines = linkdraw[sysId].lines;
  linkdraw[sysId].lines = linkdraw[sysId].config.lines;

  // merge node config(line node name + node config)
  var lineNodes = extractLineNode(linkdraw[sysId].lines);
  linkdraw[sysId].nodes = mergeNodeConfig(sysId, linkdraw[sysId].nodes, lineNodes);

  // for color chart
  var lineColorConf = linkdraw[sysId].config.lineColors;
  var lineColors = makeLineColors(lineColorConf);

  // update time
  updateTime(svg, sysId, linkdraw[sysId].config.time);

  // update descr
  updateDescr(svg, sysId, linkdraw[sysId].config.descr);

  // margin for layout
  var marginTop = 100;

  // line color chart
  updateLineColorChart(svg, sysId, lineColorConf, marginTop);

  // margin for layout
  var nodeColorSize = countColor(lineColorConf);
  marginTop = marginTop + nodeColorSize * 26;

  // node color chart
  updateNodeColorChart(svg, sysId, nodeColorConf, marginTop);

  // keep old pairs and make new pairs
  var _pairs = linkdraw[sysId].pairs;
  linkdraw[sysId].pairs = makePairs(sysId, linkdraw[sysId].lines, lineColors);

  // add position to each lines
  appendPosition(sysId);

  // check node config diff
  var nodeItems = getNodeConfigDiff(_nodes, linkdraw[sysId].nodes);
  cLog("node config diff");
  cLog(nodeItems);

  // check line config diff
  var lineItems = getLineConfigDiff(linkdraw[sysId].lines, _lines, linkdraw[sysId].pairs, _pairs);
  cLog("line config diff");
  cLog(lineItems);

  // drag
  if (linkdraw[sysId].drag == false) {
    // disable
    var drag = false;
  } else {
    // enable(default)
    var drag = dragEvent(sysId);
  }

  // write node 
  updateNode(svg, sysId, nodeItems, drag);

  // write line
  updateLine(svg, lineItems);

  // reflect before zoom scale
  transformView(sysId);

}

(function($) {
  $.fn.linkDraw = function(sys) {

    // count system id for multiple.
    if (linkdraw.count) {
      linkdraw.count++;
    } else {
      linkdraw.count = 1;
    }
    sys.id = linkdraw.count;
    var sysId = sys.id;

    // keep system settings
    linkdraw[sysId] = sys;

    // keep system config values
    linkdraw[sysId].config = {};
    linkdraw[sysId].nodes = {};
    linkdraw[sysId].lines = {};
    linkdraw[sysId].pairs = {};

    // svg settings
    linkdraw.fontSize = "12px";
    linkdraw.fontFamily = 'Arial, "sans-serif", "Lucida Grande", "MS P Gothic"';
    linkdraw.fontWeight = "normal";
    linkdraw.fontColor = "#333";
    linkdraw.lineColor = "#666";
    linkdraw.nodeColor = "#666";
    linkdraw.nodeR = 4;

    // init position data
    var positionJson = getJson(linkdraw[sysId].positionPath);
    linkdraw[sysId].position  = initPositionData(positionJson);
    linkdraw[sysId].scale     = initScaleData(positionJson);
    linkdraw[sysId].translate = initTranslateData(positionJson);

    // create svg
    var svg = createSVG(this.selector, sys);

    // position save button
    if (sys.positionSave == false) {
      // disable
    } else {
      // enable(default)
      createSaveButton(svg, sysId);
    }

    // zoom
    if (sys.zoom == false) {
      // disable
    } else {
      // enable(default)
      zoomEvent(svg, sysId);
    }

    // draw
    drawItem(svg, sysId);
 
    if (sys.interval > 0) {
      setInterval(function() {
        drawItem(svg, sysId);
      }, 1000 * sys.interval);
    }
  }

})(jQuery);

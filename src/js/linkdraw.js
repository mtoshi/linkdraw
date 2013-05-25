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
  if (linkdraw.debug) console.log(x);
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

function createPositionData(filename){
  var position = {};
  var nodes = $("circle");
  for (var i in nodes) {
    var node = nodes[i];
    var id = node.id;
    if (id) {
      var x = node.getAttribute("cx");
      var y = node.getAttribute("cy");
      position[id] = { "x": parseInt(x), "y": parseInt(y) };
    }
  }
  return { "file": filename , "data": { "position": position, "scale": linkdraw.scale, "translate": linkdraw.translate } }
}

function positionUpload(filename) {

  var id = createSaveButtonId();

  $("." + id).click(function(){

    var json = createPositionData(filename);
    var str = JSON.stringify(json);
    cLog("# position save data #", JSON.parse(str));

    $.ajax({
      type: 'POST',
      dataType:'text',
      contentType: "application/json; charset=utf-8",
      url: linkdraw.positionWriter,
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
      cLog("ajax config load", config);
    },
    error: function () {
      cLog("ajax config load error");
      //alert('ajax config load error');
    }
  });

  return config;
}

function getConfigData(filename) {

  // first time
  getJson(filename);

  // after second
  setInterval(function() {
    getJson(filename);
  }, 1000 * 10);
}

function lineIdFormat(str, source, target, n){
  return str + "_" + source + "_" + target + "_" + n;
}
function createLineId(source, target, n){
  return lineIdFormat("line", source, target, n);
}
function createLineTextId(source, target, n){
  return lineIdFormat("linetext", source, target, n);
}
function createLineTextPathId(source, target, n){
  return lineIdFormat("textpath", source, target, n);
}
function createLinePathId(source, target, n){
  return lineIdFormat("path", source, target, n);
}

function createNodeGroupId(nodeName){
  return "node_group_" + nodeName;
}
function createLineGroupId(lineId){
  return "line_group_" + lineId;
}
function createNodeTextId(nodeName){
  return "text_" + nodeName;
}

function createSaveButtonId(){
  return "positionSave";
}

function createNodeTextPosition(x, y){
  return { "x": x + 10, "y": y - 10 };
}

function defaultNodeConfig(){
  return { "r":linkdraw.nodeR, "color":linkdraw.nodeColor, "link": "" };
}

function checkNode(id, nodes){
  var n = nodes[id];
  if (n){
    return n;
  } else {
    return defaultNodeConfig();
  }
}

function getPosition(id){
  var position = linkdraw.position;
  var width  = linkdraw.width;
  var height = linkdraw.height;
  var p = position[id];
  if (p){
    return p;
  } else {
    var x = randNum(width);
    var y = randNum(height);
    position[id] = { "x": x, "y": y };
    return position[id];
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

function transformView() {
  d3.selectAll("g.nodeGroup")
    .attr("transform", "translate(" + linkdraw.translate + ")" + " scale(" + linkdraw.scale + ")");
  d3.selectAll("g.lineGroup")
    .attr("transform", "translate(" + linkdraw.translate + ")" + " scale(" + linkdraw.scale + ")");
}

function zoomRate() {
  if (linkdraw.scale >= 1){
    return 1;
  } else {
    return 1 + 1 - linkdraw.scale;
  }
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
      "lineColors": [],
      "nodes": [],
      "lines": []
    };
  }
}

function parseNodeConfig(nodes) {
  var x = {};
  if (nodes) {
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      x[node.name] = node;
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

  //var item = {};
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

function updateTime(svg, time) {

  var id = "time";

  // delete time
  d3.select("text#" + id).remove();

  // create time
  createText(svg, id, time, "10", "20");
}

function updateDescr(svg, descr) {

  var id = "descr";

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

  cLog("### node config diff add ###", addItem);
  cLog("### node config diff del ###", delItem);
  cLog("### node config diff mod ###", modItem);

  return { "add":addItem, "del":delItem, "mod":modItem };
}

function addNode(svg, nodes, drag) {

  // add new node
  createNode(svg, nodes, drag);

}

function delNode(svg, nodes) {

  for (var id in nodes) {

    // del group
    var groupId = createNodeGroupId(id);
    d3.select("g#" + groupId).remove();

    // del circle
    d3.select("circle#" + id).remove();

    // del text 
    var textId = createNodeTextId(id);
    d3.select("text#" + textId).remove();

  }
}

function modNode(svg, nodes) {

  for (var id in nodes) {

    var node = nodes[id];
    var p = getPosition(id);
    var r = node.r;

    // mod circle
    var node = nodes[id];
    d3.select("circle#" + id)
      .style("stroke", node.color)
      .style("fill", node.color)
      .attr("r", node.r);

    // mod text 
    var textId = createNodeTextId(id);
    d3.select("text#" + textId)
      .attr("xlink:href", node.link)
      .style("color", linkdraw.fontColor)
      .style("font-size", linkdraw.fontSize)
      .style("font-weight", linkdraw.fontWeight)
      .style("font-family", linkdraw.fontFamily)
      .text(id);
  }
}

function updateNode(svg, item, drag) {
  addNode(svg, item.add, drag);
  delNode(svg, item.del);
  modNode(svg, item.mod);
}

function createSVG(id){

  var width  = linkdraw.width;
  var height = linkdraw.height;

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

function createSaveButton(svg, positionPath) {

  var x = 10;
  var y = 60;
  var width = 100;
  var height = 20;
  var leftSpace = 10;
  var id = createSaveButtonId();

  svg.append("rect")
    .attr("class", id)
    .attr("width", width + "px")
    .attr("height", height + "px")
    .attr("x", x + "px")
    .attr("y", y + "px")
    .on("click", positionUpload(positionPath))
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
    .on("click", positionUpload(positionPath))
    .text("Position Save");

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

function updateLineColorChart(svg, colors, lineColors) {

  // padding
  var padding_left = 10;

  // html class for remove and create 
  var class_rect = "color_chart_rect";
  var class_text = "color_chart_text";

  // color box height and width
  var color_chart_box_height = 20;
  var color_chart_box_width  = 100;

  // remove
  d3.selectAll("." + class_text).remove();
  d3.selectAll("." + class_rect).remove();

  // create
  if (colors) {
    for (var i in colors) {
      var y = color_chart_box_height * i + 80;
      var _y = y + 4; // for padding bottom
      svg.append("rect")
        .attr("class", class_rect)
        .attr("width", color_chart_box_width + "px")
        .attr("height", color_chart_box_height + "px")
        .attr("x", padding_left + "px")
        .attr("y", _y + "px")
        .attr("fill", colors[i].color);

      _y = y + color_chart_box_height;
      svg.append("text")
        .attr("class", class_text)
        .attr("x", color_chart_box_width / 2 + padding_left + "px")
        .attr("y", _y + "px")
        .attr("startOffset", "50%")
        .attr("text-anchor", "middle")
        .style("font-size", linkdraw.fontSize)
        .style("font-weight", linkdraw.fontWeight)
        .style("font-family", linkdraw.fontFamily)
        .style("fill", "#FFF")
        .text(colors[i].descr);
    }
    cLog("# color check", colors);
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

    // position
    var pathData = line.pathData;
    var points   = line.points;

    // color
    var lineColor = line.color;

    // width
    var lineWidth = line.width;

    var lineGroup = svg.append("g")
      .attr("id", lineGroupId)
      .attr("class", "lineGroup")
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

function createNode(svg, nodes, drag) {

  for (var id in nodes) {
    var node = nodes[id];
    var textId = createNodeTextId(id);
    var groupId = createNodeGroupId(id);
    var p = getPosition(id);
    var r = node.r;
    var nodeTextPosition = createNodeTextPosition(p.x, p.y);

    var nodeGroup = svg.append("g")
      .attr("id", groupId)
      .attr("class", "nodeGroup");

    nodeGroup.append("circle")
      .style("stroke", node.color)
      .style("fill", node.color)
      .style("fill-opacity", 0.6)
      .attr("id", id)
      .attr("cx", p.x)
      .attr("cy", p.y)
      .attr("r", r)
      .call(drag);

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
      .text(id);
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

function makePairs(lines, lineColors) {

  var pairs = {};

  for (var i=0;i<lines.length;i++) {

    var line = lines[i];
    var source = line.source;
    var target = line.target;

    var pair = sortPairDirection(pairs, source, target);
    source = pair.source;
    target = pair.target;

    // rest source and target
    line.source = source;
    line.target = target;

    // each span(node span) line count
    var n = getLineNumber(pairs, source, target);

    // append id
    var id          = i;
    var lineId      = createLineId(source, target, n);
    var pathId      = createLinePathId(source, target, n);
    var textPathId  = createLineTextPathId(source, target, n);
    var lineTextId  = createLineTextId(source, target, n);
    var lineGroupId = createLineGroupId(lineId);
    line.id          = id;
    line.lineId      = lineId;
    line.pathId      = pathId;
    line.textPathId  = textPathId;
    line.lineTextId  = lineTextId;
    line.lineGroupId = lineGroupId;

    // append color
    var lineColor = lineColorSelect(line.color, lineColors);
    line.color = lineColor;

    // add pair to pairs obj
    addPair(pairs, source, target, line);

  }
  cLog("# config lines #", lines);

  return pairs;
}

function initNodeConfig(nodes, pairs) {
  for (var source in pairs) {
    for (var target in pairs[source]) {
      nodes[source] = checkNode(source, nodes);
      nodes[target] = checkNode(target, nodes);
    }
  }
  return nodes;
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

function appendPosition() {

  var pairs = linkdraw.pairs;
  var nodes = linkdraw.nodes;

  for (var source in pairs) {
    for (var target in pairs[source]) {
      var lines = pairs[source][target];
      for (var i=0; i<lines.length;i++) {

        var line = lines[i];
        var r1 = nodes[source].r;
        var r2 = nodes[target].r;
        var p1 = getPosition(source);
        var p2 = getPosition(target);
        var lineNumber = i + 1;
        var lineNumberMax = lines.length;
        var pathData = createPathData(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);
        var points = createPoints(r1, r2, p1.x, p1.y, p2.x, p2.y, lineNumber, lineNumberMax);

        cLog("# ----------------- #", "");
        cLog("# lineNumber #", lineNumber);
        cLog("# lineNumberMax #", lineNumberMax);
        cLog("# path data #", pathData);
        cLog("# point data #", points);

        // store 
        line["pathData"] = pathData;
        line["points"]   = points;
        pairs[source][target][i] = line;

      }
    }
  }
}

function zoomEvent(svg) {
  svg.call(d3.behavior.zoom()
    .on("zoom", function redraw() {
      linkdraw.scale = d3.event.scale;
      linkdraw.translate = d3.event.translate;
      transformView();
    })
  );
}

function dragEvent() {
  return d3.behavior.drag()
    .on("drag", function() {

      var pairs = linkdraw.pairs;
      var nodes = linkdraw.nodes;
      var dx, dy; 
      var id = this.id;
      var zRate = zoomRate();

      if (zRate < 1) {
        dx = this.cx.baseVal.value + d3.event.dx * (zRate);
        dy = this.cy.baseVal.value + d3.event.dy * (zRate);
      } else {
        dx = this.cx.baseVal.value + d3.event.dx;
        dy = this.cy.baseVal.value + d3.event.dy;
      }
      d3.select(this)
        .attr('cx', dx)
        .attr('cy', dy);
      cLog("node position",  id);

      var textId = createNodeTextId(id);
      var nodeTextPosition = createNodeTextPosition(dx, dy);
      d3.select("text#" + textId)
        .attr('x', nodeTextPosition.x)
        .attr('y', nodeTextPosition.y);
      cLog("text position",  d3.select("text#" + textId));
      
      for (var source in pairs) {
        for (var target in pairs[source]) {

          // new position
          var p1 = getPosition(source);
          var p2 = getPosition(target);
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
            cLog("# polyline #", polyline);

            // path
            var path = d3.select("path#" + line["pathId"]);
            path.attr("d", pathData);
            cLog("# path #", path );

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
            cLog("# textpath #", textpath );

            // line text
            var lineText = d3.select("text#" + line["lineTextId"]);
            lineText
              .attr("x", "")// for Safari 5.1.7
              .attr("y", "")// for Safari 5.1.7
              .attr("startOffset", "50%") // for Safari 5.1.7
              .attr("text-anchor", "middle"); // for Safari 5.1.7
            cLog("# linetext #", lineText);
          }
       }
     }
  });


}

function drawItem(svg) {

  // fetch new config
  var configJson = getJson(linkdraw.configPath);

  // keep old config and get new config
  var _config = linkdraw.config;
  linkdraw.config = initConfigData(configJson);
  var config = linkdraw.config;

  // keep old config and get new config
  var _nodes = linkdraw.nodes;
  linkdraw.nodes = parseNodeConfig(config.nodes);
  var nodes = linkdraw.nodes;

  // keep old config and get new config
  var _lines = linkdraw.lines;
  linkdraw.lines = config.lines;
  var lines = linkdraw.lines;

  // for color chart
  var lineColorConf = config.lineColors;
  var lineColors = makeLineColors(lineColorConf);

  // update time
  updateTime(svg, config.time);

  // update descr
  updateDescr(svg, config.descr);

  // color chart
  updateLineColorChart(svg, lineColorConf, lineColors);

  // keep old pairs and make new pairs
  var _pairs = linkdraw.pairs;
  linkdraw.pairs = makePairs(lines, lineColors);
  var pairs = linkdraw.pairs;

  // init node
  nodes = initNodeConfig(nodes, pairs);

  // add position to each lines
  appendPosition();

  // check node config diff
  var nodeItems = getNodeConfigDiff(_nodes, nodes);
  cLog("node config diff", nodeItems);

  // check line config diff
  var lineItems = getLineConfigDiff(lines, _lines, pairs, _pairs);
  cLog("line config diff", lineItems);

  // drag event
  var drag = dragEvent();

  // write node 
  updateNode(svg, nodeItems, drag);

  // write line
  updateLine(svg, lineItems);

  // change zoom value
  transformView();

}

(function($) {
  $.fn.linkDraw = function(sys) {

    // debug
    linkdraw.debug = true;
    linkdraw.debug = false;

    //system settings
    linkdraw.configPath   = sys.config;
    linkdraw.positionPath = sys.position;
    linkdraw.positionSave = sys.positionSave;
    linkdraw.positionWriter = sys.positionWriter;
    linkdraw.width        = sys.width;
    linkdraw.height       = sys.height;
    linkdraw.interval     = sys.interval;

    // svg settings
    linkdraw.fontSize = "12px";
    linkdraw.fontFamily = 'Arial, "sans-serif", "Lucida Grande", "MS P Gothic"';
    linkdraw.fontWeight = "normal";
    linkdraw.fontColor = "#333";
    linkdraw.lineColor = "#666";
    linkdraw.nodeColor = "#666";
    linkdraw.nodeR = 4;
    linkdraw.config = {};
    linkdraw.nodes = {};
    linkdraw.lines = {};
    linkdraw.pairs = {};

    // get json data
    var configJson   = getJson(linkdraw.configPath);
    var positionJson = getJson(linkdraw.positionPath);

    // init position data
    linkdraw.position  = initPositionData(positionJson);
    linkdraw.scale     = initScaleData(positionJson);
    linkdraw.translate = initTranslateData(positionJson);

    // create svg
    var svg = createSVG(this.selector);

    // position save button
    if (linkdraw.positionSave == false) {
      // defult enable
    } else {
      createSaveButton(svg, linkdraw.positionPath);
    }

    // zoom
    zoomEvent(svg);

    // draw
    drawItem(svg);
    if (linkdraw.interval > 0) {
      setInterval(function() {
        drawItem(svg);
      }, 1000 * linkdraw.interval);
    }
  }

})(jQuery);

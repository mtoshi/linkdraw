/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed under the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

*/

var DEBUG = true;
var DEBUG = false;

var SVG = 'http://www.w3.org/2000/svg';
var XLINK = 'http://www.w3.org/1999/xlink';

var DEFAULT_SVG_WIDTH  = 4000;
var DEFAULT_SVG_HEIGHT = 4000;
var SVG_WIDTH;
var SVG_HEIGHT;
var DEFAULT_NODE_WIDTH  = 12;
var DEFAULT_NODE_HEIGHT = 12;
var DEFAULT_NODE_COLOR  = '#5F9EA0';
var DEFAULT_NODE_LINK   = '';
var DEFAULT_LINE_COLOR  = '#666';
var DEFAULT_TEXT_COLOR  = '#333';
var DEFAULT_FONT_SIZE   = 12;

var svg;
var root;
var nodes = {};
var lines = {};
var texts = {};
var pairs = {};
var positions = {};
var lineCount = 0;

//
// for event
//
var dx, dy;
var clickElement;
var shapes = {
  'node' : {}, 'line' : {} , 
  'text' : {}, 'path' : {} ,
  'textpath' : {}, 'linetext' : {} 
};

//
// configData
//
var viewSize;
var nodeItem;
var lineItem;
var lineColorItem;

//
// console log for debug
//
(function () {
  if (typeof window.console === "undefined") {
    window.console = {}
  }
  if (typeof window.console.log !== "function") {
    window.console.log = function () {}
  }
})();

function mousemove_listener(evt) {
  var t = 300;
  var ex = evt.clientX + dx;
  var ey = evt.clientY + dy;

  // for node
  var id = clickElement.ownerSVGElement.suspendRedraw(t);
  var cid = clickElement.id;
  clickElement.cx.baseVal.value = ex;
  clickElement.cy.baseVal.value = ey;
  clickElement.ownerSVGElement.unsuspendRedraw(id);

  var rx = parseInt(clickElement.getAttribute("rx"));
  var ry = parseInt(clickElement.getAttribute("ry"));

  var cid = clickElement.id;
  var tid = createTextId(cid);

  // for node name text
  if (shapes['text'][tid]){
    var text = shapes['text'][tid];
    var id = text.ownerSVGElement.suspendRedraw(t);
    var tp = textPositionAdujst(rx, ry, ex, ey);
    text.setAttribute("x", tp.x);
    text.setAttribute("y", tp.y);
    text.ownerSVGElement.unsuspendRedraw(id);
  }

  if (nodes[cid]['line']) {
    for (i=0; i<nodes[cid]['line'].length; i++) {

      var lineId = nodes[cid]['line'][i];
      var pathId = createPathId(lineId);
      var textPathId = createTextPathId(lineId);
      var lineTextId = createLineTextId(lineId);

      var nodeAId = lines[lineId]['a'];
      var nodeBId = lines[lineId]['b'];
      var nodeA = shapes['node'][nodeAId];
      var nodeB = shapes['node'][nodeBId];

      var x1 = parseInt(nodeA.getAttribute("cx"));
      var y1 = parseInt(nodeA.getAttribute("cy"));
      var x2 = parseInt(nodeB.getAttribute("cx"));
      var y2 = parseInt(nodeB.getAttribute("cy"));

      var line = shapes['line'][lineId];
      var path = shapes['path'][pathId];
      var textPath = shapes['textpath'][textPathId];
      var lineText = shapes['linetext'][lineTextId];

      var num = lines[lineId]['number'];
      var pairId = createPairId(nodeAId, nodeBId);
      var maxNum = pairs[pairId].length;

      var id = line.ownerSVGElement.suspendRedraw(t);
      var points = createPoints(x1, y1, x2, y2, num, maxNum);
      line.setAttribute('points', points);
      line.ownerSVGElement.unsuspendRedraw(id);

      id = path.ownerSVGElement.suspendRedraw(t);
      var pathData = createPathData(x1, y1, x2, y2, num, maxNum);
      path.setAttribute('d', pathData);
      path.ownerSVGElement.unsuspendRedraw(id);

      id = textPath.ownerSVGElement.suspendRedraw(t);
      textPath.setAttribute("startOffset", '50%');
      textPath.setAttribute('text-anchor', 'middle');
      textPath.ownerSVGElement.unsuspendRedraw(id);
      
      id = lineText.ownerSVGElement.suspendRedraw(t);
      lineText.ownerSVGElement.unsuspendRedraw(id);
    }
  }

}

function mouseup_listener(evt) {
  document.removeEventListener("mousemove", mousemove_listener, true);
  document.removeEventListener("mouseup", mouseup_listener, true);
}

function mousedown_listener(evt) {
  clickElement = this;
  dx = clickElement.cx.baseVal.value - evt.clientX;
  dy = clickElement.cy.baseVal.value - evt.clientY;
  document.addEventListener("mousemove", mousemove_listener, true);
  document.addEventListener("mouseup", mouseup_listener, true);
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

function storeShape(key, id, obj){
  if (shapes[key]) {
    shapes[key][id] = obj;
  } else {
    if (DEBUG) { console.log("[error] Could not store") };
  }
}

function appendShape(key){
  if (shapes[key]){
    for (var i in shapes[key]){
      svg.appendChild(shapes[key][i]);
    }
  } else {
    if (DEBUG) { console.log("[error] Could not append") };
  }
}

function textPositionAdujst(width, height, x, y) {
  var tx = x + 10;
  var ty = y - height/2 - 10;
  return { 'x':tx, 'y':ty };
}
function createUpdate(update){
  var ele = document.createElementNS(SVG, 'text');
  ele.textContent = 'UPDATE ' + update;
  ele.setAttribute('id', 'updateTime');
  ele.setAttribute("fill", DEFAULT_TEXT_COLOR);
  ele.setAttribute("font-size", DEFAULT_FONT_SIZE);

  var x = svg.createSVGLength();
  var y = svg.createSVGLength();
  x.value = 10;
  y.value = 20;
  ele.x.baseVal.appendItem(x);
  ele.y.baseVal.appendItem(y);
  svg.appendChild(ele);
}

function createTextInfo(x, y, descr, fontSize, fontColor){
  return { 
    "descr" : descr,
    "x" : x, "y" : y,
    "fontSize" : fontSize, "fontColor" : fontColor,
  };
}

function createLineColorChartInfo(id, x, y, width, height, color){
  return { 
    "id" : id,
    "x" : x, "y" : y,
    "width" : width, "height" : height,
    "color" : color,
  };
}

function getHashSize(obj){
  var x = 0;
  for (var i in obj) {
    x++;
  }
  return x;
}

function createLineColorChart(colors){

  var px = 10;
  var py = 50;

  var text = createTextInfo(px, py, "Line Colors", DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR);
  var ele = createText(text);
  svg.appendChild(ele);

  var len = getHashSize(colors);
  var i = 0;
  for (var key in colors) {
    var descr = colors[key]["descr"];
    var color = colors[key]["code"];
    var id = "COLOR" + color;
    var x = px;
    var y = py + 20 * (len - i);
    var width = 10;
    var height = 20;

    var rect = createLineColorChartInfo(id, x, y, width, height, color);
    var ele = createRect(rect);
    svg.appendChild(ele);

    var text = createTextInfo(x + 12, y + 15, descr, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR);
    var ele = createText(text);
    svg.appendChild(ele);
    i++;
  }
}

function createRect(obj){
  var id = obj['id'];
  var x = obj['x'];
  var y = obj['y'];
  var width  = obj['width'];
  var height = obj['height'];
  var color  = obj['color'];
  var ele = document.createElementNS(SVG, 'rect');
  ele.setAttribute('x', x);
  ele.setAttribute('y', y);
  ele.setAttribute('width', width);
  ele.setAttribute('height', height);
  ele.setAttribute("fill", color);
  return ele;
}
function createText(obj){
  var ele = document.createElementNS(SVG, 'text');
  var descr  = obj['descr'];
  var x  = obj['x'];
  var y  = obj['y'];
  var fontSize = obj['fontSize'];
  var fontColor = obj['fontColor'];
  ele.textContent = descr;
  ele.setAttribute("fill", fontColor);
  ele.setAttribute("font-size", fontSize);

  var sx = svg.createSVGLength();
  var sy = svg.createSVGLength();
  sx.value = x;
  sy.value = y;

  ele.x.baseVal.appendItem(sx);
  ele.y.baseVal.appendItem(sy);
  return ele;
}

function createNode(obj){
  var x = obj['x'];
  var y = obj['y'];
  var id = obj['id'];
  var width  = obj['width']/2;
  var height = obj['height']/2;
  var color  = obj['color'];

  // node ellipse
  var ele = document.createElementNS(SVG, 'ellipse');
  ele.setAttribute('id', id);
  ele.setAttribute('cx', x);
  ele.setAttribute('cy', y);
  ele.setAttribute('rx', width);
  ele.setAttribute('ry', height);
  ele.setAttribute("fill", color);
  ele.addEventListener("mousedown", mousedown_listener, false);
  svg.appendChild(ele);
  storeShape('node', id, ele);

  // group
  var g = document.createElementNS(SVG,'g');

  // node text
  var text = document.createElementNS(SVG, 'text');
  var id = obj['id'];
  var x  = obj['x'];
  var y  = obj['y'];
  var width  = obj['width'];
  var height = obj['height'];
  var tp = textPositionAdujst(width, height, x, y);
  var tid = createTextId(id);
  text.textContent = id;
  text.setAttribute('id', tid);
  text.setAttribute("fill", DEFAULT_TEXT_COLOR);
  text.setAttribute("font-size", DEFAULT_FONT_SIZE);

  var x = svg.createSVGLength();
  var y = svg.createSVGLength();
  x.value = tp.x;
  y.value = tp.y;

  text.x.baseVal.appendItem(x);
  text.y.baseVal.appendItem(y);

  storeShape('text', tid, text);

  var url = obj['link'];
  var a = addAnchor(text, url);

  g.appendChild(a);
  svg.appendChild(g);
}

function createTranslate(x, y){
  return 'translate(' + x + ', ' + y + ')';
}

function createPathData(x1, y1, x2, y2, num, maxNum){
  var pData = createPoints(x1, y1, x2, y2, num, maxNum);
  return  "M " + pData;
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
  return { 'x':x, 'y':y }
}
function createPoints(x1, y1, x2, y2, num, maxNum){

  if (maxNum == 1){
    return  x1 + "," + y1 +  " " + x2 + "," + y2;
  } else {
    var m = createMidlePoint(x1, y1, x2, y2, num, maxNum);
    return  x1 + "," + y1 + " " + m.x + "," + m.y + " " + x2 + "," + y2;
  }
}

function addAnchor(obj, link){
  var ele = document.createElementNS(SVG, "a");
  ele.setAttributeNS(XLINK, "href", link);
  ele.appendChild(obj);
  return ele;
}

function getAngleDeg(x1,y1,x2,y2){
  var r = getAngle(x1,y1,x2,y2);
  return r/(Math.PI/360);
}
function getAngle(x1,y1,x2,y2){
  x = x2-x1;
  y = y2-y1;
  return Math.atan2(y, x);
}
function getAngleAbs(x1,y1,x2,y2){
  x = Math.abs(x2-x1);
  y = Math.abs(y2-y1);
  return Math.atan2(y, x);
}

function getPoint(len, rad){
  var x = len*Math.cos(rad);
  var y = len*Math.sin(rad);
  return { 'x':x, 'y':y };
}

function createLine(obj){

  var lineId = obj['id'];
  var nodeA  = obj['a'];
  var nodeB  = obj['b'];
  var width  = obj['width'];
  var color  = obj['color'];
  var descr  = obj['descr'];
  var url    = obj['link'];
  var num    = obj['number'];
  var x1     = nodes[nodeA]['x'];
  var y1     = nodes[nodeA]['y'];
  var x2     = nodes[nodeB]['x'];
  var y2     = nodes[nodeB]['y'];

  var pathId = createPathId(lineId);
  var textPathId = createTextPathId(lineId);
  var lineTextId = createLineTextId(lineId);
  var pairId = createPairId(nodeA, nodeB);
  var maxNum = pairs[pairId].length;

  var g = document.createElementNS(SVG,'g');
  g.setAttribute('fill', '#000');
  g.setAttribute('font-size', DEFAULT_FONT_SIZE);
  g.setAttribute("font-family", 'monospace');

  /* 

  path

  */
  var path = document.createElementNS(SVG,'path');
  var pData = createPathData(x1, y1, x2, y2, num, maxNum);
  path.setAttribute('id', pathId);
  path.setAttribute('d', pData);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', width);
  path.setAttribute("opacity", 1);
  g.appendChild(path);
  storeShape('path', pathId, path);

  /* 

  text

  */
  var text = document.createElementNS(SVG,'text');
  storeShape('linetext', lineTextId, text);

  /* 

  textPath

  */
  var textPath = document.createElementNS(SVG,'textPath');
  textPath.setAttributeNS(XLINK, 'href', '#' + pathId);
  textPath.textContent = descr;
  textPath.setAttribute("startOffset", '50%');
  textPath.setAttribute('text-anchor', 'middle');
  text.appendChild(textPath);
  g.appendChild(addAnchor(text, url));
  storeShape('textpath', textPathId, textPath);

  var line = document.createElementNS(SVG, 'polyline');
  var points = createPoints(x1, y1, x2, y2, num, maxNum);
  line.setAttribute('points', points);
  line.setAttribute('id', lineId);
  line.setAttribute('fill', 'none');
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", width);
  g.appendChild(line);

  storeShape('line', lineId, line);
  svg.appendChild(g);

}

function createNodes(){
  if (DEBUG) { console.log("create node") };
  for (var i in nodes) {
    createNode(nodes[i]);
  }
}
function createLines(){
  if (DEBUG) { console.log("create line") };
  for (var i in lines) {
    createLine(lines[i]);
  }
}

function createLineId(){
  lineCount++;
  return 'LINE' + lineCount;
}
function createTextId(nodeName){
  return 'TEXT' + '_' + nodeName;
}
function createLineTextId(lineId){
  return lineId + '_' + 'LINETEXT';
}
function createPathId(lineId){
  return lineId + '_' + 'PATH';
}
function createTextPathId(lineId){
  return lineId + '_' + 'TEXTPATH';
}
function createPairId(nameA, nameB){
  return nameA + nameB;
}

function checkPair(nameA, nameB){
  // case of already "A - B"
  var pairId = createPairId(nameA, nameB);
  if (pairs[pairId]) {
    return { 'a': nameA, 'b' : nameB }
  }

  // case of already "B - A"
  pairId = createPairId(nameB, nameA);
  if (pairs[pairId]) {
    return { 'a': nameB, 'b' : nameA }
  }

  // case of none 
  return { 'a': nameA, 'b' : nameB }
  
}

function addPair(nameA, nameB, lineId){
  // A-B
  var pairId = createPairId(nameA, nameB);
  if (pairs[pairId]) {
    pairs[pairId].push(lineId);
  } else {
    pairs[pairId] = [ lineId ];
  }
  return pairs[pairId].length;
}

/*
 
  view size
 
*/
function addViewSize(obj){
  if (obj){
    SVG_WIDTH  = obj['width'];
    SVG_HEIGHT = obj['height'];
  } else {
    SVG_WIDTH  = DEFAULT_SVG_WIDTH;
    SVG_HEIGHT = DEFAULT_SVG_HEIGHT;
  }


  // for svg size
  root.setAttribute('width', SVG_WIDTH);
  root.setAttribute('height', SVG_HEIGHT);
  svg.setAttribute('width', SVG_WIDTH);
  svg.setAttribute('height', SVG_HEIGHT);

  // for css
  root.style.width  = SVG_WIDTH + 'px';
  root.style.height = SVG_HEIGHT + 'px';
}

/*
 
  content update time
 
*/
function addUpdate(update){
  if (update){
    createUpdate(update);
  }
}

/*
 
  content color chart

 */
function addColorChart(colors){
  if (colors){
    createLineColorChart(colors);
  }
}

/*
 

  Add line info to lines hash.
  Line id is sequential.

*/
function addLineInfo(id, nNameA, nNameB, color, width, descr, link, lineNum){
  lines[id] = { 'id' : id, 'a' : nNameA, 'b': nNameB, 'color' : color, 'width' : width, 'descr': descr, 'link' : link, 'number' : lineNum };
}


/*

  Add specified node to nodes hash.
  Node id is 'hostname'.
  Also each node has line id list for drag event.

*/
function addNode(nName, width, height, color, link){
  var x;
  var y;
  if (positions) {
    if (positions[nName]) {
      if (positions[nName]['x'] && positions[nName]['y']) {
        x = positions[nName]['x'];
        y = positions[nName]['y'];
      }
    }
  }
  if ( !x || !y ) {
    x = randNum(SVG_WIDTH);
    y = randNum(SVG_HEIGHT);
  }
  nodes[nName] = { 'id' : nName, 'x' : x, 'y' : y, 'width' : width, 'height' : height, 'color' : color, 'link' : link, 'line' : [] };
}

/*

  Add line and store line info to node.
  Also, add default node to nodes hash. 
  (Default node is not specified node.)
  We can get line information from drag element for redraw element and element's lines.

*/
function addLine(nNameA, nNameB, color, width, descr, link){

  /*

  This line system configuration has 2 pattern.

  A - B or B -A

  At the first, make a choice 1 pattern.

  */

  var cp = checkPair(nNameA, nNameB);
  nNameA = cp['a'];
  nNameB = cp['b'];

  /*

  Store  each line information. 

  */

  var lineId = createLineId();
  var pairId = createPairId(nNameA, nNameB);
  var lineNum = addPair(nNameA, nNameB, lineId);


  addLineInfo(lineId, nNameA, nNameB, color, width, descr, link, lineNum);

  /*

  for Node A
  Make default node and store line id.

  */
  if ( !nodes[nNameA] ){
    addNode(nNameA, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, DEFAULT_NODE_COLOR, DEFAULT_NODE_LINK);
  }
  nodes[nNameA]['line'].push(lineId);

  /*

  for Node B
  Make default node and store line id.

  */
  if ( !nodes[nNameB] ){
    addNode(nNameB, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, DEFAULT_NODE_COLOR, DEFAULT_NODE_LINK);
  }
  nodes[nNameB]['line'].push(lineId);
}

function createPositionData(filename){
  var positions = {};
  for (var i in shapes['node']) {
    var node = shapes['node'][i];
    var id = node.getAttribute('id');
    var x  = node.getAttribute('cx');
    var y  = node.getAttribute('cy');
    positions[id] = { "x": parseInt(x), "y": parseInt(y) };
  }
  return { "file": filename , "data": { "position": positions } }
}

function getColor(colors, x){
  if (x.match(/#[0-9a-f]+/i)){
    return x;
  } else {
    if (colors){
      var color = colors[x];
      if (color){
        return color["code"];
      }
    }
    return DEFAULT_LINE_COLOR;
  }
}

function parseConfig(){
  var update = updateTime;
  var colors = lineColorItem;
  var size = viewSize;
  var nodeConfig = nodeItem;
  var lineConfig = lineItem;

  addViewSize(size);
  addUpdate(update);
  addColorChart(colors);

  if (nodeConfig) {
    for (i=0; i<nodeConfig.length; i++) {
      var nName   = nodeConfig[i][0];
      var nWidth  = nodeConfig[i][1];
      var nHeight = nodeConfig[i][2];
      var nColor  = nodeConfig[i][3];
      var nLink   = nodeConfig[i][4];
      addNode(nName, nWidth, nHeight, nColor, nLink);
    }
  }

  if (lineConfig) {
    for (i=0; i<lineConfig.length; i++) {
      var nNameA   = lineConfig[i][0];
      var nNameB   = lineConfig[i][1];
      var lColor   = lineConfig[i][2];
      var lWidth   = lineConfig[i][3];
      var lDescr   = lineConfig[i][4];
      var lLink    = lineConfig[i][5];
      var color = getColor(colors, lColor);
      addLine(nNameA, nNameB, color, lWidth, lDescr, lLink);
    }
  }

}

function svgmap(positionData){

  // linkdraw div is root
  root = document.getElementById('linkdraw');

  // make svg
  svg = document.createElementNS(SVG,'svg');

  // read node position data
  positions = positionData['position'];

  // node and line configuration
  configData();
  parseConfig();

  // create element 
  createLines();
  createNodes();

  // for debug
  if (DEBUG) {
    for (var i in nodes)  { console.log(nodes[i]['id']); }
    for (var i in lines)  { console.log(lines[i]['id']); }
    for (var i in pairs)  { console.log(pairs[i].length); }
    for (var i in shapes) { 
      for (var n in shapes[i]) { 
        console.log(shapes[i][n]['id']); 
      }
    }
  }
  root.appendChild(svg);
}

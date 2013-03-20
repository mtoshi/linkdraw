/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed under the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

*/


/*

  load

*/

function loadDataFile(file) {
  url = file + "?" + parseInt((new Date)/1000);
  httpObj = createXMLHttpRequest(displayData);
  if (httpObj) {
    httpObj.open("GET", url, true);
    httpObj.setRequestHeader('Pragma', 'no-cache, no-store');
    httpObj.setRequestHeader('Cache-Control', 'max-age=-1, must-revalidate, no-store, no-cache');
    httpObj.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    httpObj.setRequestHeader('Expires', '-1');
    httpObj.send(null);
  }
}

/*

  status check and return svgmap

*/

function displayData() {
  if ((httpObj.readyState == 4) && (httpObj.status == 200)) {
    var json = httpObj.responseText;
    var positionData = {}
    if (json) {
      positionData = JSON.parse(json);
    }
    svgmap(positionData);
  }
}

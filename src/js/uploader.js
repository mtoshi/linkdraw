/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed under the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

*/

function sendData(filename)
{
  var data = createPositionData(filename);
  httpObj = createXMLHttpRequest();
  url = "write.cgi";
  if (httpObj) {
    httpObj.open("POST", url, true);
    httpObj.setRequestHeader("content-type", "application/json;charset=UTF-8");
    console.log(data);
    httpObj.send(JSON.stringify(data));
    alert("Position saved.");
  }
}

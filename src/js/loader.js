/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

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

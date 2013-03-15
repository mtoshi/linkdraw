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

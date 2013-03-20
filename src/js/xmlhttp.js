/*

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed under the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

*/

function createXMLHttpRequest(cbFunc)
{
	var XMLhttpObject = null;
  try{
    XMLhttpObject = new XMLHttpRequest();
	}catch(e){
    try{
      XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){
      try{
        XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP");
      }catch(e){
        return null;
      }
    }
  }

  if (XMLhttpObject) XMLhttpObject.onreadystatechange = cbFunc;
  return XMLhttpObject;
}

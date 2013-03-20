#!/usr/bin/python
# -*- coding: utf-8 -*-

"""

Copyright (C) 2013 Toshikatsu Murakoshi <mtoshi.g@gmail.com>

Licensed under the MIT (https://github.com/mtoshi/linkdraw/blob/master/LICENSE.md) license.

"""

import sys
import os
import json

if __name__ == "__main__":

  print "Content-Type: application/json"
  print "\r\n\r\n"

  items = json.load(sys.stdin)
  print items

  if 'data' in items and 'file' in items:

    data = items["data"]
    str = json.dumps(data)

    file = items["file"]
    path = "%s" % file

    f = open(path, 'w')
    f.write(str)
    f.close()


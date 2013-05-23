#!/usr/bin/python
# -*- coding: utf-8 -*-

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

#!/usr/bin/python
# -*- coding: utf-8 -*-

"""

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


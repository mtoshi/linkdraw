# -*- coding: utf-8 -*-

import sys
import re
import os
import datetime
from time import sleep
import json

def write_file(path, str):
     f = open(path, "w")
     f.write(str) 
     f.close
     os.chmod(path, 0666)

def template(time, descr, colors, nodes, lines):
    return """{
    "time": "%s",

    "descr": "%s",

    "lineColors": [
%s
    ],

    "nodes": [
%s
    ],

    "lines": [
%s
    ]
}
	""" % (
        time, 
        descr, 
        ",\n".join(colors), 
        ",\n".join(nodes), 
        ",\n".join(lines)
        )

def time():
    return datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")

def color(id, descr, ccode):
    indent = '        '
    return '%s{ "id": "%s", "descr": "%s", "color": "%s" }' % (
            indent, id, descr, ccode)

def node(name, r, color, link):
    indent = '        '
    return '%s{ "name": "%s", "r": "%s", "color": "%s", "link": "%s" }' % (
            indent, name, r, color, link)

def line(source, target, color, width, descr, link):
    indent = '        '
    return ('%s{ "source": "%s", "target": "%s",'
            '"color": "%s", "width": "%s", "descr": "%s", "link": "%s" }') % (
            indent, source, target, color, width, descr, link)

def colors():
    return [

        color("LV5", "100-80%", "#A52A2A"),
        color("LV4", "80-60%", "#FF8C00"),
        color("LV3", "60-40%", "#548B54"),
        color("LV2", "40-20%", "#00688B"),
        color("LV1", "20-0%", "#4F94CD"),
        color("LV0", "DOWN", "#AAAAAA"),

    ]


def nodes():
    return [

        node("TRANSIT-A", "6", "#CD5C5C", ""),
        node("TRANSIT-B", "6", "#CD5C5C", ""),
        node("TRANSIT-C", "6", "#CD5C5C", ""),

        node("PEER-A", "6", "#2E8B57", ""),
        node("PEER-B", "6", "#2E8B57", ""),
        node("PEER-C", "6", "#2E8B57", ""),
        node("PEER-D", "6", "#2E8B57", ""),

        node("RouterA", "6", "#00688B", ""),
        node("RouterB", "6", "#00688B", ""),
        node("RouterC", "6", "#00688B", ""),
        node("RouterD", "6", "#00688B", ""),

        node("SW-A", "6", "#4F94CD", ""),
        node("SW-B", "6", "#4F94CD", ""),

        node("WEB-A", "6", "#104E8B", ""),
        node("WEB-B", "6", "#104E8B", ""),

        node("MAIL-A", "6", "#104E8B", ""),
        node("MAIL-B", "6", "#104E8B", ""),

        node("DNS-A", "6", "#104E8B", ""),
        node("DNS-B", "6", "#104E8B", ""),

        node("CACHE-A", "6", "#FF8C00", ""),
        node("CACHE-B", "6", "#FF8C00", ""),
        node("CACHE-C", "6", "#FF8C00", ""),
        node("CACHE-D", "6", "#FF8C00", ""),
        node("CACHE-E", "6", "#FF8C00", ""),
        node("CACHE-F", "6", "#FF8C00", ""),

    ]

def lines():
    return [

        line("TRANSIT-A", "RouterA", "LV1", "1", "10G", ""),
        line("TRANSIT-B", "RouterA", "LV1", "1", "10G", ""),
        line("TRANSIT-C", "RouterB", "LV1", "1", "10G", ""),

        line("PEER-A", "RouterA", "LV1", "1", "1G", ""),
        line("PEER-B", "RouterA", "LV1", "1", "1G", ""),
        line("PEER-C", "RouterB", "LV1", "1", "1G", ""),
        line("PEER-C", "RouterA", "LV1", "1", "1G", ""),
        line("PEER-D", "RouterB", "LV1", "1", "1G", ""),

        line("RouterA", "RouterB", "LV1", "2.5", "10G", ""),
        line("RouterA", "RouterC", "LV1", "2.5", "10G", ""),
        line("RouterB", "RouterD", "LV1", "2.5", "10G", ""),
        line("RouterC", "RouterD", "LV1", "2.5", "10G", ""),

        line("RouterE", "RouterC", "LV1", "1", "1G", ""),
        line("RouterE", "RouterD", "LV1", "1", "1G", ""),
        line("RouterF", "RouterC", "LV1", "1", "1G", ""),
        line("RouterF", "RouterD", "LV1", "1", "1G", ""),

        line("SW-A", "RouterE", "LV1", "1", "1G", ""),
        line("SW-A", "RouterF", "LV1", "1", "1G", ""),
        line("SW-B", "RouterE", "LV1", "1", "1G", ""),
        line("SW-B", "RouterF", "LV1", "1", "1G", ""),

        line("WEB-A", "SW-A", "LV1", "1", "1G", ""),
        line("WEB-B", "SW-B", "LV1", "1", "1G", ""),

        line("MAIL-A", "SW-A", "LV1", "1", "1G", ""),
        line("MAIL-B", "SW-B", "LV1", "1", "1G", ""),

        line("DNS-A", "SW-A", "LV1", "1", "1G", ""),
        line("DNS-B", "SW-B", "LV1", "1", "1G", ""),

        line("RouterX", "RouterC", "LV1", "1.5", "2G", ""),
        line("RouterX", "RouterD", "LV1", "1.5", "2G", ""),
        line("RouterY", "RouterC", "LV1", "1.5", "2G", ""),
        line("RouterY", "RouterD", "LV1", "1.5", "2G", ""),

        line("CACHE-A", "RouterX", "LV1", "1", "1G", ""),
        line("CACHE-B", "RouterX", "LV1", "1", "1G", ""),
        line("CACHE-C", "RouterX", "LV1", "1", "1G", ""),
        line("CACHE-D", "RouterY", "LV1", "1", "1G", ""),
        line("CACHE-E", "RouterY", "LV1", "1", "1G", ""),
        line("CACHE-F", "RouterY", "LV1", "1", "1G", ""),

    ]

def change_line(lines, regex, val, new_val):
    _lines = []
    for line in lines:
        if re.search(regex, line):
            _line = line.replace(val, new_val)
            _lines.append(_line)
        else:
            _lines.append(line)
    return _lines 

def update(path, config, t):
    write_file(path, config)
    sleep(n)


if __name__ == "__main__":

    path = sys.argv[1]
  
    n = 10 # iterate 
    t = 12 # interval

    lines  = lines()
    nodes  = nodes()
    colors = colors()

    for i in range(n):

        # start
        descr = "START DEMO"
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "traffic change"
        lines = change_line(lines, "CACHE-E", "LV1", "LV2")
        lines = change_line(lines, "CACHE-F", "LV1", "LV2")
        lines = change_line(lines, "RouterY.*RouterC", "LV1", "LV2")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "traffic change"
        lines = change_line(lines, "CACHE-E", "LV2", "LV3")
        lines = change_line(lines, "CACHE-F", "LV2", "LV3")
        lines = change_line(lines, "RouterY.*RouterC", "LV2", "LV3")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "traffic change"
        lines = change_line(lines, "CACHE-E", "LV3", "LV4")
        lines = change_line(lines, "CACHE-F", "LV3", "LV4")
        lines = change_line(lines, "RouterY.*RouterC", "LV3", "LV4")
        lines = change_line(lines, "RouterA.*RouterC", "LV1", "LV2")
        lines = change_line(lines, "PEER-A.*RouterA", "LV1", "LV2")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "traffic change"
        lines = change_line(lines, "CACHE-A", "LV1", "LV3")
        lines = change_line(lines, "CACHE-B", "LV1", "LV3")
        lines = change_line(lines, "CACHE-E", "LV4", "LV5")
        lines = change_line(lines, "CACHE-F", "LV4", "LV5")
        lines = change_line(lines, "RouterY.*RouterC", "LV4", "LV5")
        lines = change_line(lines, "RouterA.*RouterC", "LV2", "LV3")
        lines = change_line(lines, "PEER-A.*RouterA", "LV2", "LV3")
        lines = change_line(lines, "PEER-C.*RouterA", "LV1", "LV2")
        lines = change_line(lines, "TRANSIT-A.*RouterA", "LV1", "LV2")
        lines = change_line(lines, "TRANSIT-B.*RouterA", "LV1", "LV2")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "traffic change"
        lines = change_line(lines, "CACHE-A", "LV3", "LV5")
        lines = change_line(lines, "CACHE-B", "LV3", "LV5")
        lines = change_line(lines, "CACHE-C", "LV1", "LV4")
        lines = change_line(lines, "RouterX.*RouterC", "LV1", "LV5")
        lines = change_line(lines, "PEER-A.*RouterA", "LV3", "LV4")
        lines = change_line(lines, "PEER-B.*RouterA", "LV1", "LV3")
        lines = change_line(lines, "PEER-C.*RouterA", "LV2", "LV3")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        descr = "Line RouterC-Y Down !!!"
        lines = change_line(lines, "RouterY.*RouterC", "LV5", "LV0")
        lines = change_line(lines, "RouterY.*RouterC", "2G", "Down")
        lines = change_line(lines, "RouterY.*RouterD", "LV1", "LV5")
        lines = change_line(lines, "RouterC.*RouterD", "LV1", "LV2")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)

        # end
        descr = "END"
        lines = change_line(lines, "LV.*", "LV5", "LV1")
        lines = change_line(lines, "LV.*", "LV4", "LV1")
        lines = change_line(lines, "LV.*", "LV3", "LV1")
        lines = change_line(lines, "LV.*", "LV2", "LV1")
        lines = change_line(lines, "LV.*", "LV0", "LV1")
        lines = change_line(lines, "Down.*", "Down", "2G")
        config = template(time(), descr, colors,  nodes, lines)
        update(path, config, t)


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

def template(time, descr, node_colors, line_colors, nodes, lines):
    return """{
    "time": "%s",

    "descr": "%s",

    "nodeColors": [
%s
    ],

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
        ",\n".join(node_colors), 
        ",\n".join(line_colors), 
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

def sample_node_colors():
    return [

        color("TRANSIT", "Transit", "#A52A2A"),
        color("PEER",    "Peer",    "#2E8B57"),
        color("ROUTER",  "Router",  "#00688B"),
        color("SWITCH",  "Switch",  "#4F94CD"),
        color("SERVER",  "Server",  "#104E8B"),
        color("CACHE",   "Cache",   "#FF8C00"),

    ]

def sample_line_colors():
    return [

        color("LV5", "100-80%", "#A52A2A"),
        color("LV4", "80-60%", "#FF8C00"),
        color("LV3", "60-40%", "#548B54"),
        color("LV2", "40-20%", "#00688B"),
        color("LV1", "20-0%", "#4F94CD"),
        color("LV0", "DOWN", "#AAAAAA"),

    ]


def sample_nodes():
    return [

        node("TRANSIT-A", "6", "TRANSIT", ""),
        node("TRANSIT-B", "6", "TRANSIT", ""),
        node("TRANSIT-C", "6", "TRANSIT", ""),

        node("PEER-A", "6", "PEER", ""),
        node("PEER-B", "6", "PEER", ""),
        node("PEER-C", "6", "PEER", ""),
        node("PEER-D", "6", "PEER", ""),

        node("RouterA", "6", "ROUTER", ""),
        node("RouterB", "6", "ROUTER", ""),
        node("RouterC", "6", "ROUTER", ""),
        node("RouterD", "6", "ROUTER", ""),

        node("RouterE", "6", "ROUTER", ""),
        node("RouterF", "6", "ROUTER", ""),

        node("SW-X", "6", "SWITCH", ""),
        node("SW-Y", "6", "SWITCH", ""),

        node("SW-A", "6", "SWITCH", ""),
        node("SW-B", "6", "SWITCH", ""),

        node("WEB-A", "6", "SERVER", ""),
        node("WEB-B", "6", "SERVER", ""),

        node("MAIL-A", "6", "SERVER", ""),
        node("MAIL-B", "6", "SERVER", ""),

        node("DNS-A", "6", "SERVER", ""),
        node("DNS-B", "6", "SERVER", ""),

        node("CACHE-A", "6", "CACHE", ""),
        node("CACHE-B", "6", "CACHE", ""),
        node("CACHE-C", "6", "CACHE", ""),
        node("CACHE-D", "6", "CACHE", ""),
        node("CACHE-E", "6", "CACHE", ""),
        node("CACHE-F", "6", "CACHE", ""),

    ]

def sample_lines():
    return [

        line("TRANSIT-A", "RouterA", "LV1", "2.5", "10G", ""),
        line("TRANSIT-B", "RouterA", "LV1", "2.5", "10G", ""),
        line("TRANSIT-C", "RouterB", "LV1", "2.5", "10G", ""),

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

        line("SW-X", "RouterC", "LV1", "1.5", "2G", ""),
        line("SW-X", "RouterD", "LV1", "1.5", "2G", ""),
        line("SW-Y", "RouterC", "LV1", "1.5", "2G", ""),
        line("SW-Y", "RouterD", "LV1", "1.5", "2G", ""),

        line("CACHE-A", "SW-X", "LV1", "1", "1G", ""),
        line("CACHE-B", "SW-X", "LV1", "1", "1G", ""),
        line("CACHE-C", "SW-X", "LV1", "1", "1G", ""),
        line("CACHE-D", "SW-Y", "LV1", "1", "1G", ""),
        line("CACHE-E", "SW-Y", "LV1", "1", "1G", ""),
        line("CACHE-F", "SW-Y", "LV1", "1", "1G", ""),

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

def del_line(lines, regex):
    _lines = []
    for line in lines:
        if not re.search(regex, line):
            _lines.append(line)
    return _lines 

def add_line(lines, source, target, color, width, descr, link):
    _line = line(source, target, color, width, descr, link)
    lines.append(_line)
    return lines

def add_node(nodes, name, r, color, link):
    _node = node(name, r, color, link)
    nodes.append(_node)
    return nodes

def update(path, config, t):
    write_file(path, config)
    sleep(t)


if __name__ == "__main__":

    path = sys.argv[1]
  
    n = 10 # iterate 
    t = 9 # interval

    count = 0
    while count < n:

        count += 1

        # init
        lines  = sample_lines()
        nodes  = sample_nodes()
        line_colors = sample_line_colors()
        node_colors = sample_node_colors()

        # start
        descr = "START DEMO"
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Traffic change."
        lines = change_line(lines, "CACHE-E", "LV1", "LV2")
        lines = change_line(lines, "CACHE-F", "LV1", "LV2")
        lines = change_line(lines, "SW-Y.*RouterC", "LV1", "LV2")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Traffic change."
        lines = change_line(lines, "CACHE-E", "LV2", "LV3")
        lines = change_line(lines, "CACHE-F", "LV2", "LV3")
        lines = change_line(lines, "SW-Y.*RouterC", "LV2", "LV3")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Traffic change."
        lines = change_line(lines, "CACHE-E", "LV3", "LV4")
        lines = change_line(lines, "CACHE-F", "LV3", "LV4")
        lines = change_line(lines, "SW-Y.*RouterC", "LV3", "LV4")
        lines = change_line(lines, "RouterA.*RouterC", "LV1", "LV2")
        lines = change_line(lines, "PEER-A.*RouterA", "LV1", "LV2")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Traffic change."
        lines = change_line(lines, "CACHE-A", "LV1", "LV3")
        lines = change_line(lines, "CACHE-B", "LV1", "LV3")
        lines = change_line(lines, "CACHE-E", "LV4", "LV5")
        lines = change_line(lines, "CACHE-F", "LV4", "LV5")
        lines = change_line(lines, "SW-Y.*RouterC", "LV4", "LV5")
        lines = change_line(lines, "RouterA.*RouterC", "LV2", "LV3")
        lines = change_line(lines, "PEER-A.*RouterA", "LV2", "LV3")
        lines = change_line(lines, "PEER-C.*RouterA", "LV1", "LV2")
        lines = change_line(lines, "TRANSIT-A.*RouterA", "LV1", "LV2")
        lines = change_line(lines, "TRANSIT-B.*RouterA", "LV1", "LV2")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Traffic change."
        lines = change_line(lines, "CACHE-A", "LV3", "LV5")
        lines = change_line(lines, "CACHE-B", "LV3", "LV5")
        lines = change_line(lines, "CACHE-C", "LV1", "LV4")
        lines = change_line(lines, "SW-X.*RouterC", "LV1", "LV5")
        lines = change_line(lines, "PEER-A.*RouterA", "LV3", "LV4")
        lines = change_line(lines, "PEER-B.*RouterA", "LV1", "LV3")
        lines = change_line(lines, "PEER-C.*RouterA", "LV2", "LV3")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        descr = "Line RouterC-Y Down !!!"
        lines = change_line(lines, "SW-Y.*RouterC", "LV5", "LV0")
        lines = change_line(lines, "SW-Y.*RouterC", "2G", "Down")
        lines = change_line(lines, "SW-Y.*RouterD", "LV1", "LV5")
        lines = change_line(lines, "RouterC.*RouterD", "LV1", "LV2")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # delete line
        descr = "Delete line."
        lines = del_line(lines, "Down")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add line
        descr = "Add line."
        lines = add_line(lines, "SW-Y", "RouterC", "LV1", "1.0", "2G(NEW)", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add node
        descr = "Add node. SW-Z"
        nodes = add_node(nodes, "SW-Z", "6", "SWITCH", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add line
        descr = "Add line."
        lines = add_line(lines, "SW-Z", "RouterC", "LV0", "1.0", "2G", "")
        lines = add_line(lines, "SW-Z", "RouterD", "LV0", "1.0", "2G", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add node
        descr = "Add node. WEB-Z"
        nodes = add_node(nodes, "WEB-Z", "6", "SERVER", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add node
        descr = "Add node. DNS-Z"
        nodes = add_node(nodes, "DNS-Z", "6", "SERVER", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add node
        descr = "Add node. MAIL-Z"
        nodes = add_node(nodes, "MAIL-Z", "6", "SERVER", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # add line
        descr = "Add line."
        lines = add_line(lines, "WEB-Z", "SW-Z", "LV0", "1.0", "1G", "")
        lines = add_line(lines, "DNS-Z", "SW-Z", "LV0", "1.0", "1G", "")
        lines = add_line(lines, "MAIL-Z", "SW-Z", "LV0", "1.0", "1G", "")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # Change line color
        descr = "Traffic change."
        lines = change_line(lines, "SW-Z", "LV0", "LV1")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # Change line color
        descr = "Traffic change."
        lines = change_line(lines, "WEB-Z.*SW-Z", "LV1", "LV3")
        lines = change_line(lines, "SW-Z.*RouterC", "LV1", "LV3")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # Change line color
        descr = "Traffic change."
        lines = change_line(lines, "WEB-Z.*SW-Z", "LV3", "LV4")
        lines = change_line(lines, "DNS-Z.*SW-Z", "LV1", "LV3")
        lines = change_line(lines, "MAIL-Z.*SW-Z", "LV1", "LV3")
        lines = change_line(lines, "SW-Z.*RouterC", "LV3", "LV4")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)

        # Change line color
        descr = "Line down RouterA - RouterC"
        lines = change_line(lines, "RouterA.*RouterC", "LV3", "LV0")
        lines = change_line(lines, "RouterA.*RouterC", "10G", "Down")
        lines = change_line(lines, "RouterB.*RouterD", "LV1", "LV3")
        lines = change_line(lines, "RouterC.*RouterD", "LV2", "LV1")
        lines = change_line(lines, "RouterA.*RouterB", "LV1", "LV3")
        lines = change_line(lines, "PEER-C.*RouterA" , "LV3", "LV1")
        lines = change_line(lines, "PEER-C.*RouterB" , "LV1", "LV3")
        lines = change_line(lines, "SW-X.*RouterC", "LV5", "LV1")
        lines = change_line(lines, "SW-X.*RouterD", "LV1", "LV5")
        lines = change_line(lines, "SW-Z.*RouterC", "LV4", "LV1")
        lines = change_line(lines, "SW-Z.*RouterD", "LV1", "LV4")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t*4)

        # end
        descr = "END"
        lines = change_line(lines, "LV.*", "LV5", "LV1")
        lines = change_line(lines, "LV.*", "LV4", "LV1")
        lines = change_line(lines, "LV.*", "LV3", "LV1")
        lines = change_line(lines, "LV.*", "LV2", "LV1")
        lines = change_line(lines, "LV.*", "LV0", "LV1")
        lines = change_line(lines, "Down.*", "Down", "2G")
        config = template(time(), descr, node_colors, line_colors,  nodes, lines)
        update(path, config, t)



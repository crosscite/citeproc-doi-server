#!/usr/bin/python
#-*- encoding: utf-8 -*-

# Data source is the site linked here:
# https://forums.zotero.org/discussion/30974/2/any-idea-why-an-a-author-comes-last-in-the-bibliography/2/#Item_26

from lxml import etree
htmlparser = etree.HTMLParser()
tree = etree.parse(open("tussies.html"), htmlparser)

nodes = tree.xpath('//li/strong')

nodemap = {}
nodelist = []

for node in nodes:
    nodemap[node.text.encode('utf-8').lower()] = True;

for node in nodemap.keys():
    nodelist.append(node)

nodelist.sort()

for node in nodelist:
    print node

#!/usr/bin/python

import sys,os,os.path,re

scriptpath = os.path.dirname(sys.argv[0])
styledir = os.path.join(scriptpath,"..","tests","fixtures","std","styles")
styledir = os.path.abspath(styledir)

path = sys.argv[1]

count = 0

for filename in os.listdir(path):
    if filename.find("_") == -1: continue
    if not filename.endswith(".txt"): continue
    filepath = os.path.join(path,filename)
    txt = open(filepath).read()
    rex = '(?sm)^(.*>>=.*CSL[^\n]+)\n(.*)(\n<<=.*CSL.*)'
    m = re.match(rex,txt)
    if (m):
        if m.group(2).endswith(".csl"):
            count += 1
            scriptpath = os.path.join(styledir,m.group(2))
            style = open(scriptpath).read()
            txt = re.sub(rex,"\\1\n%s\\3" % (style,),txt)
            open(filepath,"w+").write(txt)

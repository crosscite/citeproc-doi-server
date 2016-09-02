#!/usr/bin/python

import re,sys,os

entityMap = {}
for fn in os.listdir("."):
    if not fn.endswith(".csl"): continue
    sys.stdout.write(".")
    sys.stdout.flush()
    fh = open(fn)
    while 1:
        line = fh.readline()
        if not line: break
        line = line.strip()
        entities = re.findall("&([^;]{2,6});", line)
        for entity in entities:
            if not entity.startswith("#"):
                if not entityMap.has_key(entity):
                    entityMap[entity] = 0
                entityMap[entity] += 1

for entity in entityMap:
    print("%s: %s") % (entity, entityMap[entity])
    
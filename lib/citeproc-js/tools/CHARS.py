#!/usr/bin/python

import sys

def toNum(str):
    return int(str, base=16)
    

nums = [
    ["0590", "05ff"],
    ["0080", "017f"],
    ["0400", "052f"],
    ["0370", "03ff"],
    ["1f00", "1fff"],
    ["0600", "06ff"],
    ["202a", "202e"],
    ["200c"],
    ["200d"],
    ["200e"],
    ["0218"],
    ["0219"],
    ["021a"],
    ["021b"]
]

lst = [];
for num in nums:
    if len(num) == 2:
        start = toNum(num[0])
        end = toNum(num[1])
        while start <= end:
            lst.append(["U+%s" % hex(start), unichr(start)])
            start += 1
    else:
        lst.append(["U+%s" % toNum(num[0]), unichr(toNum(num[0]))])
for v,c in lst:
    print "%s = %s" % (v, c)

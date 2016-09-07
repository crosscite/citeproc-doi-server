#!/bin/bash

set -e

./test.py -B
cp citeproc.js ~/src/JM/propachi-vanilla/chrome/content/citeproc.js

cat citeproc.js \
  | sed -s 's/this\.development_extensions\.main_title_from_short_title = false/this\.development_extensions\.main_title_from_short_title = true/' \
  | sed -s 's/this\.development_extensions\.uppercase_subtitles = false/this\.development_extensions\.uppercase_subtitles = true/' \
  > ~/src/JM/propachi-upper/chrome/content/citeproc.js

cp citeproc.js ~/src/JM/jurism/chrome/content/zotero/xpcom/citeproc.js

cp citeproc.js ~/src/JM/juris-m-top/js/citeproc.js

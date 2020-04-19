#!/bin/sh
rm -rf /home/app/webapp/public/styles
git clone --depth=1 https://github.com/citation-style-language/styles.git public/styles
rm -rf !$/.git

rm -rf /home/app/webapp/public/locales
git clone --depth=1 https://github.com/citation-style-language/locales.git public/locales
rm -rf !$/.git

rm -rf /home/app/webapp/lib/citeproc-js
git clone --depth=1 https://github.com/Juris-M/citeproc-js.git lib/citeproc-js
rm -rf !$/.git
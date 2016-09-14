#!/bin/sh
git clone --depth=1 https://github.com/citation-style-language/styles.git public/styles
rm -rf !$/.git

git clone --depth=1 https://github.com/citation-style-language/locales.git public/locales
rm -rf !$/.git

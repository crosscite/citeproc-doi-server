#!/bin/bash

rm -fR _build
make html
http-server _build/html
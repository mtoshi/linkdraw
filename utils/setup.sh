#!/bin/sh

test -d $1 || mkdir $1
cp -a src/* ${1}/
cp -a examples/positions/* ${1}/positions/
cp -a examples/configs/* ${1}/configs/
cp -a examples/js/* ${1}/js/
cp -a examples/css/* ${1}/css/
cp -a examples/html/* ${1}/
chmod 666 ${1}/positions/*.json
chmod 666 ${1}/configs/*.json
chmod 755 ${1}/js/*.js
chmod 755 ${1}/*.html
chmod 755 ${1}/write.cgi

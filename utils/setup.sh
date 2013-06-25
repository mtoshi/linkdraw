#!/bin/sh

test -d $1 || mkdir $1
dir=$(cd $(dirname $0);pwd)
cp -a ${dir}/../src/* ${1}/
cp -a ${dir}/../examples/html/* ${1}/
cp -a ${dir}/../examples/positions ${1}/
cp -a ${dir}/../examples/configs ${1}/
cp -a ${dir}/../examples/js ${1}/
cp -a ${dir}/../examples/css ${1}/
chmod 666 ${1}/positions/*.json
chmod 666 ${1}/configs/*.json
chmod 755 ${1}/js/*.js
chmod 755 ${1}/*.html
chmod 755 ${1}/write.cgi

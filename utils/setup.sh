#!/bin/sh

test -d $1 || mkdir $1
cp -a src/* ${1}/
cp -a examples/position.json ${1}/positions/
chmod 666 ${1}/positions/position.json

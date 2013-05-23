#!/bin/sh

test -d $1 || mkdir $1
cp -a src/* ${1}/
cp -a examples/*_position.json ${1}/positions/
cp -a examples/*_config.json ${1}/configs/
chmod 666 ${1}/positions/*.json
chmod 666 ${1}/configs/*.json
chmod 755 ${1}/write.cgi

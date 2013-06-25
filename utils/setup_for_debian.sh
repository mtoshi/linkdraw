#!/bin/sh

test -d $1 || mkdir $1
test -d ${1}/js || mkdir ${1}/js
ln -s /usr/share/javascript/jquery/jquery.min.js ${1}/js/
ln -s /usr/share/javascript/d3/d3.min.js ${1}/js/
ln -s /usr/share/javascript/linkdraw/linkdraw.js ${1}/js/
cdir=$(cd $(dirname $0);pwd)
cp -a ${cdir}/../src/* ${1}/
cp -a ${cdir}/../examples/html/* ${1}/
cp -a ${cdir}/../examples/positions ${1}/
cp -a ${cdir}/../examples/configs ${1}/
cp -a ${cdir}/../examples/js ${1}/
cp -a ${cdir}/../examples/css ${1}/
chmod 600 ${1}/positions/*.json
chmod 600 ${1}/configs/*.json
chmod 755 ${1}/js/*.js
chmod 755 ${1}/*.html
chmod 755 ${1}/write.cgi
chown -R www-data:www-data ${1}

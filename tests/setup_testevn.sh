#!/bin/sh

(
cd  $(git rev-parse --show-toplevel)
cd tests
dpkg -l libjs-qunit >/dev/null|| exit 1
for l in $(dpkg -L libjs-qunit | grep "\.js")
do
    ln -sf $l
done
)
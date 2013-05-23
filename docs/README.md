# linkdraw #

## setup ##

execute utils/setup.sh:

    $ bash utils/setup.sh /path/to/linkdraw

## demo ##

You can see linkdraw demo.

This demo changes status of map automatically in seconds.

Please execute "linkdraw_demo.py".

    $ python utils/linkdraw_demo.py /path/to/linkdraw/configs/demo_config.json

And access your web server.

     http://......../demo.html

## setup of testing ##

Set up test of linkdraw with phantomjs and QUnit.

### for Debian systems ###

Install pahtomjs, libjs-qunit packages:

	$ sudo apt-get install phantomjs libjs-qunit


Make symlinks after installing:

	$ cd tests
	$ ln -s /usr/share/javascript/qunit/qunit.js
	$ ln -s /usr/share/javascript/qunit/addons/phantomjs/runner.js
	$ ln -s /usr/share/javascript/qunit/addons/themes/*
	
Running test:

	$ cd ..
	$ utils/pre-commit.txt
	Took 20ms to run 6 tests. 6 passed, 0 failed.

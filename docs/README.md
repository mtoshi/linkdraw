# linkdraw #

Latest information is here.

    https://github.com/mtoshi/linkdraw/wiki

## setup ##

### for Github ###

Get Linkdraw.

    $ git clone git://github.com/mtoshi/linkdraw.git

execute utils/setup.sh:

    $ cd ./linkdraw
    $ bash utils/setup.sh dirname


### for Debian ###

Install jQuery.

    $ sudo apt-get install libjs-jquery -y

Install D3 and Linkdraw.
 
Get D3

    $ wget http://code.linkdraw.org/deb/libjs-d3_3.1.10-1_all.deb

Get Linkdraw

    $ wget http://code.linkdraw.org/deb/libjs-linkdraw_0.2.4-1_all.deb

Install

    $ sudo dpkg -i libjs-d3_3.1.10-1_all.deb libjs-linkdraw_0.2.4-1_all.deb

execute utils/setup.sh:

    $ sudo bash /usr/share/linkdraw/utils/setup.sh dirname

## sample ##

After setup, you can see some samples.

    http://example.org/dirname/sample.html

## demo ##

Also, you can see linkdraw demo.

This demo changes status of map automatically in seconds.

Please execute "demo.py".

    $ python utils/demo.py dirname/configs/demo_config.json

And access your web server.

     http://example.org/dirname/demo.html

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

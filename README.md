serverHere
==========

A simple node-based static file server, for quickly standing up an HTTP server to browse from your current directory.

Install
-------

    $ git clone https://github.com/sfoster/serverhere.git
    $ cd serverhere
    $ npm install

Usage
-----

    $ node ./index.js

I suggest adding the following to your <code>~/.profile</code> or  <code>~/.login</code> or wherever your shell normally looks when you login.

    alias serverhere="node ~/path/to/this/repo/serverHere/index.js $@"

..then you just need

    $ serverhere
    serving on localhost:3000; out of % /Users/sfoster/dev/somesuch

Now you can point your browser (or curl or whatever) at <code>http://localhost:3000/</code> and get a directory listing of <code>/Users/sfoster/dev/somesuch</code>.
Common file types should be served with the right mime-types, so for quickly testing some HTML/ajax stuff you should be good to go.

Options
-------

There's just a few simple options. serverHere uses the [optimist node module](https://github.com/substack/node-optimist) which is pretty flexible. I suggest using the format <code>--optionname value</code>.

### docRoot

The path to the directory to treat as the document root for the server (defaults to your current working directory.)

    $ node ./index.js --docRoot /some/other/directory

### port

The port number to listen on (defaults to 3000)

    $ node ./index.js --port 8888

### hostname

The hostname to listen for requests on (defaults to localhost)

    $ node ./index.js --hostname project1.local

### logger

The logging style, defaults to 'short'. Passes straight through to [connect's logger middleware](http://www.senchalabs.org/connect/logger.html)

Any of the options can be combined:

    $ node ./index.js --docRoot /some/other/directory --port 8080 --logging tiny


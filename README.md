mojito-cli [![Build Status](https://travis-ci.org/yahoo/mojito-cli.png)](https://travis-ci.org/yahoo/mojito-cli)
==========

`mojito-cli` is a command-line tool for [Mojito](https://github.com/yahoo/mojito) application developers. 
The components of `mojito` that are unrelated to the core library and runtime will be moving to separate packages.

_* * * For more information on the command-line package changes and the 
current status, see the [mojito-cli Wiki](https://github.com/yahoo/mojito-cli/wiki). * * *_

Install mojito-cli
------------------

1. With [npm](http://npmjs.org/), do the following:
 
        $ npm install --global mojito-cli

1. Confirm that `mojito-cli` has been installed.

        $ mojito help

Note that if `mojito` was already installed globally, it will be uninstalled. It is recommended to only 
install the core `mojito` package as a local dependency in your Mojito application. Users should not 
lose any functionality.

Quick Start
-----------

1. Create an app (which installs `mojito` locally using npm) and a mojit.

        $ mojito create app myapp
        $ cd myapp
        $ mojito create mojito hellomojit

1. Start the server.
    
        $ mojito start
1. In a browser, open the following URL: `http://localhost:8666/@hellomojit/index`
 
Commands
--------

### help

To show top-level help for this command-line tool:

    $ mojito help

To show help for a specific command:

    $ mojito help <command>

### version

To show the version for `mojito-cli`:

    $ mojito version

To show the version of an application, run the following from the application directory:

    $ mojito version app

The version of the mojito runtime installed locally to your app will be displayed as well.

To show the version of a mojit, run the following from the application directory:

    $ mojito version mojit <mojit-name>

### create

To generate boilerplate files from the Mojito archetypes or other templates:

    $ mojito create [options] <type> [subtype] <name>
    $ mojito create [options] <from> <to>

To learn how to do some simple key/value replacement, see 
[mojito-cli-create](http://github.com/yahoo/mojito-cli-create).

### build

To generate a static snapshot of your Mojito application:

    $ mojito build [options] html5app [dest]

See [mojito-cli-build](http://github.com/yahoo/mojito-cli-build) for more information.

### doc

To generate API documentation using [yuidocjs](https://github.com/yui/yuidoc):

    $ mojito doc [options] <app|mojit|mojito> [name]

See also [mojito-cli-doc](http://github.com/yahoo/mojito-cli-doc).

### jslint

To find common coding pitfalls with static analysis using [jslint](https://github.com/reid/node-jslint):

    $ mojito jslint [app|mojit] <path>

See [mojito-cli-jslint](http://github.com/yahoo/mojito-cli-jslint).

### start

To start the server and run the application:

    $ mojito start [<port>] [--context key1:value1,key2:value2]

The port number specified in the command above overrides the port number in the application 
configuration file, `application.json`. The default port number is 8666. 
See [Specifying Context](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html#mj-cmdline-context) 
to learn how to use the `--context` option.

See [mojito-cli-start](http://github.com/yahoo/mojito-cli-start).

### test

To run unit tests for a Mojito application:

    $  mojito test app

To run unit tests for a specific mojit:

    $ mojito test mojit <mojit-name>

Or:

    $ mojito test mojit <mojit-path>

See [mojito-cli-test](http://github.com/yahoo/mojito-cli-test) for more details.

### other...

When you are in the top level of a Mojito application directory, you can perform other Mojito 
commands which are delegated to the locally installed `mojito` package. More information is provided 
in [Mojito Command Line](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html).

Node packages accessible via `require` that begin with `mojito-cli-` can also be invoked, 
similar to `git`, `brew`, and `yogi`. For example, if `mojito-cli-foo` is installed in your `$NODE_PATH`, 
then `mojito foo` will invoke it.


Discussion/Forums
-----------------

http://developer.yahoo.com/forum/Yahoo-Mojito

Licensing and Contributions
---------------------------

This software is free to use under the Yahoo! Inc. BSD license. See LICENSE.txt. To contribute to the Mojito project, please see [Contributing](https://github.com/yahoo/mojito/wiki/Contributing-Code-to-Mojito).

The Mojito project is a [meritocratic, consensus-based community project](https://github.com/yahoo/mojito/wiki/Governance-Model), 
which allows anyone to contribute and gain additional responsibilities.

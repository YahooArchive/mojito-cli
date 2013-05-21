mojito-cli [![Build Status](https://travis-ci.org/yahoo/mojito-cli.png)](https://travis-ci.org/yahoo/mojito-cli)
==========

`mojito-cli` is a command line tool for [Mojito](https://github.com/yahoo/mojito) developers. `mojito` components that are unrelated to the core library and runtime will be moving to separate packages.

_* * * More information on the command line package changes, and the current status [here](https://github.com/yahoo/mojito-cli/wiki). * * *_

Install mojito-cli
------------------

With [npm](http://npmjs.org/), do

    % npm install --global mojito-cli

Try it

    % mojito help

Note that if `mojito` was already installed globally, it will be uninstalled. It is recommended to only install the core `mojito` package as a local dependency in your mojito application. Users should not have any loss of functionality.

Quick Start
-----------

Create an app (which installs `mojito` locally using npm) and a mojit.

    % mojito create app myapp
    % cd myapp
    % mojito create mojito hellomojit

Start the server

    % mojito start

In a browser, open

    http://localhost:8666/@hellomojit/index

Commands
--------

### help

To show top-level help for this command line tool:

    % mojito help

To show help for a specific command:

    % mojito help <command>

### version

To show the version for `mojito-cli`:

    % mojito version

To show the version for an application, run the following from the application directory:

    % mojito version app

The version of the mojito runtime installed locally to your app will be displayed as well.

To show the version for a mojit, run the following from the application directory:

    % mojito version mojit <mojit-name>

### create

To generate boilerplate files from mojito archetypes, or other templates:

    % mojito create [options] <type> [subtype] <name>
    % mojito create [options] <from> <to>

Does some simple key/value replacement. See [mojito-cli-create](http://github.com/yahoo/mojito-cli-create).

### build

To generate a static snapshot of your mojito application:

    % mojito build [options] html5app [dest]

See [mojito-cli-build](http://github.com/yahoo/mojito-cli-build).

### doc

To generate API documentation using [yuidocjs](https://github.com/yui/yuidoc):

    % mojito doc [options] <app|mojit|mojito> [dest]

See [mojito-cli-doc](http://github.com/yahoo/mojito-cli-doc).

### jslint

To find common coding pitfalls with static analysis by [jslint](https://github.com/reid/node-jslint):

    % mojito jslint [app|mojit] <path>

<!-- See [mojito-cli-jslint](http://github.com/yahoo/mojito-cli-jslint). -->

### start

To start the server and run the application:

    % mojito start [<port>] [--context key1:value1,key2:value2]

The port number specified in the command above overrides the port number in the application configuration file, application.json. The default port number is 8666. See [Specifying Context](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html#mj-cmdline-context) to learn how to use the --context option.

<!-- See [mojito-cli-start](http://github.com/yahoo/mojito-cli-start) -->

### test

To run unit tests for a mojito application:

    %  mojito test app

To run unit tests for a specific mojit:

    % mojito test mojit <mojit-name>

Or:

    % mojito test mojit <mojit-path>

See [mojito-cli-test](http://github.com/yahoo/mojito-cli-test)

### other...

When you are in the top level of a mojito application directory, you can perform other mojito commands which are delegated to the locally installed mojito package. More information is provided in the [Mojito Reference Guide](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html).

Node packages reachable via `require` that begin with `mojito-cli-` can also be invoked, similar to git, brew, and yogi. For example, if `mojito-cli-foo` is installed in your `$NODE_PATH` then `mojito foo` will invoke it.


Discussion/Forums
-----------------

http://developer.yahoo.com/forum/Yahoo-Mojito

Licensing and Contributions
---------------------------

`mojito-cli` is licensed under a BSD license (see LICENSE.txt). To contribute to the Mojito project, please see [Contributing](https://github.com/yahoo/mojito/wiki/Contributing-Code-to-Mojito).

The Mojito project is a [meritocratic, consensus-based community project](https://github.com/yahoo/mojito/wiki/Governance-Model) which allows anyone to contribute and gain additional responsibilities.

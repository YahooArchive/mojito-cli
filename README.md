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

### [create](http://github.com/yahoo/mojito-cli-create)

    % mojito create [options] <type> <subtype> <name>

### [build](http://github.com/yahoo/mojito-cli-build)

    % mojito build [options] html5app [dest]

### [doc](http://github.com/yahoo/mojito-cli-doc)

    % mojito doc [options] <app|mojit|mojito> [dest]

### [jslint](http://github.com/yahoo/mojito-cli-jslint)

### [start](http://github.com/yahoo/mojito-cli-start)

### [test](http://github.com/yahoo/mojito-cli-test)


### other...

When you are in the top level of a mojito application directory, you can perform other mojito commands which are delegated to the locally installed mojito package. More information is provided in the [Mojito Reference Guide](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html).



Discussion/Forums
-----------------

http://developer.yahoo.com/forum/Yahoo-Mojito

Licensing and Contributions
---------------------------

`mojito-cli` is licensed under a BSD license (see LICENSE.txt). To contribute to the Mojito project, please see [Contributing](https://github.com/yahoo/mojito/wiki/Contributing-Code-to-Mojito).

The Mojito project is a [meritocratic, consensus-based community project](https://github.com/yahoo/mojito/wiki/Governance-Model) which allows anyone to contribute and gain additional responsibilities.

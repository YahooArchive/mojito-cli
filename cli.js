/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var resolve = require('path').resolve,
    log = require('./lib/log'),
    getopts = require('./lib/getopts'),
    getenv = require('./lib/getenv');


/**
 * wrap `require` in a try/catch with some debug logging
 * @param {string} str require pathname
 * @return {object|false} module returned by `require`, or false
 */
function tryRequire(str) {
    var mod = false;
    try {
        mod = require(str);
        log.debug('required %s', str);
    } catch(err) {
        if (('MODULE_NOT_FOUND' === err.code) && ~err.message.indexOf(str)) {
            // could not find the module using "str"
            log.debug('module %s not found', str);
        } else {
            // module was loaded, and threw an exception
            log.debug('module error', err);
        }
    }
    return mod;
}

/**
 * try to require a module for use as a subcommand by looking in these places:
 * - require’ing the command-key value from the commands hash in config.json
 * - require’ing 'mojito-cli-' + cmd
 * - require’ing the command name from the mojito library path
 * @param {string} sub-command, like 'help', 'create', etc.
 * @param {object} cli, app, and mojito, metadata
 * @return {object|function} module loaded via `require`
 */
function load(cmd, env) {
    var mod = false,
        mo_cmd_list = env.mojito && env.mojito.commands,
        mo_cmd_path = mo_cmd_list && env.mojito.commandsPath;

    // command path is registered in ./config.js:commands hash
    if (env.cli.commands.hasOwnProperty(cmd)) {
        mod = tryRequire(env.cli.commands[cmd]);

    } else {
        // command is requireable, presumably in $NODE_PATH `npm root -g`
        // http://nodejs.org/api/modules.html#modules_all_together
        mod = tryRequire('mojito-cli-' + cmd);

        // command is in local mojito commands path (BC)
        if (!mod && mo_cmd_list && (mo_cmd_list.indexOf(cmd) > -1)) {
            mod = tryRequire(resolve(mo_cmd_path, cmd));
        }
    }

    return mod;
}

/**
 * invoke subcommand with env metadata and callback
 * @param {object} env
 *   @param {string} command, the first non-option cli arg (i.e. "create")
 *   @param {array} args command line arguments (see getopts.js)
 *   @param {object} opts command line options (see getopts.js)
 *   @param {array} orig the argv array originaly passed to index.js
 *   @param {string} cwd absolute path to current working directory
 *   @param {object} cli metadata (see getenv.js:cli())
 *   @param {object|false} app metadata (see getenv.js:read())
 *   @param {object|false} mojito metadata (see getenv.js:mojito())
 * @param {function(err, msg)} callback
 */
function exec(env, cb) {
    var mod = load(env.command, env);

    // re-parse command line arguments; may modify env.args & env.opts
    getopts.redux(env, mod.options);

    // display with --log silly, too verbose for --debug
    log.silly('env:', env);

    if (mod && mod.hasOwnProperty('run')) {
        log.debug('invoking legacy command %s', env.command);
        mod.run(env.args, env.opts, cb);

    } else if ('function' === typeof mod) {
        log.debug('invoking command %s', env.command);
        mod(env, cb);

    } else {
        cb('Unable to invoke command ' + env.command);
    }
}

/**
 * gather configs and metadata in env object, and call exec
 * @param {array} argv command line arguments process.argv.slice(2)
 * @param {string} cwd current working directory process.cwd()
 * @param {function(err, msg)} callback
 * @return {string} subcommand name
 */
function main(argv, cwd, cb) {
    var cli = getenv.cli(__dirname),
        env = getopts(argv, cli.options), // {command:"…", args:{…}, opts:{…}}
        lib = env.opts.libmojito; // alternate path to mojito library

    if (env.opts.loglevel) {
        log.level = env.opts.loglevel;
        log.silly('logging level set to', env.opts.loglevel);
    }

    if (!env.command) {
        log.error('No command.');
        env.command = 'help';
    }

    // apply command alias, i.e. "docs" -> "doc"
    if (!cli.commands[env.command] && cli.aliases[env.command]) {
        env.command = cli.aliases[env.command];
    }

    // collect parsed args and env metadata
    env.cwd = cwd;
    env.cli = cli;
    env.app = (cwd !== __dirname) && getenv(cwd);
    env.mojito = (env.app || lib) && getenv.mojito(cwd, lib);

    exec(env, cb);
    return env.command;
}


module.exports = main;
module.exports.load = load; // help.js

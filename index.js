/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var resolve = require('path').resolve,
    log = require('./lib/log'),
    getopts = require('./lib/getopts'),
    readpkg = require('./lib/readpkg');


function tryRequire(str) {
    var mod = false;
    try {
        mod = require(str);
        log.debug('required %s', str);
    } catch(err) {
        log.debug('unable to require %s', str);
    }
    return mod;
}

/**
 * @param {string} sub-command, like 'help', 'create', etc.
 * @param {object} cli, app, and mojito, metadata
 * @return {object|function} module loaded via `require`
 */
function load(cmd, env) {
    var mod = false,
        mo_cmd_list = env.mojito && env.mojito.commands,
        mo_cmd_path = mo_cmd_list && env.mojito.commandsPath;

    if (env.cli.commands.hasOwnProperty(cmd)) {
        mod = tryRequire(env.cli.commands[cmd]);

    } else if (mo_cmd_list && (mo_cmd_list.indexOf(cmd) > -1)) {
        mod = tryRequire(resolve(mo_cmd_path, cmd));
    }

    return mod;
}

function exec(env, cb) {
    var mod = load(env.command, env);

    // re-parse command line arguments
    getopts.redux(env, mod.options);

    if (mod && mod.hasOwnProperty('run')) {
        log.debug('runnning legacy mojito command %s', env.command);
        mod.run(env.args, env.opts, cb);

    } else if ('function' === typeof mod) {
        log.debug('getting bundled command %s', env.command);
        mod(env, cb);

    } else {
        cb('Unable to invoke command ' + env.command);
    }
}

function main(argv, cwd, cb) {
    var cli = readpkg.cli(__dirname),
        env = getopts(argv, cli.options);

    if (env.opts.loglevel) {
        log.level = env.opts.loglevel;
        log.silly('logging level set to', env.opts.loglevel);
    }

    if (!env.command) {
        log.error('No command.');
        env.command = 'help';
    }

    // collect parsed args and env metadata
    env.cwd = cwd;
    env.cli = cli;
    env.app = (cwd !== __dirname) && readpkg(cwd);
    env.mojito = env.app && readpkg.mojito(cwd, env.opts.lib);
    log.silly('env:', env);

    exec(env, cb);
    return env.command;
}


module.exports = main;
module.exports.load = load; // help.js

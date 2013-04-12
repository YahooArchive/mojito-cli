/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var resolve = require('path').resolve,
    nopt = require('nopt'),

    log = require('./lib/log'),
    readpkg = require('./lib/readpkg'),

    options = {'help': Boolean, 'version': Boolean, 'debug': Boolean},
    aliases = {h: '--help', v: '--version', d: '--debug'},
    bundled = { // map of package name:require-string
        'create': 'mojito-create',
        'validate': 'mojito-validate',
        'help': './commands/help',
        'info': './commands/info',
        'version': './commands/version'
    };


/**
 * @param {string} path of process' current working directory
 * @return {object} combined cli, app, and mojito metadata, see readpkg.js
 */
function getmeta(cwd) {
    var isme = cwd === __dirname,
        cli = readpkg(__dirname),
        app = !isme && readpkg(cwd),
        mojito = app && readpkg.mojito(cwd);

    // convenience flag for when we have a mojito app but no mojito installed
    if (app) {
        app.needsMojito = app.dependencies.mojito && !mojito;
    }

    // save list of bundled commands for help
    cli.commands = Object.keys(bundled);

    return {
        cli: cli,
        app: app,
        mojito: mojito
    };
}

function altcmd(opts) {
    var cmd;
    if (opts.version) {
        cmd = 'version';
    } else if (opts.help) {
        cmd = 'help';
    } else {
        log.error('No command...');
        cmd = 'help';
    }
    return cmd;
}

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
function load(cmd, meta) {
    var mod = false,
        mo_cmd_list = meta.mojito && meta.mojito.commands,
        mo_cmd_path = mo_cmd_list && meta.mojito.commandsPath;

    if (bundled.hasOwnProperty(cmd)) {
        mod = tryRequire(bundled[cmd]);

    } else if (mo_cmd_list && (mo_cmd_list.indexOf(cmd) > -1)) {
        mod = tryRequire(resolve(mo_cmd_path, cmd));
    }

    return mod;
}

function exec(cmd, args, opts, meta, cb) {
    var mod = load(cmd, meta);

    if (('object' === typeof mod) && ('run' in mod)) {
        log.debug('runnning legacy mojito command %s', cmd);
        mod.run(args, opts, cb);

    } else if ('function' === typeof mod) {
        log.debug('getting bundled command %s', cmd);
        mod(args, opts, meta, cb);

    } else {
        cb('Unable to invoke command ' + cmd);
    }
}

function main(argv, cwd, cb) {
    var opts = nopt(options, aliases, argv, 0),
        args = opts.argv.remain,
        cmd = (args.shift() || '').toLowerCase();

    if (opts.debug) {
        log.level = 'debug';
    }

    // treat lone --help and --version flags like commands
    if (!cmd) {
        cmd = altcmd(opts);
    }

    log.debug('cmd: %s, args: %j, opts: %j', cmd, args, opts);
    exec(cmd, args, opts, getmeta(cwd), cb);

    return cmd;
}


module.exports = main;
module.exports.getmeta = getmeta;
module.exports.load = load; // help.js

/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var load = require('../').load,
    log = require('../lib/log');


function usage(description) {
    log.info('Usage: mojito <command> [options]');
    log.info(description);
}

function help(env) {
    var commands = Object.keys(env.cli.commands);

    if (env.mojito) {
        env.mojito.commands.forEach(function(cmd) {
            if (commands.indexOf(cmd) === -1) {
                commands.push(cmd); // uniq commands
            }
        });
        commands.sort();
    }

    usage(env.cli.description);
    log.info('Available commands: %s', commands.join(', '));

    if (!env.mojito) {
        log.info(
            'Additional commands are available from within an application ' +
            'directory that has\nmojito installed.'
        );
    }
}

function main(env, cb) {
    var cmd = env.args.shift() || '',
        mod;

    if (!cmd) {
        help(env);
        cb();

    } else {
        mod = load(cmd, env);
        if (mod && mod.usage) {
            cb(null, mod.usage);

        } else {
            help(env);
            cb('No help available for command ' + cmd);
        }
    }
}

module.exports = main;

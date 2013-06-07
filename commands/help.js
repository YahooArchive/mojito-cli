/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var load = require('../').load,
    log = require('../lib/log'),
    EOL = require('os').EOL;


function help(env) {
    var commands = Object.keys(env.cli.commands),
        out = ['Usage: mojito <command> [options]', env.cli.description];

    if (env.mojito) {
        env.mojito.commands.forEach(function(cmd) {
            if (commands.indexOf(cmd) === -1) {
                commands.push(cmd); // uniq commands
            }
        });
        commands.sort();
    }

    out.push('Available commands: ' + commands.join(', '));

    if (!env.mojito) {
        out.push(
            'Additional commands are available from within an application directory that',
            'has mojito installed.'
        );
    }

    return out.join(EOL);
}

function main(env, cb) {
    var cmd = env.args.shift() || '',
        mod,
        out = [];

    if (!cmd) {
        cb(null, help(env));
        return;
    }

    // apply command alias, i.e. "docs" -> "doc"
    if (!env.cli.commands[cmd] && env.cli.aliases[cmd]) {
        cmd = env.cli.aliases[cmd];
    }

    mod = load(cmd, env);
    if (mod && mod.usage) {
        cb(null, mod.usage);

    } else {
        help(env);
        cb('No help available for command ' + cmd);
    }
}

module.exports = main;

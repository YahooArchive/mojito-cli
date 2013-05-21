/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var nopt = require('nopt');


// treat lone --help and --version flags like commands
function alternativeCmd(opts) {
    var cmd = '';
    if (opts.version || opts.v) {
        cmd = 'version';
    } else if (opts.help || opts.h) {
        cmd = 'help';
    }
    return cmd;
}

// lowercase parsed option keys; ignore nopt-specific 'argv' property
function getopts(parsed) {
    var filtered = {}, key;
    for (key in parsed) {
        if ('argv' !== key) {
            filtered[key.toLowerCase()] = parsed[key];
        }
    }
    return filtered;
}

// convert mojito options-config to nopt's known and alias config objects
function getoptCfg(options) {
    var known = {},
        alias = {'debug': ['--loglevel', 'debug']};

    function forNopt(opt) {
        var type;

        if (opt.longName) {
            // translate hasValue values to nopt options
            if (opt.hasValue === true) {
                type = String;       // BC hasValue === true is nopt String

            } else if (!opt.hasValue) {
                type = Boolean;      // BC falsey hasValue is nopt Boolean

            } else {                 // other nopt-specific value types
                type = opt.hasValue; // i.e. Array, Number, String, etc.
            }                        // e.g. option arrays: [String, Array]

            // nopt 1st param
            known[opt.longName.toLowerCase()] = type;

            if (opt.shortName) {
                // nopt 2nd param
                alias[opt.shortName] = '--' + opt.longName;
            }
        }
    }

    options.forEach(forNopt);

    return {
        known: known,
        alias: alias
    };
}

/**
 * adapter/facade for using mojito options with nopt
 * @param {array} argv from process.argv.slice(2)
 * @param {object} optCfg mojito-style cli option configs
 * @return {object} command, args, and options
 *   @param {string} command
 *   @param {array} args command line arguments unclaimed as an option
 *   @param {object} opts parsed command line options
 *   @param {array} orig the argv array originaly passed to index.js
 */
function main(argv, optCfg) {
    var config = getoptCfg(optCfg || []),
        parsed = nopt(config.known, config.alias, argv, 0),
        opts = getopts(parsed),
        args = parsed.argv.remain,
        orig = parsed.argv.original,
        command = args.shift() || alternativeCmd(opts);

    return {
        command: command.toLowerCase(), // string
        args: args, // array
        opts: opts, // object options
        orig: orig  // array process.argv.slice(2)
    };
}

/**
 * adapter to re-use main() with additional option configs
 * @param {object} env
 *   @param {array} args
 *   @param {object} opts
 *   @param {object} cli
 *   @param {array} orig the argv array originaly passed to index.js
 * @param {object} optCfg mojito-style options, i.e. create.js exports.options
 * @return {object} command, args, and options; @see main()
 *    @param {string} command
 *    @param {array} args command line arguments unclaimed as an option
 *    @param {object} opts parsed command line options
 *    @param {array} orig the argv array originaly passed to index.js
 */
function redux(env, optCfg) {
    var config = optCfg ? env.cli.options.concat(optCfg) : env.cli.options,
        redone = main(env.orig, config);

    env.args = redone.args;
    env.opts = redone.opts;
    return env;
}

module.exports = main;
module.exports.redux = redux;

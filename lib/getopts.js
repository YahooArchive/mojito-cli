/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var nopt = require('nopt');


/**
 * Presume a command should be "help" or "version" based on the options.
 * This is so "mojito --help" will work like one would expect.
 * @param {object} options mapped from command line arguments
 * @return {string} "version", "help", or an empty string
 */
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

/**
 * Convert mojito cli-options (exported on every cli sub command main module's
 * options property) to nopt's known and alias config objects.
 * @param {object} options hash map describing expeected command line switches
 *   @param {string} longName (required) option name like --port
 *   @param {string|falsey} shortName (optional) option name like --port
 *   @param {mixed} hasValue (optional) indicates if the option should be
 *    treated as a boolean value (if falsey), or have a value.
 * @return {object} see https://github.com/isaacs/nopt
 *   @param {object} known first parameter to nopt()
 *   @param {object} alias second parameter to nopt()
 */
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

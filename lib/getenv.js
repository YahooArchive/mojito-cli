/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var resolve = require('path').resolve,
    basename = require('path').basename,
    fs = require('fs'),
    log = require('./log'),

    MOJDIR = 'node_modules/mojito',
    MOJCMD = 'lib/app/commands'; // mojito@0.6.x


/**
 * read package.json and return a subset of the data
 * @param {string} directory path
 * @return {object|false}
 *   @param {string} name
 *   @param {string} path
 *   @param {string} version
 *   @param {string} description
 *   @param {object} dependencies
 */
function read(cwd) {
    var path = resolve(cwd, 'package.json'),
        pkg = false;

    try {
        pkg = require(path);
        log.debug('%s v%s found at %s', pkg.name, pkg.version, cwd);

    } catch(ignore) {
        log.debug('no package.json found at %s', cwd);
    }

    return pkg && {
        name: pkg.name,
        path: cwd,
        version: pkg.version,
        description: pkg.description || '(missing description)',
        dependencies: pkg.dependencies || {}
    };
}

/**
 * decorate read() results with mojito-specific metadata
 * @param {string} cwd Current working directory
 * @param {string} mojdir Optional path, relative or absolute, to the mojito lib
 * @return {object|false}
 *   @param {string} name
 *   @param {string} path mojito library location
 *   @param {string} version
 *   @param {string} description
 *   @param {object} dependencies
 *   @param {string} commandsPath path to sub-command files
 *   @param {array} commands names found in cwd/MOJDIR/MOJCMD
 */
function mojito(cwd, mojdir) {
    var path = resolve(cwd, mojdir || MOJDIR),
        pkg = read(path);

    function cmdname(file) {
        return basename(file, '.js');
    }

    if (pkg) {
        // additional metadata for locally installed mojito package
        pkg.commandsPath = resolve(path, MOJCMD);

        // pkg.commandsPath will be removed sometime after mojito@0.6.x
        pkg.commands = fs.existsSync(pkg.commandsPath) ?
            fs.readdirSync(pkg.commandsPath).map(cmdname) : [];

        log.debug(MOJCMD + ':', pkg.commands.join(', '));
    }

    return pkg;
}

/**
 * decorate read() results with key/values from ../config.json
 * @param {string} directory path
 * @return {object}
 *   @param {string} name
 *   @param {string} path
 *   @param {string} version
 *   @param {string} description
 *   @param {object} dependencies
 *   @param {object} commands bundled commands mapped to require paths
 *   @param {object} aliases map of command aliases to a value in this.commands
 *   @param {array} options for command-line parsing
 */
function cli(cwd) {
    var pkg = read(cwd),
        cfg = require('../config.json');

    Object.keys(cfg).forEach(function copy(key) {
        pkg[key] = cfg[key];
    });

    return pkg;
}

module.exports = read;
module.exports.cli = cli;
module.exports.mojito = mojito;

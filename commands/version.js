/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var join = require('path').join,
    log = require('../lib/log'),
    readpkg = require('../lib/readpkg');


function error(msg) {
    log.error(msg);
    log.info(module.exports.usage);
}

function version(meta, msg) {
    if (meta && meta.name) {
        log.info('%s v%s', meta.name, meta.version, msg || '');
    } else {
        error('Missing package.json.');
    }
}

function mojitVersion(name) {
    if (name) {
        version(readpkg(join('./mojits', name)));
    } else {
        error('Please specify a mojit name.');
    }
}

function main(args, opts, meta, cb) {
    var type = args.shift();

    switch (type) {
    case undefined:
        version(meta.cli);
        break;
    case 'app':
    case 'application':
        version(meta.app);
        if (meta.mojito) {
            version(meta.mojito, '(installed locally)');
        }
        break;
    case 'mojit':
        mojitVersion(args.shift());
        break;
    default:
        error('Unrecognized parameter: ' + type);
    }

    cb();
}

module.exports = main;

module.exports.usage = [
    'Usage: mojito version [app] [mojit <mojitname>]',
    'Display the version of the mojito-cli, current app, or specified mojit.',
    'Version of application or mojit depend on package.json in current directory.'
].join('\n');

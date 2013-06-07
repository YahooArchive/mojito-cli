/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var join = require('path').join,
    log = require('../lib/log'),
    getenv = require('../lib/getenv'),

    fmt = require('util').format,
    EOL = require('os').EOL,
    out,
    err,
    usage;


function version(meta, msg) {
    if (meta && meta.name) {
        out.push(fmt('%s v%s %s', meta.name, meta.version, msg || ''));
    } else {
        err.push('Missing package.json.');
    }
}

function mojitVersion(name) {
    if (name) {
        version(getenv(join('./mojits', name)));
    } else {
        err.push('Please specify a mojit name.');
    }
}

function main(env, cb) {
    var type = env.args.shift();
    out = [];
    err = [];

    switch (type) {
    case undefined:
        version(env.cli);
        break;
    case 'app':
    case 'application':
        version(env.app);
        if (env.mojito) {
            version(env.mojito, 'at ' + env.mojito.path);
        }
        break;
    case 'mojit':
        mojitVersion(env.args.shift());
        break;
    default:
        err.push(fmt('Unrecognized parameter: %s%s%s', type, EOL, usage));
    }

    if (err.length) {
        log.error(err.join(EOL));
    }

    cb(null, out.join(EOL) || null);
}

module.exports = main;

module.exports.usage = usage = [
    'Usage: mojito version [app] [mojit <mojitname>]',
    'Display the version of the mojito-cli, current app, or specified mojit.',
    'Version of application or mojit depend on package.json in current directory.'
].join('\n');

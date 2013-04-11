/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('../lib/log');


function appinfo(meta) {
    var appdeps = meta.app && meta.app.dependencies,
        needs_mojito = appdeps && meta.app.dependencies.mojito;

    if (meta.app && meta.app.name && meta.app.version) {
        log.info('%s v%s, %s', meta.app.name, meta.app.version,
            meta.app.description || '(missing description)');

        if (meta.app.dependencies && meta.app.dependencies.mojito) {
            log.info('%s dependencies: %s', meta.app.name, Object.keys(appdeps).join(', '));

        } else {
            log.warn('Mojito is not listed as a dependency in your package.json. Fix with:');
            log.warn('    npm install mojito --save');
            log.warn('');
        }
    }

    if (needs_mojito) {
        if (meta.mojito) {
            log.info('%s v%s (installed locally).', meta.mojito.name, meta.mojito.version);
        } else {
            log.warn('Mojito is not installed locally. Install with:');
            log.warn('    npm install mojito');
            log.warn('');
        }
    }
}

function main(args, opts, meta, cb) {
    log.info('%s v%s', meta.cli.name, meta.cli.version);
    log.info('node %s/%s', process.version, process.platform);
    appinfo(meta);
    cb();
}

module.exports = main;
module.exports.usage = 'Usage: mojito info\nDisplay information about your app and mojito.';

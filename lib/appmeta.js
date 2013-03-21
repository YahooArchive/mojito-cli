/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

var resolve = require('path').resolve,
    readdir = require('fs').readdirSync,
    log = require('./log'),

    MOJDIR = 'node_modules/mojito';


function apppkg(cwd) {
    var path = resolve(cwd, 'package'),
        isme = resolve(__dirname, '../package'),
        meta = false;

    if (path === isme) {
        log.debug('NOT reading own package.json');

    } else {
        try {
            meta = require(path);
            log.debug('%s v%s found at %s', meta.name, meta.version, cwd);

        } catch(ignore) {
            log.debug('NO package.json found at %s', cwd);
        }
    }

    return meta && {
        name: meta.name,
        path: cwd,
        version: meta.version,
        dependencies: meta.dependencies || {}
    };
}

function main(cwd) {
    var meta = apppkg(cwd);
    return meta;
}

module.exports = main;

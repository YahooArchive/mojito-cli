/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var log = require('../lib/log'),
    fmt = require('util').format,
    EOL = require('os').EOL,
    out;


function appinfo(env) {
    var appdeps = env.app && env.app.dependencies,
        needs_mojito = appdeps && env.app.dependencies.mojito;

    if (env.app && env.app.name && env.app.version) {
        out.push(fmt('%s v%s, %s', env.app.name, env.app.version, env.app.description || '(missing description)'));

        if (env.app.dependencies && env.app.dependencies.mojito) {
            out.push(fmt('%s dependencies: %s', env.app.name, Object.keys(appdeps).join(', ')));

        } else {
            log.warn('Mojito is not listed as a dependency in your package.json. Fix with:');
            log.warn('    npm install mojito --save');
            log.warn('');
        }
    }

    if (needs_mojito) {
        if (env.mojito) {
            out.push(fmt('%s v%s (installed locally).', env.mojito.name, env.mojito.version));
        } else {
            log.warn('Mojito is not installed locally. Install with:');
            log.warn('    npm install mojito');
            log.warn('');
        }
    }
}

function main(env, cb) {
    out = [];
    out.push(fmt('%s v%s', env.cli.name, env.cli.version));
    out.push(fmt('node %s/%s', process.version, process.platform));;
    appinfo(env);
    cb(null, out.join(EOL));
}

module.exports = main;
module.exports.usage = 'Usage: mojito info\nDisplay information about your app and mojito.';

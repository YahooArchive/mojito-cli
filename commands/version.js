/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true */
'use strict';

var log = require('../lib/log');


function version(args, opts, meta, cb) {
    log.info('%s v%s', meta.cli.name, meta.cli.version);
    cb(null, 'ok');
}

module.exports = version;

module.exports.usage = 'Usage: mojito version\nDisplay the version of mojito-cli.';
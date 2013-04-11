var test = require('tap').test,
    info = require('../commands/info'),
    log = require('../lib/log');


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {cli: {name: 'mojito-cli', version: '1.2.3'}};
}

function reset() {
    log.record = [];
    log._buffer = [];
}

test('info exports', function(t) {
    t.equal('function', typeof info);
    t.equal('string', typeof info.usage);
    t.end();
});

test('info simple', function(t) {
    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3');
        t.equals(log.record.shift().message.substring(0, 4), 'node');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    info([], null, getMeta(), cb);
});

test('info app, no deps', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc'
    };

    function cb(err, msg) {
        var m;

        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3');
        t.equals(log.record.shift().message.substring(0, 4), 'node');
        t.equals(log.record.shift().message, 'myapp v3.4.5, lorem ipsum delor etc');

        m = log.record.shift();
        t.equals(m.level, 'warn');
        t.equals(m.message, 'Mojito is not listed as a dependency in your package.json. Fix with:');
        t.equals(log.record.length, 2);
        t.end();
    }

    reset();
    info([], null, meta, cb);
});

test('info app, missing description', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5'
    };

    function cb(err, msg) {
        var m;

        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3');
        t.equals(log.record.shift().message.substring(0, 4), 'node');
        t.equals(log.record.shift().message, 'myapp v3.4.5, (missing description)');

        m = log.record.shift();
        t.equals(m.level, 'warn');
        t.equals(m.message, 'Mojito is not listed as a dependency in your package.json. Fix with:');
        t.equals(log.record.length, 2);
        t.end();
    }

    reset();
    info([], null, meta, cb);
});

test('info app, mojito dep', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    function cb(err, msg) {
        var m;

        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3');
        t.equals(log.record.shift().message.substring(0, 4), 'node');
        t.equals(log.record.shift().message, 'myapp v3.4.5, lorem ipsum delor etc');
        t.equals(log.record.shift().message, 'myapp dependencies: mojito');

        m = log.record.shift();
        t.equals(m.level, 'warn');
        t.equals(m.message, 'Mojito is not installed locally. Install with:');
        t.equals(log.record.shift().message, '    npm install mojito');
        t.equals(log.record.shift().message, '');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    info([], null, meta, cb);
});

test('info app, mojito dep, mojito local', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    meta.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        var m;
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3');
        t.equals(log.record.shift().message.substring(0, 4), 'node');
        t.equals(log.record.shift().message, 'myapp v3.4.5, lorem ipsum delor etc');

        m = log.record.shift();
        t.equals(m.level, 'info');
        t.equals(m.message, 'myapp dependencies: mojito');
        t.equals(log.record.shift().message, 'mojito v0.0.1 (installed locally).');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    info([], null, meta, cb);
});

var test = require('tap').test,
    info = require('../commands/info'),
    log = require('../lib/log');


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {cli: {name: 'mojito-cli', version: '1.2.3'}};
}

test('info exports', function(t) {
    t.equal('function', typeof info);
    t.equal('string', typeof info.usage);
    t.end();
});

test('info simple', function(t) {
    function cb(err, msg) {
        t.equals(err, null);
        t.ok(~msg.indexOf('mojito-cli v1.2.3'));
        t.end();
    }

    info(getMeta(), cb);
});

test('info app, no deps', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc'
    };

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(~msg.indexOf('mojito-cli v1.2.3'));
        t.ok(msg.indexOf('\nmyapp v3.4.5, lorem ipsum delor etc'));
        t.end();
    }

    info(meta, cb);
});

test('info app, missing description', function(t) {
    var meta = getMeta();

    meta.app = {
        name: 'myapp',
        version: '3.4.5'
    };

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(~msg.indexOf('mojito-cli v1.2.3'));
        t.ok(msg.indexOf('\nmyapp v3.4.5, (missing description)'));
        t.end();
    }

    info(meta, cb);
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
        t.equals(err, null);
        t.ok(~msg.indexOf('mojito-cli v1.2.3'));
        t.ok(msg.indexOf('\nmyapp v3.4.5, lorem ipsum delor etc'));
        t.ok(msg.indexOf('\nmyapp dependencies: mojito'));
        t.end();
    }

    info(meta, cb);
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
        t.equals(err, null);
        t.ok(~msg.indexOf('mojito-cli v1.2.3'));
        t.ok(msg.indexOf('\nmyapp v3.4.5, lorem ipsum delor etc'));
        t.ok(msg.indexOf('\nmyapp dependencies: mojito'));
        t.ok(msg.indexOf('\nmojito v0.0.1 (installed locally).'));
        t.end();
    }

    info(meta, cb);
});

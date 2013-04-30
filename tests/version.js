var test = require('tap').test,
    vers = require('../commands/version'),
    log = require('../lib/log');


// buffer log msgs instead of outputing them
log.pause();

function getenv() {
    return {
        args: [],
        cli: {name: 'mojito-cli', version: '1.2.3'}
    };
}

function reset() {
    log.record = [];
    log._buffer = [];
}

test('version exports', function(t) {
    t.equal('function', typeof vers);
    t.equal('string', typeof vers.usage);
    t.end();
});

test('version simple', function(t) {
    function cb(err, msg) {
        t.equals(err, undefined);
        t.ok(~log.record.shift().message.indexOf('mojito-cli v1.2.3 '));
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers(getenv(), cb);
});

test('version app', function(t) {
    var env = getenv();
    
    env.args = ['app'];

    env.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    env.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.equals(err, undefined);
        t.ok(~log.record.shift().message.indexOf('myapp v3.4.5 '));
        t.ok(~log.record.shift().message.indexOf('mojito v0.0.1 (installed locally)'));
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers(env, cb);
});

test('version application', function(t) {
    var env = getenv();
    
    env.args = ['application'];

    env.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    env.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.equals(err, undefined);
        t.ok(~log.record.shift().message.indexOf('myapp v3.4.5 '));
        t.ok(~log.record.shift().message.indexOf('mojito v0.0.1 (installed locally)'));
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers(env, cb);
});

test('version mojit foo', function(t) {
    var env = getenv();

    env.args = ['mojit', 'foo'];
    
    env.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    env.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.ok(~log.record.shift().message.indexOf('no package.json found at mojits/foo'));
        t.ok(~log.record.shift().message.indexOf('Missing package.json.'));
        t.ok(~log.record.shift().message.indexOf('Usage: mojito version'));
        t.end();
    }

    reset();
    vers(env, cb);
});

test('version mojit (missing mojit name)', function(t) {
    var env = getenv();
    
    env.args = ['mojit'];

    env.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    env.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        var m = log.record.shift();
        t.equals(err, undefined);

        t.ok(~m.message.indexOf('Please specify a mojit name.'));
        t.equals(m.level, 'error');
        
        t.equals(log.record.shift().message, vers.usage);
        t.end();
    }

    reset();
    vers(env, cb);
});


test('version nonesuch', function(t) {    
    var env = getenv();
    
    env.args = ['nonesuch'];

    function cb(err, msg) {
        t.equals(err, undefined);
        t.end();
    }

    reset();
    vers(env, cb);
});


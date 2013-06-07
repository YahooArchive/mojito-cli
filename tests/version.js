var test = require('tap').test,
    log = require('../lib/log'),
    fn = require('../commands/version');


// buffer log msgs instead of outputing them
log.pause();

function getenv(args) {
    return {
        args: args || [],
        cli: {name: 'mojito-cli', version: '1.2.3'}
    };
}

test('version exports', function(t) {
    t.equal('function', typeof fn);
    t.equal('string', typeof fn.usage);
    t.end();
});

test('version simple', function(t) {
    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, 'mojito-cli v1.2.3 ');
    }

    t.plan(2);
    fn(getenv(), cb);
});

test('version app', function(t) {
    var env = getenv(['app']);

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
        version: '0.0.1',
        path: 'boo/yah/'
    };

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg.trim(), 'myapp v3.4.5 \nmojito v0.0.1 at boo/yah/');
    }

    t.plan(2);
    fn(env, cb);
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

    env.mojito = false; // variation for coverage

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, 'myapp v3.4.5 ');
    }

    t.plan(2);
    fn(env, cb);
});

test('version mojit foo', function(t) {
    var env = getenv(['mojit', 'foo']);
    
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
        version: '0.0.1',
        path: '/beep/boop/boppu'
    };

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, null);
    }

    t.plan(2);
    fn(env, cb);
});

test('version mojit (missing mojit name)', function(t) {
    var env = getenv(['mojit']);

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
        t.equals(err, null);
        t.equals(msg, null);
    }

    t.plan(2);
    fn(env, cb);
});


test('version nonesuch', function(t) {    
    var env = getenv(['nonesuch']);
    
    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, null);
    }

    t.plan(2);
    fn(env, cb);
});


var test = require('tap').test,
    resolve = require('path').resolve,
    log = require('../lib/log'),

    fn = require('../cli');


// buffer log msgs instead of outputing them
log.pause();

function reset() {
    log.record = [];
    log._buffer = [];
}

function noop() {
}

function noCb(t) {
    return function (err, msg) {
        t.ok((err === undefined) && (msg === undefined), 'no cb params');
    }
}

test('index exports', function (t) {
    t.equal('function', typeof fn);
    t.same(Object.keys(fn), ['load']);
    t.end();
});

test('--debug', function(t) {
    t.equals(fn(['--debug', 'help'], '', noop), 'help');
    t.equals(fn(['help', '-d'], '', noop), 'help');
    t.end();
});

test('mojito help (app cwd)', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg, 'mock usage for mojito/lib/app/commands/jslint.js');
        reset();
    }

    reset();
    t.plan(2);
    fn(['help', 'jslint'], cwd, cb);
});

test('mojito help --lib fixtures/…/mojito', function(t) {
    var lib = resolve(__dirname, 'fixtures', 'someapp', 'node_modules', 'mojito');

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg, 'mock usage for mojito/lib/app/commands/jslint.js');
        reset();
    }

    reset();
    t.plan(2);
    fn(['help', 'jslint', '--lib', lib], '.', cb);
});

test('exec legacy cmd', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, []);
        t.end();
    }

    reset();
    fn(['jslint'], cwd, cb);
});

test('mojito --version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(fn(['--version'], '', cb), 'version');
});

test('mojito version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(fn(['version'], '', cb), 'version');
    //t.equals(fn(['--version'], null, cb), 'version');
});

test('mojito version app|application', function(t) {
    t.plan(6);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(fn(['version', 'app'], '', cb), 'version');
    t.equals(fn(['version', 'application'], '', cb), 'version');
});

test('mojito version mojit', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(fn(['version', 'mojit'], '', cb), 'version');
});

test('mojito info', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(fn(['info'], '', cb), 'info');
});

test('command takes priority over alt cmd flag', function(t) {
    t.equals(fn(['--version', 'help'], '', noop), 'help');
    t.end();
});

test('mojito (no args)', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined, 'err undefined');
        t.ok(log.record.length > 3);
        reset();
    }

    reset();
    t.equals(fn([], '', cb), 'help');
});

test('mojito nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'Unable to invoke command nonesuch');
        reset();
    }

    t.equals(fn(['nonesuch'], '', cb), 'nonesuch');
});

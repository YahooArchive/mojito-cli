var test = require('tap').test,
    resolve = require('path').resolve,
    log = require('../lib/log'),

    fn = require('../cli'),

    VERS = require('../package.json').version;


// buffer log msgs instead of outputing them
log.pause();

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

test('mojito docs // alias for `doc`', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg.slice(0,4), 'Done');
    }

    t.plan(2);
    fn(['docs', 'app', 'alias-test'], cwd, cb);
});

test('mojito help docs // alias for `doc`', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg.slice(0, 17), 'Usage: mojito doc');
    }

    t.plan(2);
    fn(['help', 'docs'], cwd, cb);
});

test('mojito help jslint (app cwd)', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(~msg.indexOf('Usage: mojito jslint'));
    }

    t.plan(2);
    fn(['help', 'jslint'], cwd, cb);
});

test('mojito help --lib fixtures/…/mojito', function(t) {
    var lib = resolve(__dirname, 'fixtures', 'someapp', 'node_modules', 'mojito');

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(~msg.indexOf('Usage: mojito jslint'));
    }

    t.plan(2);
    fn(['help', 'jslint', '--lib', lib], '.', cb);
});

test('mojito (mock) gv ...', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, ['arg1']);
        t.same(opts, {loglevel: 'debug'});
    }

    t.plan(3);
    fn(['gv', 'arg1', '--debug'], cwd, cb);
});

test('mojito (mock) gv --lib ...', function(t) {
    var lib = resolve(__dirname, 'fixtures/someapp/node_modules/mojito');

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, ['arg1']);
        t.same(opts, {loglevel: 'debug', libmojito: lib});
    }

    t.plan(3);
    fn(['gv', 'arg1', '--debug', '--lib', lib], '', cb);
});

test('mojito (mock) gv --libmojito ...', function(t) {
    var lib = resolve(__dirname, 'fixtures/someapp/node_modules/mojito');

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, ['arg1']);
        t.same(opts, {loglevel: 'debug', libmojito: lib});
    }

    t.plan(3);
    fn(['gv', 'arg1', '--debug', '--libmojito', lib], __dirname, cb);
});

test('mojito --version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg.trim(), 'mojito-cli v' + VERS);
    }

    t.equals(fn(['--version'], '', cb), 'version');
});

test('mojito version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg.trim(), 'mojito-cli v' + VERS);
    }

    t.equals(fn(['version'], '', cb), 'version');
});

test('command takes priority over alt cmd flag', function(t) {
    t.equals(fn(['--version', 'help'], '', noop), 'help');
    t.end();
});

test('mojito (no args)', function(t) {

    function cb(err, msg) {
        t.equals(err, null, 'err should be null');
        t.ok(log.record.length > 3);
    }

    t.plan(3);
    t.equals(fn([], '', cb), 'help');
});

test('mojito nonesuch', function(t) {

    function cb(err, msg) {
        t.equals(err, 'Unable to invoke command nonesuch');
    }

    t.plan(2);
    t.equals(fn(['nonesuch'], '', cb), 'nonesuch');
});

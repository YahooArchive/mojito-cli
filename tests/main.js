var test = require('tap').test,
    resolve = require('path').resolve,
    cli = require('../'),
    log = require('../lib/log');


// buffer log msgs instead of outputing them
//log.level = 'silly';
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
    t.equal('function', typeof cli);
    t.same(Object.keys(cli), ['load']);
    t.end();
});

test('--debug', function(t) {
    t.equals(cli(['--debug', 'help'], '', noop), 'help');
    t.equals(cli(['help', '-d'], '', noop), 'help');
    t.end();
});

test('load "version"', function(t) {
    var env = {
            cli:{
                commands:{version:'./commands/version'}
            }
        },
        actual = cli.load('version', env);
    t.equals(typeof actual, 'function');
    t.equals(typeof actual.usage, 'string');
    t.ok(actual.usage.match(/^Usage: mojito version /));
    t.end();
});

test('load false', function(t) {
    var env = {cli:{commands:{}}},
        actual = cli.load('foo', env);
    t.equals(actual, false);
    t.end();
});

test('load fail', function(t) {
    var meta = {
            cli:{commands:{}},
            mojito: {
                commands: ['foo'],
                commandsPath: '/bar/baz'
            }
        },
        actual = cli.load('foo', meta);
    t.equals(actual, false);
    t.end();
});

test('mojito help (app cwd)', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, msg) {
        t.equal(err, null);
        //t.equal(msg, 'mock usage for mojito/lib/app/commands/jslint.js');
        reset();
    }

    reset();
    t.plan(1);
    cli(['help', 'jslint'], cwd, cb);
});

test('exec legacy cmd', function(t) {
    var cwd = resolve(__dirname, 'fixtures/someapp');

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, []);
        t.end();
    }

    reset();
    cli(['jslint'], cwd, cb);
});

test('mojito --version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(cli(['--version'], '', cb), 'version');
});

test('mojito version', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(cli(['version'], '', cb), 'version');
    //t.equals(cli(['--version'], null, cb), 'version');
});

test('mojito version app|application', function(t) {
    t.plan(6);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(cli(['version', 'app'], '', cb), 'version');
    t.equals(cli(['version', 'application'], '', cb), 'version');
});

test('mojito version mojit', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(cli(['version', 'mojit'], '', cb), 'version');
});

test('mojito info', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(msg, undefined);
    }

    t.equals(cli(['info'], '', cb), 'info');
});

test('command takes priority over alt cmd flag', function(t) {
    t.equals(cli(['--version', 'help'], '', noop), 'help');
    t.end();
});

test('no args', function(t) {
    t.plan(3);

    function cb(err, msg) {
        t.equals(err, undefined, 'err undefined');
        t.ok(log.record.length > 3);
        reset();
    }

    reset();
    t.equals(cli([], '', cb), 'help');
});

test('nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'Unable to invoke command nonesuch');
        reset();
    }

    t.equals(cli(['nonesuch'], '', cb), 'nonesuch');
});

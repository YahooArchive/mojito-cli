var test = require('tap').test,
    cli = require('../'),
    log = cli.log;


// buffer log msgs instead of outputing them
log.pause();

function reset(t) {
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
    var module = require('../');
    t.equal('function', typeof module);
    t.same(Object.keys(module), ['log', 'load', 'getmeta']);
    t.end();
});

test('mojito (no subcmd)', function(t) {
    t.plan(5);

    function cb2(m) {
        t.equal(m.message, 'No command...', 'err msg emitted');
        process.nextTick(function() {
            t.equal(log.record[0], m, 'err msg obj is 1st elem');
            t.ok(log.record.length > 1, 'plus some other msgs');
            reset();
        });
    }

    log.once('log.error', cb2);
    reset();
    t.equals(cli([], '', noCb(t)), 'help');
});

test('mojito help|--help|-h', function(t) {
    t.plan(6)
    t.equals(cli(['help'], '', noCb(t)), 'help');
    t.equals(cli(['--help'], '', noCb(t)), 'help');
    t.equals(cli(['-h'], '', noCb(t)), 'help');
});

test('mojito help (app cwd)', function(t) {
    var cwd = __dirname + '/fixtures/someapp';

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg, 'mock usage for mojito/lib/app/commands/jslint.js');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.shift().level, 'debug');
        t.equal(log.record.length, 0);
        reset();
        t.end();
    }
    reset();
    t.equals(cli(['help', 'jslint'], cwd, cb), 'help');
});

test('exec legacy cmd', function(t) {
    var cwd = __dirname + '/fixtures/someapp';

    function cb(err, args, opts) {
        t.equals(err, null);
        t.same(args, []);
        t.end();
    }

    reset();
    cli(['jslint'], cwd, cb);
});

test('--debug', function(t) {
    t.equals(cli(['--debug', 'help'], '', noop), 'help');
    t.equals(cli(['help', '-d'], '', noop), 'help');
    t.end();
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

test('command takes priority over atl cmd flag', function(t) {
    t.equals(cli(['--version', 'help'], '', noop), 'help');
    t.end();
});

test('nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'Unable to invoke command nonesuch');
    }

    t.equals(cli(['nonesuch'], '', cb), 'nonesuch');
});

test('load "version"', function(t) {
    var actual = cli.load('./commands/version');
    t.equals(typeof actual, 'function');
    t.equals(typeof actual.usage, 'string');
    t.ok(actual.usage.match(/^Usage: mojito version /));
    t.end();
});

test('load fail', function(t) {
    var actual = cli.load('foo');
    t.equals(actual, undefined);
    t.end();
});

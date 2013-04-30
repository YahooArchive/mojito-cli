var test = require('tap').test,
    help = require('../commands/help'),
    log = require('../lib/log'),
    resolve = require('path').resolve;


// buffer log msgs instead of outputing them
log.pause();

function getEnv() {
    return {
        command: 'help',
        args: [],
        opts: {},
        cli: {
            name: 'mojito-cli',
            version: '1.2.3',
            commands: {
                'create': 'mojito-create',
                'help': 1,
                'info': 1,
                'version': './commands/version',
                'make-it-rain': 1
            },
            description: 'whoop whoop'
        }
    };
}

function reset() {
    log.record = [];
    log._buffer = [];
}

test('help exports', function(t) {
    t.equal('function', typeof help);
    t.end();
});

test('help simple', function(t) {
    t.plan(6);
    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'Usage: mojito <command> [options]');
        t.equals(log.record.shift().message, 'whoop whoop');
        t.equals(log.record.shift().message, 'Available commands: create, help, info, version, make-it-rain');
        t.equals(log.record.shift().message, 'Additional commands are available from within an application directory that has\nmojito installed.');
        t.equals(log.record.length, 0);
    }

    reset();
    help(getEnv(), cb);
});

test('help + mojito commands', function(t) {
    var env = getEnv();

    env.mojito = {commands: ['beep', 'boop', 'create', 'make-it-rain']};

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'Usage: mojito <command> [options]');
        t.equals(log.record.shift().message, 'whoop whoop');
        t.equals(log.record.shift().message, 'Available commands: beep, boop, create, help, info, make-it-rain, version');
        t.equals(log.record.length, 0);
    }

    reset();
    t.plan(5);
    help(env, cb);
});

test('help nonesuch', function(t) {
    var env = getEnv();
    env.args = ['nonesuch'];

    function cb(err, msg) {
        t.equals(err, 'No help available for command nonesuch', 'haz err');
        t.equals(msg, undefined, 'no msg');
    }

    reset();
    t.plan(2);
    help(env, cb);
});

test('help version', function(t) {
    var env = getEnv();
    env.args = ['version'];

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^Usage: mojito version/));
    }

    reset();
    t.plan(2);
    help(env, cb);
});

test('help create', function(t) {
    var env = getEnv();
    env.args = ['create'];

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(~msg.indexOf('mojito create'));
    }

    reset();
    t.plan(2);
    help(env, cb);
});

test('help mock jslint', function(t) {
    var env = {
            args: ['jslint'],
            cli: {commands:{}},
            mojito: {
                commands: ['jslint', 'beep', 'boop'],
                commandsPath: resolve(__dirname, 'fixtures/someapp/node_modules/mojito/lib/app/commands')
            }
        };

    t.plan(2);

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(msg.match(/^mock usage for mojito\/lib\/app\/commands\/jslint/));
    }

    reset();
    help(env, cb);
});

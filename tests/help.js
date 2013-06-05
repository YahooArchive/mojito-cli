var test = require('tap').test,
    help = require('../commands/help'),
    log = require('../lib/log'),
    resolve = require('path').resolve;


// buffer log msgs instead of outputing them
log.pause();

function getEnv(args, opts) {
    return {
        command: 'help',
        args: args || [],
        opts: opts || {},
        cli: {
            name: 'mojito-cli',
            version: '1.2.3',
            commands: {
                'create': 'mojito-cli-create',
                'help': 1,
                'info': 1,
                'version': './commands/version',
                'make-it-rain': 1
            },
            aliases: {
            	"docs": "doc"
            },
            description: 'whoop whoop'
        }
    };
}

test('help exports', function(t) {
    t.equal('function', typeof help);
    t.end();
});

test('help simple', function(t) {

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(~msg.indexOf('Usage: mojito <command> [options]'));
        t.ok(msg.indexOf('whoop whoop'));
        t.ok(msg.indexOf('Available commands: create, help, info, version, make-it-rain'));
    }

    t.plan(4);
    help(getEnv(), cb);
});

test('help + mojito commands', function(t) {
    var env = getEnv();

    env.mojito = {commands: ['beep', 'boop', 'create', 'make-it-rain']};

    function cb(err, msg) {
        t.equals(err, null);
        t.equals(msg, 'Usage: mojito <command> [options]\nwhoop whoop\nAvailable commands: beep, boop, create, help, info, make-it-rain, version');
    }

    t.plan(2);
    help(env, cb);
});

test('help nonesuch', function(t) {
    var env = getEnv(['nonesuch']);

    function cb(err, msg) {
        t.equals(err, 'No help available for command nonesuch', 'haz err');
        t.equals(msg, undefined, 'no msg');
    }

    t.plan(2);
    help(env, cb);
});

test('help version', function(t) {
    var env = getEnv(['version']);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^Usage: mojito version/));
    }

    t.plan(2);
    help(env, cb);
});

test('help create', function(t) {
    var env = getEnv(['create']);

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(~msg.indexOf('mojito create'));
    }

    t.plan(2);
    help(env, cb);
});

test('help mock jslint', function(t) {
    var env = {
            args: ['gv'],
            cli: {commands:{}, aliases:{}},
            mojito: {
                commands: ['gv', 'beep', 'boop'],
                commandsPath: resolve(__dirname, 'fixtures/someapp/node_modules/mojito/lib/app/commands')
            }
        };

    function cb(err, msg) {
        t.equal(err, null);
        t.ok(msg.match(/^mock usage for mojito\/lib\/app\/commands\/gv/));
    }

    t.plan(2);
    help(env, cb);
});

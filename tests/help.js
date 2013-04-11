var test = require('tap').test,
    help = require('../commands/help'),
    log = require('../lib/log'),

    resolve = require('path').resolve;


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {
        cli: {
            name: 'mojito-cli',
            version: '1.2.3',
            commands: ['create', 'help', 'info', 'version', 'make-it-rain'],
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
    help([], {}, getMeta(), cb);
});

test('help + mojito commands', function(t) {
    var meta = getMeta();

    meta.mojito = {commands: ['beep', 'boop', 'create', 'make-it-rain']};

    t.plan(5);
    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'Usage: mojito <command> [options]');
        t.equals(log.record.shift().message, 'whoop whoop');
        t.equals(log.record.shift().message, 'Available commands: beep, boop, create, help, info, make-it-rain, version');
        t.equals(log.record.length, 0);
    }

    reset();
    help([], {}, meta, cb);
});

test('help nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'No help available for command nonesuch');
        t.equals(msg, undefined);
    }

    help(['nonesuch'], {}, getMeta(), cb);
});

test('help version', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^Usage: mojito version/));
    }

    help(['version'], {}, {}, cb);
});

test('help create', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^mojito create/));
    }

    help(['create'], {}, {}, cb);
});

test('help mock jslint', function(t) {
    var meta = {
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
    help(['jslint'], {}, meta, cb);
});


var test = require('tap').test,
    resolve = require('path').resolve,
    fn = require('../cli').load;


function noCb(t) {
    return function (err, msg) {
        t.ok((err === undefined) && (msg === undefined), 'no cb params');
    }
}

test('load "version"', function(t) {
    var env = {
            cli:{
                commands:{version:'./commands/version'}
            }
        },
        actual = fn('version', env);

    t.equals(typeof actual, 'function');
    t.equals(typeof actual.usage, 'string');
    t.ok(actual.usage.match(/^Usage: mojito version /));
    t.end();
});

test('load false', function(t) {
    var env = {cli:{commands:{}}},
        actual = fn('foo', env);

    t.equals(actual, false);
    t.end();
});

test('load fail', function(t) {
    var env = {
            cli:{commands:{}},
            mojito: {
                commands: ['foo'],
                commandsPath: '/bar/baz'
            }
        },
        actual = fn('foo', env);

    t.equals(actual, false);
    t.end();
});

test('load i_am_a_bad_module', function(t) {
    var env = {
            cli:{commands:{}},
            mojito: {
                commands: ['i_am_a_bad_module'],
                commandsPath: resolve(__dirname, 'fixtures')
            }
        },
        actual = fn('i_am_a_bad_module', env);

    function require_bad_module() {
        require(resolve(__dirname, 'fixtures', 'i_am_a_bad_module'));
    }

    t.throws(require_bad_module);
    t.equal(actual, false);
    t.end();
});

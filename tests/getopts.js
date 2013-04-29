var test = require('tap').test,
    cfg = require('../config.json').options,
    fn = require('../lib/getopts');


test('config options is an array', function(t) {
    t.ok(Array.isArray(cfg));
    t.ok(cfg.length > 3);
    t.end();
});

test('no args, no configs', function(t) {
    var expected = {
            command: '',
            args: [],
            opts: {},
            orig: {}
        };

    t.same(fn([]), expected);
    t.end();
});

test('help|--help|-h', function(t) {
    var expected = 'help';

    t.same(fn(['help']).command, expected);
    t.same(fn(['--help']).command, expected);
    t.same(fn(['-h']).command, expected);
    t.end();
});

test('version|--version|-v', function(t) {
    var expected = 'version';

    t.same(fn(['version']).command, expected);
    t.same(fn(['--version']).command, expected);
    t.same(fn(['-v']).command, expected);
    t.end();
});

test('command is lowercased', function(t) {
    t.equal(fn(['Version']).command, 'version');
    t.equal(fn(['hELp']).command, 'help');
    t.end();
});

test('options are lowercased', function(t) {
    t.same(fn(['--Version']).opts, {version: true});
    t.same(fn(['--hELp']).opts, {help: true});
    t.end();
});

test('boolean arg', function(t) {
    var argv = ['--version', 'help'],
        actual = fn(argv);

    t.same(actual.command, 'help');
    t.same(actual.opts.version, true);
    t.same(actual.args, []);
    t.end();
});

test('string arg (fail)', function(t) {
    var argv = ['shout', '--directory', 'lights/camera/action'],
        actual = fn(argv);

    t.same(actual.command, 'shout');
    t.same(actual.opts.directory, true); // do not want this
    t.same(actual.args, ['lights/camera/action']);
    t.end();
});

test('string arg (ok)', function(t) {
    var argv = ['shout', '--directory', 'lights/camera/action'],
        actual = fn(argv, cfg);

    t.same(actual.command, 'shout');
    t.same(actual.opts.directory, 'lights/camera/action');
    t.same(actual.args, []);
    t.end();
});

test('string arg (ok) with other args', function(t) {
    var argv = ['--directory', 'lights/camera/action', 'shout', 'aloud'],
        actual = fn(argv, cfg);

    t.same(actual.command, 'shout');
    t.same(actual.opts.directory, 'lights/camera/action');
    t.same(actual.args, ['aloud']);
    t.end();
});

test('test --debug is alias for --loglevel debug', function(t) {
    var argv = ['--debug', 'shout', 'aloud'],
        actual = fn(argv, cfg);

    t.same(actual.command, 'shout');
    t.same(actual.opts.loglevel, 'debug');
    t.same(actual.args, ['aloud']);
    t.end();
});

test('no longNames', function(t) {
    var argv = ['shout', 'aloud'],
        actual = fn(argv, [{a:1}]);

    t.same(actual.command, 'shout');
    t.end();
});

test('have longName, but no shortName', function(t) {
    var argv = ['--Mahershalalhashbaz', 'shout', 'aloud'],
        actual = fn(argv, [{longName:'Mahershalalhashbaz'}]);

    t.same(actual.command, 'shout');
    t.same(actual.opts.mahershalalhashbaz, true);
    t.end();
});

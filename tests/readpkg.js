var test = require('tap').test,
    resolve = require('path').resolve,
    readpkg = require('../lib/readpkg');


function fromhere(relpath) {
    return resolve(__dirname, relpath);
}

test('readpkg exports', function (t) {
    t.equal('function', typeof readpkg);
    t.same(Object.keys(readpkg), ['mojito']);
    t.end();
});

test('read someapp', function(t) {
    var pkg = require('./fixtures/someapp/package.json'),
        actual = readpkg(fromhere('./fixtures/someapp'));

    t.notSame(pkg, actual);
    t.equal(pkg.name, actual.name);
    t.equal(pkg.version, actual.version);
    t.equal(pkg.description, actual.description);
    t.same(pkg.dependencies, actual.dependencies);
    t.end();
});

test('read someapp’s mojito', function(t) {
    var pkg = require('./fixtures/someapp/node_modules/mojito/package.json'),
        actual = readpkg.mojito(fromhere('./fixtures/someapp')),

        cmds = ['build', 'compile', 'create', 'docs', 'gv', 'help', 'info', 'jslint', 'profiler', 'start', 'test', 'version'];

    t.notSame(pkg, actual);
    t.equal(pkg.name, actual.name);
    t.equal(pkg.version, actual.version);
    t.equal(pkg.description, actual.description);
    t.same(pkg.dependencies, actual.dependencies);

    // extra props for mojito
    t.equal(actual.commandsPath, fromhere('./fixtures/someapp/node_modules/mojito/lib/app/commands'));
    t.same(actual.commands.sort(), cmds.sort());
    t.end();
});

test('read incomplete', function(t) {
    var actual = readpkg(fromhere('./fixtures/incomplete'));

    t.equal(actual.name, 'incomplete');
    t.equal(actual.version, '0.2.1');
    t.equal(actual.description, '(missing description)');
    t.same(actual.dependencies, {});
    t.end();
});
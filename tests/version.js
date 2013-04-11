var test = require('tap').test,
    vers = require('../commands/version'),
    log = require('../lib/log');


// buffer log msgs instead of outputing them
log.pause();

function getMeta() {
    return {cli: {name: 'mojito-cli', version: '1.2.3'}};
}

function reset() {
    log.record = [];
    log._buffer = [];
}

test('version exports', function(t) {
    t.equal('function', typeof vers);
    t.equal('string', typeof vers.usage);
    t.end();
});

test('version simple', function(t) {
    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'mojito-cli v1.2.3 ');//<-space
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers([], {}, getMeta(), cb);
});

test('version app', function(t) {
    var meta = getMeta();
    
    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    meta.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'myapp v3.4.5 ');//<-space
        t.equals(log.record.shift().message, 'mojito v0.0.1 (installed locally)');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers(['app'], {}, meta, cb);
});

test('version application', function(t) {
    var meta = getMeta();
    
    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    meta.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.equals(err, undefined);
        t.equals(log.record.shift().message, 'myapp v3.4.5 ');//<-space
        t.equals(log.record.shift().message, 'mojito v0.0.1 (installed locally)');
        t.equals(log.record.length, 0);
        t.end();
    }

    reset();
    vers(['application'], {}, meta, cb);
});

test('version mojit foo', function(t) {
    var meta = getMeta();
    
    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    meta.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        t.equals(log.record.shift().message, 'no package.json found at mojits/foo');
        t.equals(log.record.shift().message, 'Missing package.json.');
        t.equals(log.record.shift().message, vers.usage);
        t.end();
    }

    reset();
    vers(['mojit', 'foo'], {}, meta, cb);
});

test('version mojit (missing mojit name)', function(t) {
    var meta = getMeta();
    
    meta.app = {
        name: 'myapp',
        version: '3.4.5',
        description: 'lorem ipsum delor etc',
        dependencies: {
            mojito: '0.0.1'
        }
    };

    meta.mojito = {
        name: 'mojito',
        version: '0.0.1'
    };

    function cb(err, msg) {
        var m = log.record.shift();
        t.equals(err, undefined);

        t.equals(m.message, 'Please specify a mojit name.');//<-space
        t.equals(m.level, 'error');
        
        t.equals(log.record.shift().message, vers.usage);
        t.end();
    }

    reset();
    vers(['mojit'], {}, meta, cb);
});


test('version nonesuch', function(t) {    
    function cb(err, msg) {
        t.equals(err, undefined);
        t.end();
    }

    reset();
    vers(['kthxbai'], {}, getMeta(), cb);
});


'use strict'

const pino = require('pino-step');

const Log = {
    __level: 'info',
    __pretty: false, 
    __name: require('path').basename(process.argv[1]),
    pino: pino({
        level: 'info',
        name: require('path').basename(process.argv[1]),
        prettyPrint: false,
        safe: true
    })
};

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

//logger.debug(Title, o, o...)

// levels.map(l => {
//     Log[l] = function () {
//         const f = arguments[0];
//         [].shift.call(arguments);  
//         [].unshift.call(arguments, {
//             name: f
//         });
//         Log.pino[l].apply(Log.pino, arguments);
//     }
// });

//logger.debug(o, o...)
levels.map(l => {
    Log[l] = function () {
        Log.pino[l].apply(Log.pino, arguments);
    }
});

Object.defineProperty(Log, 'level', {
    get: function () {
        return Log.__level;
    },
    set: function (l) {
        Log.pino.levelVal = l;
        Log.__level = l;
    }
});

Object.defineProperty(Log, 'pretty', {
    get: function () {
        return Log.__pretty;
    },
    set: function (enabled) {
        Log.__pretty = enabled;
        if (Log.__pretty) {
            Log.pino = pino({
                name: Log.__name,
                prettyPrint: true,
                safe: true
            });
        } else {
            Log.pino = pino({
                name: Log.__name,
                safe: true
            });
        }
        Log.pino.levelVal = Log.__level;
    }
});

Object.defineProperty(Log, 'name', {
    get: function () {
        return Log.__name;
    },
    set: function (name) {
        Log.__name = name;
        if (Log.__pretty) {
            Log.pino = pino({
                name: Log.__name,
                prettyPrint: true,
                safe: true
            });
        } else {
            Log.pino = pino({
                name: Log.__name,
                safe: true
            });
        }
        Log.pino.levelVal = Log.__level;        
    }
})

module.exports = Log;

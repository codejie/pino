'use strict'

const pinoRaw = require('./')();
const pino = require('./')({
    prettyPrint: true,
    name: 'hhhhh'
});


const o2 = {
    o2: 'this is o'
};
const o = {
    o: 'this is o',
    o2: o2
};
const obj = {
    obj1: '',
    obj2: 2,
    obj3: o
};
const err = new Error('this is an error');
// throw err;

pino.levelVal = 'trace';
pinoRaw.levelVal = 'trace';

pino.info({name: 'pino-json'}, 'this is a string message.');
pinoRaw.info({name: 'pino-json'}, 'this is a string message.');

pino.info('this is a string message.');
pinoRaw.info('this is a string message.');

pino.trace('string message', {obj: true}, 42, 'format = %d', 1);
pinoRaw.trace('string message', {obj: true}, 42, 'format = %d', 1);

pino.info(['this', 'is', 'an', 'array']);
pinoRaw.info(['this', 'is', 'an', 'array']);

pino.error(new Error('this is an error.'));
pinoRaw.error(new Error('this is an error.'));

const obj1 = {
    a: 'a',
    b: 1
};
const obj2 = {
    c: ['this', 'is', 'c'],
    d: obj1
};
pino.warn({name: 'object'}, obj1, obj2);
pinoRaw.warn({name: 'object'}, obj1, obj2);


// pinoRaw.info({a: 1,hostname:'host', o: obj}, obj, err, '123');

// pinoRaw.warn([1], obj, 'value = %d', 1.00,2,3,4,5,'aaaa', ["1.01",2,'3', obj], obj);
// pino.debug({name: 'T'}, {a: 1, b: 2});
// pinoRaw.info('what%j', {a:1, b:0}, '123',  obj, err);
// pino.debug({hostname: 'host', mod: 'm', a: 100}, 'what', {a:1, b:0}, 'this is %s', 'nothing', obj, err);
// pinoRaw.info({hostname: 'my' }, err, '333');
// pino.levelVal = 'error';
// pino.levelVal = 'debug';
// pinoRaw.info(err);
// pino.trace({}, 'a=%s', '1');


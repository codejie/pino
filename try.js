'use strict'

const pinoRaw = require('./')();
const pino = require('./')({
    prettyPrint: true
});


const o2 = {
    o2: 'this is o'
};
const o = {
    o: 'this is o',
    o2: o2
};
const obj = {
    obj1: 'object1',
    obj2: 2,
    obj3: o
};
const err = new Error('this is an error');
// throw err;

pino.levelVal = 'debug';
console.log(typeof 1);
console.log([1] instanceof Array);
pino.warn(obj, 'value = %d', 1.00,2,3,4,5,'aaaa', ["1.01",2,'3', obj], obj);
// pino.debug({name: 'T'}, {a: 1, b: 2});
// pinoRaw.info('what%j', {a:1, b:0}, '123',  obj, err);
// pino.debug({hostname: 'host', mod: 'm', a: 100}, 'what', {a:1, b:0}, 'this is %s', 'nothing', obj, err);
// pinoRaw.info({hostname: 'my' }, err, '333');
// pino.levelVal = 'error';
// pino.levelVal = 'debug';
// pinoRaw.info(err);


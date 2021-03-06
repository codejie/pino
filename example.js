'use strict'

var pino = require('./')({
  // prettyPrint: true
  // formatter: function (v) {
  //   return v;
  // }  
})

// pino.info('hello world')
// pino.error('this is at error level')
// pino.info('the answer is %d', 42)
pino.info({ hostname: '111', obj: 42 }, {what: 'hello world'})
pino.info({ hostname: '111', obj: 42 }, 'hello world')
pino.info({ obj: 42, b: 2 }, {aaaa:'aaa'}, 'hello world')
pino.info({ nested: { obj: 42 } }, 'nested',{'ss':0})
setImmediate(function () {
  pino.info('after setImmediate')
})
pino.error(new Error('an error'))

var child = pino.child({ a: 'property' })
child.info('hello child!')

var childsChild = child.child({ another: 'property' })
childsChild.info('hello baby..')

pino.debug('this should be mute')

pino.level = 'trace'

pino.debug('this is a debug statement')

pino.child({ another: 'property' }).debug('this is a debug statement via child')
pino.trace('this is a trace statement')

pino.debug('this is a "debug" statement with "')

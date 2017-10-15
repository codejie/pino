# pino-step base on the pino
pino-step is a fork branch of the `pino` (https://github.com/pinojs/pino), please find more information from `pino's README` (https://github.com/pinojs/pino/blob/master/README.md).

![banner](pino-banner.png)

# pino-step
pino is a very pretty node.js looger, pino-step just updates afew lines base on it.
# Usage
```
npm install --save pino-step
```

# Example
```js
const pinoRaw = require('./')();
const pino = require('./')({
    prettyPrint: true
});

```
## name instead of pid+hostname
as default, pino-step uses name or js script name instead of pid and hostname in pino.
```js
pino.info({name: 'pino-json'}, 'this is a string message.');
pinoRaw.info({name: 'pino-json'}, 'this is a string message.');

pino.info('this is a string message.');
pinoRaw.info('this is a string message.');
```
output
```
>node try.js
[2017-10-15T14:01:25.536Z] INFO [pino-json]:
"this is a string message."
{"pid":14533,"name":"try.js","hostname":"192.168.0.102","level":30,"time":1508076085540,"msg":[{"t":0,"o":"this is a string message."}],"name":"pino-json","v":1}
~/Code/hub/pino[master]>node try.js
[2017-10-15T14:04:02.485Z] INFO [pino-json]:
"this is a string message."
{"pid":14593,"name":"try.js","hostname":"192.168.0.102","level":30,"time":1508076242489,"msg":[{"t":0,"o":"this is a string message."}],"name":"pino-json","v":1}
[2017-10-15T14:04:02.489Z] INFO [try.js]:
"this is a string message."
{"pid":14593,"name":"try.js","hostname":"192.168.0.102","level":30,"time":1508076242489,"msg":[{"t":0,"o":"this is a string message."}],"v":1}
```

## all in msg, and all are an object with type
all log elements are with itself type, and as an object, all of them are included msg part like following object type.
```json
{
  "t": [type],
  "o": [output]
}
```
```js
pino.trace('string message', {obj: true}, 42, 'format = %d', 1);
pinoRaw.trace('string message', {obj: true}, 42, 'format = %d', 1);
```
output
```
[2017-10-15T14:19:32.987Z] TRACE [try.js]:
"string message"
{
  "obj": true
}
42
"format = 1"
{"pid":15397,"name":"try.js","hostname":"192.168.0.102","level":10,"time":1508077172987,"msg":[{"t":0,"o":"string message"},{"t":1,"o":{"obj":true}},{"t":4,"o":42},{"t":0,"o":"format = 1"}],"v":1}
``` 
now pino-step supports the following types.
```js
module.exports = {
    string: 0,
    object: 1,
    error: 2,
    array: 3,
    number: 4
};
```
```js
pino.info(['this', 'is', 'an', 'array']);
pinoRaw.info(['this', 'is', 'an', 'array']);

pino.error(new Error('this is an error.'));
pinoRaw.error(new Error('this is an error.'));
```
output
```
[2017-10-15T14:32:31.466Z] INFO [try.js]:
[
  "this",
  "is",
  "an",
  "array",
]
{"pid":16034,"name":"try.js","hostname":"192.168.0.102","level":30,"time":1508077951467,"msg":[{"t":3,"o":["this","is","an","array"]}],"v":1}
[2017-10-15T14:32:31.467Z] ERROR [try.js]:
Error: this is an error.
    at Object.<anonymous> (/Users/Jie/Code/hub/pino/try.js:39:12)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
    at Function.Module.runMain (module.js:665:10)
    at startup (bootstrap_node.js:201:16)
    at bootstrap_node.js:626:3
{"pid":16034,"name":"try.js","hostname":"192.168.0.102","level":50,"time":1508077951467,"msg":[{"t":2,"o":{"msg":"this is an error.","stack":"Error: this is an error.\n    at Object.<anonymous> (/Users/Jie/Code/hub/pino/try.js:40:15)\n    at Module._compile (module.js:624:30)\n    at Object.Module._extensions..js (module.js:635:10)\n    at Module.load (module.js:545:32)\n    at tryModuleLoad (module.js:508:12)\n    at Function.Module._load (module.js:500:3)\n    at Function.Module.runMain (module.js:665:10)\n    at startup (bootstrap_node.js:201:16)\n    at bootstrap_node.js:626:3"}}],"v":1}
```
## more complex object
pino-step supports to record and output more complex object log.
```js
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

```
output
```
[2017-10-15T14:40:58.469Z] WARN [object]:
{
  "a": "a",
  "b": 1
}
{
  "c": [
    "this",
    "is",
    "c"
  ],
  "d": {
    "a": "a",
    "b": 1
  }
}
{"pid":16661,"name":"try.js","hostname":"192.168.0.102","level":40,"time":1508078458469,"msg":[{"t":1,"o":{"a":"a","b":1}},{"t":1,"o":{"c":["this","is","c"],"d":{"a":"a","b":1}}}],"name":"object","v":1}
```
## more arguments
pino-step can take more arguments than 11 that pino takes.

tools.js in pino-step
```js
function genLog (z) {
  return function LOG () {
    var m = arguments[0];
    ...
```
tools.js in pino
```js
function genLog (z) {
  return function LOG (a, b, c, d, e, f, g, h, i, j, k) {
     var l = 0
     ...
```

# more
pino-step is just a fork of [pino](https://github.com/pinojs/pino), please find more in pino pages.

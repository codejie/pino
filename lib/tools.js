'use strict'

var flatstr = require('flatstr')
var format = require('quick-format-unescaped')
var util = require('util')
var pid = process.pid
var os = require('os')
var hostname = os.hostname()
var name = require('path').basename(process.argv[1]);
var baseLog = flatstr('{"pid":' + pid + ',"name":"' + name + '","hostname":"' + hostname + '",')
var levels = require('./levels')
var serializers = require('./serializers')
var isStandardLevelVal = levels.isStandardLevelVal
var isStandardLevel = levels.isStandardLevel

function noop () {}

function copy (a, b) {
  for (var k in b) { a[k] = b[k] }
  return a
}

function applyOptions (self, opts) {
  self.serializers = opts.serializers
  self.chindings = opts.chindings

  if (opts.level && opts.levelVal) {
    var levelIsStandard = isStandardLevel(opts.level)
    var valIsStandard = isStandardLevelVal(opts.levelVal)
    if (valIsStandard) throw Error('level value is already used: ' + opts.levelVal)
    if (levelIsStandard === false && valIsStandard === false) self.addLevel(opts.level, opts.levelVal)
  }
  self._setLevel(opts.level)
  var str = baseLog +
    (self.name === undefined ? '' : '"name":' + self.stringify(self.name) + ',')
  Number(str)
  self._baseLog = str
}

function defineLevelsProperty (onObject) {
  Object.defineProperty(onObject, 'levels', {
    value: {
      values: copy({}, levels.levels),
      labels: copy({}, levels.nums)
    },
    enumerable: true
  })
  Object.defineProperty(onObject.levels.values, 'silent', {value: Infinity})
  Object.defineProperty(onObject.levels.labels, Infinity, {value: 'silent'})
}

function streamIsBlockable (s) {
  if (s.hasOwnProperty('_handle') && s._handle.hasOwnProperty('fd') && s._handle.fd) return true
  if (s.hasOwnProperty('fd') && s.fd) return true
  return false
}

function countInterp (s, i) {
  var n = 0
  var pos = 0
  while (true) {
    pos = s.indexOf(i, pos)
    if (pos >= 0) {
      ++n
      pos += 2
    } else break
  }
  return n
}

function genLog (z) {
  return function LOG () {
    var m = arguments[0];
    var n = null;
    if (typeof m === 'object' && m !== null && !(m instanceof Error) && !(m instanceof Array)) {
      n = Array.prototype.slice.call(arguments, 1);
    } else {
      m = null;
      n = Array.prototype.slice.call(arguments, 0);
    }

    var output = [];
    var l = n.length;
    while (l > 0) {
      var o = n[0];
      if (typeof o === 'string') {
        var c = countInterp(o, '%d') + countInterp(o, '%s') + countInterp(o, '%j');
        if (c > 0) {
          output.push(util.format.apply(null, n.slice(0, c + 1)));
        } else {
          output.push(o);
        }
        n = n.slice(c + 1);
      } else {
          output.push(o);
          n = n.slice(1);          
      }
      l = n.length;
    }

    this.write(m, output, z);
  }
}

module.exports = {
  noop: noop,
  copy: copy,
  applyOptions: applyOptions,
  defineLevelsProperty: defineLevelsProperty,
  streamIsBlockable: streamIsBlockable,
  genLog: genLog
}

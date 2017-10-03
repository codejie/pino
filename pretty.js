'use strict'

var split = require('split2')
var Parse = require('fast-json-parse')
var chalk = require('chalk')
var format = require('quick-format-unescaped')

var standardLevels = require('./lib/levels');

var levels = {
  default: 'USERLVL',
  60: 'FATAL',
  50: 'ERROR',
  40: 'WARN',
  30: 'INFO',
  20: 'DEBUG',
  10: 'TRACE'
}

var standardKeys = [
  'pid',
  'hostname',
  'name',
  'level',
  'time',
  'v'
]

function withSpaces (value) {
  var lines = value.split('\n')
  for (var i = 1; i < lines.length; i++) {
    lines[i] = '    ' + lines[i]
  }
  return lines.join('\n')
}

function filter (value, messageKey) {
  var keys = Object.keys(value)
  var filteredKeys = standardKeys.concat([messageKey])
  var result = ''

  for (var i = 0; i < keys.length; i++) {
    if (filteredKeys.indexOf(keys[i]) < 0) {
      result += '    ' + keys[i] + ': ' + withSpaces(JSON.stringify(value[keys[i]], null, 2)) + '\n'
    }
  }

  return result
}

function filterBase (value, messageKey) {
  var keys = Object.keys(value)
  var filteredKeys = standardKeys.concat([messageKey])

  var ret = {};
  keys.map(function (key) {
    if (filteredKeys.indexOf(key) < 0) {
      ret[key] = value[key];
    }
  });

  if (Object.keys(ret).length > 0) {
    return ret;
  } else {
    return null;
  }
}

function isPinoLine (line) {
  return line &&
    line.hasOwnProperty('hostname') &&
    line.hasOwnProperty('pid') &&
    (line.hasOwnProperty('v') && line.v === 1)
}

function pretty (opts) {
  var timeTransOnly = opts && opts.timeTransOnly
  var formatter = opts && opts.formatter
  var levelFirst = opts && opts.levelFirst
  var messageKey = opts && opts.messageKey
  var forceColor = opts && opts.forceColor
  var showBase = opts && opts.showBase;
  var showHostname = opts && opts.showHostname;
  var filterLevel = ((opts && opts.filterLevel) ? opts.filterLevel : 'trace');
  messageKey = messageKey || 'msg'

  if (standardLevels.isStandardLevel(filterLevel)) {
    filterLevel = standardLevels.levels[filterLevel];
  } else {
    filterLevel = 0;
  }

  var stream = split(mapLine)
  var ctx
  var levelColors

  var pipe = stream.pipe

  stream.pipe = function (dest, opts) {
    ctx = new chalk.constructor({
      enabled: !!((chalk.supportsColor && dest.isTTY) || forceColor)
    })

    if (forceColor && ctx.level === 0) {
      ctx.level = 1
    }

    levelColors = {
      default: ctx.white,
      60: ctx.bgRed,
      50: ctx.red,
      40: ctx.yellow,
      30: ctx.green,
      20: ctx.blue,
      10: ctx.grey
    }

    return pipe.call(stream, dest, opts)
  }

  return stream

  function mapLine (line) {
    var parsed = new Parse(line)
    var value = parsed.value

    if (filterLevel > value.level) {
      return;
    }

    if (parsed.err || !isPinoLine(value)) {
      // pass through
      return line + '\n'
    }

    if (formatter) {
      return opts.formatter(parsed.value) + '\n'
    }

    if (timeTransOnly) {
      value.time = asISODate(value.time)
      return JSON.stringify(value) + '\n'
    }

    line = (levelFirst)
        ? asColoredLevel(value) + ' ' + formatTime(value)
        : formatTime(value, ' ') + asColoredLevel(value)

    if (showHostname) {
      line += ' ('
      if (value.name) {
        line += value.name + '/'
      }
        
      line += value.pid + ' on ' + value.hostname + ')'
      line += ':'
    } else {
      line += ' [' + (value.name ? value.name : value.pid) + ']:';      
    }

    if (showBase) {
      var base = filterBase(value, messageKey);
      if (base) {
        line += '\n' + JSON.stringify(base, null, 2);
      }
    }

    if (value[messageKey]) {
      line += ctx.cyan(msgToString(value[messageKey]));
    }
    line += '\n'
    return line
  }

  function msgToString(msg) {
    var ret = '';
    msg.map(function (m) {
      if (m.t === 's') {
        ret += '\n' + asString(m.o);
      } else if (m.t === 'o') {
        ret += '\n' + asObject(m.o);
      } else if (m.t === 'e') {
        ret += '\n' + asError(m.o);
      } else if (m.t == 'a') {
        ret += '\n' + asArray(m.o);
      } else {
        ret += '\n' + asObject(m.o);
      }
    });
    return ret;
  }

  function asObject (obj) {
    return JSON.stringify(obj, null, 2);
  }

  function asString (str) {
    return '"' + str + '"';
  }

  function asError (err) {
    return err.stack;
  }

  function asArray (arr) {
    var ret = '[';
    arr.map(function (a) {
      if (typeof a === 'string') {
        ret += '\n  ' + asString(a) + ',';
      // } else if (typeof a == 'number') {
      //   ret += '\n  ' + asNumber(a) + ',';
      } else {
        if (a instanceof Array) {
          ret += '\n  ' + asArray(a) + ',';
        } else if (a instanceof Error) {
          ret += '\n  ' + asError(a) + ',';
        } else {
          ret += '\n  ' + asObject(a) + ',';
        }
      }
    });
    ret += '\n]';
    return ret;
  }

  function asNumber (num) {
    return num.toString();
  }

  function asISODate (time) {
    return new Date(time).toISOString()
  }

  function formatTime (value, after) {
    after = after || ''
    try {
      if (!value || !value.time) {
        return ''
      } else {
        return '[' + asISODate(value.time) + ']' + after
      }
    } catch (_) {
      return ''
    }
  }

  function asColoredLevel (value) {
    if (levelColors.hasOwnProperty(value.level)) {
      return levelColors[value.level](levels[value.level])
    } else {
      return levelColors.default(levels.default)
    }
  }
}

module.exports = pretty

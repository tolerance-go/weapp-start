'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _signale = require('signale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var custom = new _signale.Signale({
  types: {
    remove: {
      badge: '💥 ',
      color: 'magenta',
      label: 'REMOVE'
    },
    add: {
      badge: '🌶️ ',
      color: 'yellowBright',
      label: 'ADD'
    },
    change: {
      badge: '🌱 ',
      color: 'greenBright',
      label: 'CHANGE'
    },
    error: {
      badge: '💊 ',
      color: 'red',
      label: 'EXCEPTION'
    },
    transform: {
      badge: '⭐ ',
      color: 'blue',
      label: 'TRANSFORM'
    },
    extra: {
      badge: '🥕 ',
      color: 'cyan',
      label: 'EXTRA'
    },
    warn: {
      badge: '😑 ',
      color: 'magentaBright',
      label: 'warn'
    }
  }
});

var log = {
  extra: function extra(message) {
    this.print('extra', message);
  },
  transform: function transform(message) {
    this.print('transform', message);
  },
  error: function error(message) {
    this.print('error', message);
  },
  warn: function warn(message) {
    this.print('warn', message);
  },
  change: function change(message) {
    this.print('change', message);
  },
  add: function add(message) {
    this.print('add', message);
  },
  remove: function remove(message) {
    this.print('remove', message);
  },
  print: function print(type, message) {
    custom[type]({ prefix: _chalk2.default.dim('[' + (0, _dayjs2.default)().format('HH:mm:ss') + ']'), message: message });
  }
};

exports.default = log;
module.exports = exports['default'];
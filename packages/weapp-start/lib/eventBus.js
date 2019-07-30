'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventBus = {
  _listeners: {},
  _eventCache: {},
  takeLast: function takeLast(type) {
    if (this._eventCache.hasOwnProperty(type)) {
      return _promise2.default.resolve(this._eventCache[type]);
    }
    return this.take(type);
  },
  take: function take(type) {
    var _this = this;

    return new _promise2.default(function (resolve, reject) {
      try {
        var un = _this.listen(type, function (payload) {
          resolve(payload);
          un();
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  listen: function listen(type, cb, scope) {
    var _this2 = this;

    var index = void 0;
    if (typeof this._listeners[type] !== 'undefined') {
      index = this._listeners.length;
      this._listeners[type].push({ scope: scope, cb: cb });
    } else {
      index = 0;
      this._listeners[type] = [{ scope: scope, cb: cb }];
    }
    var unListen = function unListen() {
      _this2._listeners[type].splice(index, 1);
    };
    return unListen;
  },
  emit: function emit(type, payload) {
    this._eventCache[type] = payload;
    var listeners = this._match(type);
    if (typeof listeners === 'undefined') return;
    listeners.forEach(function (listen) {
      listen.cb.call(listen.scope, payload);
    });
  },
  _match: function _match(type) {
    for (var key in this._listeners) {
      if (new RegExp(key).test(type)) {
        return this._listeners[key];
      }
    }
  }
};

exports.default = eventBus;
module.exports = exports['default'];
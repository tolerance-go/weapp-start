'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* global wx */
wx.$ = {};

var MAX_REQUEST = 10;

var RequestMQ = {
  map: {},
  mq: [],
  running: [],
  push: function push(param) {
    param.t = +new Date();
    while (this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1) {
      param.t += (Math.random() * 10) >> 0;
    }
    this.mq.push(param.t);
    this.map[param.t] = param;
  },
  next: function next() {
    var _this = this;

    if (this.mq.length === 0) return;

    if (this.running.length < MAX_REQUEST - 1) {
      var newone = this.mq.shift();
      var obj = this.map[newone];
      var oldComplete = obj.complete;
      obj.complete = function() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.running.splice(_this.running.indexOf(obj.t), 1);
        delete _this.map[obj.t];
        oldComplete && oldComplete.apply(obj, args);
        _this.next();
      };
      this.running.push(obj.t);
      return wx.request(obj);
    }
  },
  request: function request(obj) {
    obj = obj || {};
    obj = typeof obj === 'string' ? { url: obj } : obj;

    this.push(obj);

    return this.next();
  },
};

var center = {
  _addons: {},

  _interceptors: {},

  _initAPI: function _initAPI(noPromiseAPI) {
    var self = this;
    var noPromiseMethods = {
      // 媒体
      stopRecord: true,
      getRecorderManager: true,
      pauseVoice: true,
      stopVoice: true,
      pauseBackgroundAudio: true,
      stopBackgroundAudio: true,
      getBackgroundAudioManager: true,
      createAudioContext: true,
      createInnerAudioContext: true,
      createVideoContext: true,
      createCameraContext: true,

      // 位置
      createMapContext: true,

      // 设备
      canIUse: true,
      startAccelerometer: true,
      stopAccelerometer: true,
      startCompass: true,
      stopCompass: true,
      onBLECharacteristicValueChange: true,
      onBLEConnectionStateChange: true,

      // 界面
      hideToast: true,
      hideLoading: true,
      showNavigationBarLoading: true,
      hideNavigationBarLoading: true,
      navigateBack: true,
      createAnimation: true,
      pageScrollTo: true,
      createSelectorQuery: true,
      createCanvasContext: true,
      createContext: true,
      drawCanvas: true,
      hideKeyboard: true,
      stopPullDownRefresh: true,

      // 拓展接口
      arrayBufferToBase64: true,
      base64ToArrayBuffer: true,
    };

    if (noPromiseAPI) {
      noPromiseAPI.forEach(function(v) {
        return (noPromiseMethods[v] = true);
      });
    }

    (0, _keys2.default)(wx).forEach(function(key) {
      if (!noPromiseMethods[key] && key.substr(0, 2) !== 'on' && !/\w+Sync$/.test(key)) {
        (0, _defineProperty2.default)(wx.$, key, {
          get: function get() {
            return function(obj) {
              obj = obj || {};
              if (self._interceptors[key] && self._interceptors[key].config) {
                var rst = self._interceptors[key].config.call(self, obj);
                if (rst === false) {
                  if (self._addons.promisify) {
                    return _promise2.default.reject(new Error('aborted by interceptor'));
                  } else {
                    obj.fail && obj.fail('aborted by interceptor');
                    return;
                  }
                }
                obj = rst;
              }
              if (key === 'request') {
                obj = typeof obj === 'string' ? { url: obj } : obj;
              }
              if (typeof obj === 'string') {
                return wx[key](obj);
              }
              if (self._addons.promisify) {
                var task = void 0;
                var p = new _promise2.default(function(resolve, reject) {
                  var bak = {};
                  ['fail', 'success', 'complete'].forEach(function(k) {
                    bak[k] = obj[k];
                    obj[k] = function(res) {
                      if (self._interceptors[key] && self._interceptors[key][k]) {
                        res = self._interceptors[key][k].call(self, res);
                      }
                      if (k === 'success') resolve(res);
                      else if (k === 'fail') reject(res);
                    };
                  });
                  if (self._addons.requestfix && key === 'request') {
                    RequestMQ.request(obj);
                  } else {
                    task = wx[key](obj);
                  }
                });
                if (key === 'uploadFile' || key === 'downloadFile') {
                  p.progress = function(cb) {
                    task.onProgressUpdate(cb);
                    return p;
                  };
                  p.abort = function(cb) {
                    cb && cb();
                    task.abort();
                    return p;
                  };
                }
                return p;
              } else {
                var bak = {};
                ['fail', 'success', 'complete'].forEach(function(k) {
                  bak[k] = obj[k];
                  obj[k] = function(res) {
                    if (self._interceptors[key] && self._interceptors[key][k]) {
                      res = self._interceptors[key][k].call(self, res);
                    }
                    bak[k] && bak[k].call(self, res);
                  };
                });
                if (self._addons.requestfix && key === 'request') {
                  RequestMQ.request(obj);
                } else {
                  return wx[key](obj);
                }
              }
            };
          },
        });
      } else {
        (0, _defineProperty2.default)(wx.$, key, {
          get: function get() {
            return function() {
              for (
                var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                args[_key2] = arguments[_key2];
              }

              return wx[key].apply(wx, args);
            };
          },
        });
      }
    });
  },
  _use: function _use(addon) {
    if (typeof addon === 'string') {
      this._addons[addon] = true;
    }
  },
  _intercept: function _intercept(api, provider) {
    this._interceptors[api] = provider;
  },
  init: function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var noPromiseAPI = config.noPromiseAPI,
      requestfix = config.requestfix,
      promisify = config.promisify,
      intercepts = config.intercepts;

    if (requestfix) {
      this._use('requestfix');
    }
    if (promisify) {
      this._use('promisify');
    }
    this._initAPI(noPromiseAPI);
    for (var k in intercepts) {
      this._intercept(k, intercepts[k]);
    }
  },
};

exports.default = center;
module.exports = exports['default'];

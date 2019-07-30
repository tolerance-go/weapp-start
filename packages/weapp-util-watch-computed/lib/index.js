'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whcPage = exports.whcComponent = exports.whc = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var set = function set(obj, path, val) {
  var paths = path.split('.');
  return paths.reduce(function (obj, name, index) {
    if (paths.length - 1 === index) {
      return obj[name] = val;
    }
    if (!obj[name]) {
      obj[name] = {};
    }
    return obj[name];
  }, obj);
};

// eslint-disable-next-line
var get = function get(obj, path) {
  var paths = path.split('.');
  return paths.reduce(function (obj, name, index) {
    if (paths.length - 1 === index) {
      return obj[name];
    }
    if (!obj[name]) {
      return;
    }
    return obj[name];
  }, obj);
};

var normalizalProperties = function normalizalProperties(properties) {
  for (var prop in properties) {
    if (!properties.hasOwnProperty(prop)) continue;
    var meta = properties[prop];
    if ((typeof meta === 'undefined' ? 'undefined' : (0, _typeof3.default)(meta)) !== 'object') {
      properties[prop] = {
        type: meta
      };
    }
  }
};

var getNormalizalPropertiesValue = function getNormalizalPropertiesValue(properties) {
  var data = {};
  for (var prop in properties) {
    if (!properties.hasOwnProperty(prop)) continue;
    data[prop] = properties[prop].value;
  }
  return data;
};

var whc = function whc(_ref) {
  var name = _ref.name;
  return function (opts) {
    var methodName = '$setData';
    var isCom = name === 'component';
    var path = isCom ? 'methods' : '';
    var initHook = isCom ? 'attached' : 'onReady';

    var hookCalled = false;
    var fullPath = path;

    if (!path) {
      fullPath = methodName;
    } else {
      fullPath += '.' + methodName;
    }

    set(opts, fullPath, $setData);

    if (isCom && opts.properties) {
      var properties = opts.properties;
      normalizalProperties(properties);

      var _loop = function _loop(prop) {
        if (!properties.hasOwnProperty(prop)) return 'continue';
        var meta = properties[prop];
        if (meta.observer) {
          var oldOb = meta.observer;
          meta.observer = function (newVal, oldVal) {
            var result = oldOb.apply(this, arguments);
            observerRender.call(this, newVal, oldVal, prop);
            return result;
          };
        } else {
          meta.observer = function (newVal, oldVal) {
            // 接口 data 发生变化的时候，此时 this.data 已经改变了
            observerRender.call(this, newVal, oldVal, prop);
          };
        }
      };

      for (var prop in properties) {
        var _ret = _loop(prop);

        if (_ret === 'continue') continue;
      }
    }

    var oldReady = opts[initHook];
    if (isCom) {
      opts[initHook] = function () {
        hookCalled = true;
        // this.data 的顺序置于最后，因为 observer 的执行早于 hook，observer 执行之后，内部 this.data 已经修改
        var data = (0, _assign2.default)({}, getNormalizalPropertiesValue(opts.properties), this.data);

        var result = oldReady && oldReady.apply(this, arguments);
        for (var k in data) {
          if (data[k] === undefined) {
            delete data[k];
          }
        }
        // ~~计算属性依赖 properties 的数据的初始化交由自身的 observer 来完成~~
        // 当外部一开始没有传值的时候，observer 是不会调用，因此这边主动将 properties 融入 data
        $setData.call(this, data, 'force');
        return result;
      };
    } else {
      opts[initHook] = function () {
        var result = oldReady && oldReady.apply(this, arguments);
        $setData.call(this, this.data, 'force');
        return result;
      };
    }

    function observerRender(newVal, oldVal, prop) {
      // observer 执行之后，this.data 里面的值已经变了
      if (!hookCalled) {
        return;
      }
      if (newVal !== oldVal) {
        $setData.call(this, (0, _defineProperty3.default)({}, prop, newVal), 'force');
      }
    }

    function $setData(newData, force) {
      var _this = this;

      var oldData = this.data;

      if (opts.watch) {
        for (var prop in opts.watch) {
          if (!opts.watch.hasOwnProperty(prop)) continue;

          var newVal = newData[prop];
          var oldVal = oldData[prop];

          var changed = newData.hasOwnProperty(prop) && newVal !== oldVal;
          if (force || changed) {
            opts.watch[prop].call(this, newVal, oldVal);
          }
        }
      }

      if (opts.computed) {
        var _loop2 = function _loop2(_prop) {
          var item = opts.computed[_prop];
          var denpendsField = item.slice(0, item.length - 1);
          var compute = item[item.length - 1];
          var denpendsVal = [];

          if (denpendsField.some(function (field) {
            return newData.hasOwnProperty(field);
          })) {
            var hasChangeds = [];
            denpendsField.forEach(function (field) {
              var changed = false;
              var newVal = newData[field];
              var oldVal = oldData[field];
              if (newData.hasOwnProperty(field)) {
                if (newVal !== oldVal) {
                  changed = true;
                }
              }
              hasChangeds.push(changed);
              denpendsVal.push(changed ? newVal : oldVal);
            });

            if (force || hasChangeds.some(function (changed) {
              return changed;
            })) {
              var updatedVal = compute.apply(_this, denpendsVal);
              newData[_prop] = updatedVal;
            }
          }
        };

        for (var _prop in opts.computed) {
          _loop2(_prop);
        }
      }

      return this.setData(newData);
    }

    return opts;
  };
};

var whcComponent = whc({ name: 'component' });
var whcPage = whc({ name: 'page' });

exports.whc = whc;
exports.whcComponent = whcComponent;
exports.whcPage = whcPage;
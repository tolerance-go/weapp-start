'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _eventBus = require('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _extra = require('./extra');

var _extra2 = _interopRequireDefault(_extra);

var _byDependPaths = require('./byDependPaths');

var _byDependPaths2 = _interopRequireDefault(_byDependPaths);

var _path = require('path');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _save = require('./utils/save');

var _getFileObj = require('./getFileObj');

var _getFileObj2 = _interopRequireDefault(_getFileObj);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var cwd = process.cwd();

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(undefined, arguments));
    };
  });
}

function generateTransform(config, pluginMode, postHandleMode) {
  // 准备 API
  var middlewareAPI = {
    config: config,
    log: _log2.default,
    eventBus: _eventBus2.default,
    byDependPaths: _byDependPaths2.default,
  };

  var middlewares = config.resolvedPlugins;

  // 生成transform plugin
  if (pluginMode === 'extra') {
    middlewares = middlewares.filter(function(plg) {
      return plg.config.extra;
    });
  }

  var chain = middlewares.map(function(middleware) {
    return middleware.plugin(
      (0, _extends3.default)({}, middlewareAPI, { pluginConfig: middleware.config })
    );
  });

  // post file handle
  var effectPostHandle = function effectPostHandle(file) {
    var resolvedDist = config.resolvedDist,
      resolvedSrc = config.resolvedSrc;
    var path = file.path;

    _log2.default.transform('' + path.replace(cwd + '/', ''));

    // extra
    (0, _extra2.default)(file.extra, config);

    // throw
    if (!file.throw) {
      var customResolvedDistPath = (0, _path.join)(
        resolvedDist,
        (0, _path.parse)((0, _path.relative)(resolvedSrc, path)).dir,
        '' + file.name + file.ext
      );
      (0, _save.saveWrite)(customResolvedDistPath, file.contents);
    }

    // depends
    var depends = _byDependPaths2.default.getDepends(path);
    if (depends.length) {
      depends.forEach(function(dependResolvedSrcPath) {
        var dependResolvedDistPath = (0, _path.join)(
          resolvedDist,
          (0, _path.relative)(resolvedSrc, dependResolvedSrcPath)
        );
        transform((0, _getFileObj2.default)(dependResolvedSrcPath, dependResolvedDistPath));
      });
    }
  };

  var rawPostHandle = function rawPostHandle(file) {
    return _log2.default.transform('' + file.path.replace(cwd + '/', ''));
  };

  var transform = compose.apply(undefined, (0, _toConsumableArray3.default)(chain))(
    postHandleMode === 'effect' ? effectPostHandle : rawPostHandle // noop
  );

  return transform;
}

exports.default = generateTransform;
module.exports = exports['default'];

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _path = require('path');

var _resolveCwd = require('resolve-cwd');

var _resolveCwd2 = _interopRequireDefault(_resolveCwd);

var _fs = require('fs');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _assert = require('./utils/assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var getRootCfg = function getRootCfg() {
  var pts = [(0, _path.join)(cwd, 'weapp.config.js'), (0, _path.join)(cwd, 'weapp-config.js')];
  var existPt = void 0;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pts), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pt = _step.value;

      if ((0, _fs.existsSync)(pt)) {
        existPt = pt;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  (0, _assert2.default)(existPt, 'weapp-config.js cannot find');

  var config = require(existPt);
  return config.default || config;
};

var resolvePkg = function resolvePkg(plg) {
  var plgConfig = {};
  if (Array.isArray(plg)) {
    plgConfig = plg[1];
    // order attention
    plg = plg[0];
  }
  var resolvedPath = (0, _resolveCwd2.default)(plg);
  if (!(0, _fs.existsSync)(resolvedPath)) _log2.default.error('npm ' + plg + ' not find, please install first');
  var npm = require(resolvedPath);
  return {
    name: plg,
    config: plgConfig,
    plugin: npm.default || npm
  };
};

var config = void 0;
function getConfig(mode) {
  if (config) return config;
  config = (0, _extends3.default)({
    mode: mode,
    cwd: cwd,
    src: 'src',
    dist: 'dist',
    plugins: [],
    env: {}
  }, getRootCfg(), {
    resolvedPlugins: []
  });

  config.resolvedSrc = (0, _path.join)(cwd, config.src);
  config.resolvedDist = (0, _path.join)(cwd, config.dist);

  var dev = mode === 'dev';
  process.env.NODE_ENV = dev ? 'development' : 'production';

  var resolvedPlugins = config.plugins.map(resolvePkg);

  var envConfig = config.env[process.env.NODE_ENV];
  if (envConfig && envConfig.plugins) {
    (0, _assert2.default)(Array.isArray(envConfig.plugins), 'plugins type must be Array');
    resolvedPlugins = resolvedPlugins.concat(envConfig.plugins.map(resolvePkg));
  }

  config.resolvedPlugins = resolvedPlugins;
  return config;
}

exports.default = getConfig;
module.exports = exports['default'];
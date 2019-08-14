'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _assert = require('./utils/assert');

var _assert2 = _interopRequireDefault(_assert);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _save = require('./utils/save');

var _getFileObj = require('./getFileObj');

var _getFileObj2 = _interopRequireDefault(_getFileObj);

var _fs = require('fs');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var cwd = process.cwd();

function extra(extraPaths, config) {
  var middlewares = config.resolvedPlugins.filter(function(plg) {
    return plg.config.extra;
  });

  for (var resolvedDistPath in extraPaths) {
    if (!extraPaths.hasOwnProperty(resolvedDistPath)) continue;

    if ((0, _fs.existsSync)(resolvedDistPath)) continue;

    var _extraPaths$resolvedD = extraPaths[resolvedDistPath],
      contents = _extraPaths$resolvedD.contents,
      noProcess = _extraPaths$resolvedD.noProcess;

    (0, _assert2.default)(Buffer.isBuffer(contents), 'extra file contents must be a Buffer');

    _log2.default.extra('' + resolvedDistPath.replace(cwd + '/', ''));

    if (!noProcess && middlewares.length) {
      var file = (0, _getFileObj2.default)(resolvedDistPath, resolvedDistPath, contents);
      config.rawExtraTransform(file);
      (0, _save.saveWrite)(resolvedDistPath, file.contents);
    } else {
      (0, _save.saveWrite)(resolvedDistPath, contents);
    }
  }
}

exports.default = extra;
module.exports = exports['default'];

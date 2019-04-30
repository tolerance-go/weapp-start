'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (0, _weappUtilCreatePlugin2.default)({
  encoding: 'utf8',
})(function(file, next, plgConfig, utils) {
  var config = plgConfig.config;
  if (!Array.isArray(config)) {
    config = [config];
  }
  config.forEach(function(item) {
    var find = item.find,
      replace = item.replace;

    file.contents = file.contents.replace(find, replace);
  });
  next(file);
});
module.exports = exports['default'];

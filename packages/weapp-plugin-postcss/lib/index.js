'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.wxss$/,
  encoding: 'utf8',
})(function(file, next, plgConfig, utils) {
  (0, _postcss2.default)(plgConfig.plugins)
    .process(file.contents, {
      from: undefined,
    })
    .then(function(res) {
      file.contents = res.css;
      next(file);
    });
});
module.exports = exports['default'];

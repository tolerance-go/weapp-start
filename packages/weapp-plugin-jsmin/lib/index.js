'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.js$/,
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  var result = _uglifyJs2.default.minify(file.contents, plgConfig);
  if (result.error) throw result.error;
  file.contents = result.code;
  next(file);
});
module.exports = exports['default'];
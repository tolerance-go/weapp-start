'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babel = require('babel-core');
exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.js$/
})(function (file, next, plgConfig, utils) {
  var contents = babel.transformFileSync(file.path, plgConfig).code;
  file.contents = Buffer.from(contents);
  next(file);
});
module.exports = exports['default'];
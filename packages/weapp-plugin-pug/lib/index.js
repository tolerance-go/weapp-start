'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.wxml$/,
  afterExt: '.wxml',
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  file.contents = _pug2.default.render(file.contents, plgConfig);
  next(file);
});
module.exports = exports['default'];
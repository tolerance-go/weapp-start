'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _eslint = require('eslint');

var _eslint2 = _interopRequireDefault(_eslint);

var _eslintFriendlyFormatter = require('eslint-friendly-formatter');

var _eslintFriendlyFormatter2 = _interopRequireDefault(_eslintFriendlyFormatter);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.js$/
})(function (file, next, plgConfig, utils) {
  if (!plgConfig.formatter) {
    plgConfig.formatter = _eslintFriendlyFormatter2.default;
  }
  var engine = new _eslint2.default.CLIEngine(plgConfig);
  var report = engine.executeOnFiles([file.path]);
  var _formatter = engine.getFormatter();
  var rst = _formatter(report.results);
  if (rst) {
    console.log(rst);
  }
  next(file);
});
module.exports = exports['default'];
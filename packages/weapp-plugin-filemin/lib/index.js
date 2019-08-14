'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prettyData = require('pretty-data');

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.(wxml|json|wxss)$/,
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  switch (file.ext) {
    case '.wxml':
      file.contents = _prettyData.pd.xmlmin(file.contents);
      break;
    case '.json':
      file.contents = _prettyData.pd.jsonmin(file.contents);
      break;
    case '.wxss':
      file.contents = _prettyData.pd.cssmin(file.contents);
      break;
  }
  next(file);
});
module.exports = exports['default'];
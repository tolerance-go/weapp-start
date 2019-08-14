'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (resolvedSrcPath, resolvedDistPath, contents) {
  contents = contents || (0, _fs.readFileSync)(resolvedSrcPath);
  var file = (0, _extends3.default)({}, (0, _path.parse)(resolvedSrcPath), {
    contents: contents,
    path: resolvedSrcPath,
    dist: resolvedDistPath,
    extra: {}
  });

  return file;
};

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
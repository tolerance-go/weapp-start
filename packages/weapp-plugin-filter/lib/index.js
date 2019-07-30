'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)()(function (file, next, plgConfig, utils) {
  if (plgConfig.throw) {
    var match = typeof plgConfig.throw === 'function' ? plgConfig.throw() : plgConfig.throw;
    if (file.path.match(match)) {
      file.throw = true;
    }
  }
  next(file);
});
module.exports = exports['default'];
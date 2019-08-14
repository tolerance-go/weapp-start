'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.wxss$/,
  afterExt: '.wxss',
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  (0, _stylus2.default)(file.contents).set('filename', file.path).deps().forEach(function (byDependPath) {
    utils.byDependPaths.push({
      byDependPath: byDependPath,
      dependPath: file.path
    });
  });

  plgConfig.filename = file.path;
  _stylus2.default.render(file.contents, plgConfig, function (err, css) {
    if (err) {
      throw err;
    }
    file.contents = css;
    next(file);
  });
});
module.exports = exports['default'];
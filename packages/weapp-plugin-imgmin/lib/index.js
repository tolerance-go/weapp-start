'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _imagemin = require('imagemin');

var _imagemin2 = _interopRequireDefault(_imagemin);

var _imageminMozjpeg = require('imagemin-mozjpeg');

var _imageminMozjpeg2 = _interopRequireDefault(_imageminMozjpeg);

var _imageminPngquant = require('imagemin-pngquant');

var _imageminPngquant2 = _interopRequireDefault(_imageminPngquant);

var _imageminSvgo = require('imagemin-svgo');

var _imageminSvgo2 = _interopRequireDefault(_imageminSvgo);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.(jpg|png|svg)$/,
})(function(file, next, plgConfig, utils) {
  var defaultConfig = (0, _extends3.default)(
    {
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
    },
    plgConfig
  );

  _imagemin2.default
    .buffer(file.contents, {
      plugins: [
        (0, _imageminMozjpeg2.default)(defaultConfig.jpg),
        (0, _imageminPngquant2.default)(defaultConfig.png),
        (0, _imageminSvgo2.default)(defaultConfig.svg),
      ],
    })
    .then(function(buffer) {
      file.contents = buffer;
      next(file);
    });
});
module.exports = exports['default'];

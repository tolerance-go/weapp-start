'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var util = require('./utils');
var fs = require('fs');

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /copy\.json$/,
  encoding: 'utf8',
})(function(file, next, plgConfig, utils) {
  var jsonConfig = JSON.parse(file.contents);
  var i = file.dist.lastIndexOf('copy.json');
  var distPath = file.dist.slice(0, i);
  var sourcePath = distPath.slice(0, distPath.lastIndexOf('dist'));
  var targetPath = sourcePath + 'dist/npm';

  if (Array.isArray(jsonConfig.pkgPath)) {
    fs.mkdir(targetPath, function(err) {
      if (err) {
        utils.log.extra('创建npm文件夹成功');
      }
    });
    jsonConfig.pkgPath.forEach(function(v) {
      v = '' + sourcePath + v;
      fs.stat(v, function(err, stats) {
        if (stats.isDirectory()) {
          util.cpFolder({
            srcDir: v,
            tarDir: sourcePath + 'dist/npm',
            utils: utils,
          });
        }
      });
    });
  }
});
module.exports = exports['default'];

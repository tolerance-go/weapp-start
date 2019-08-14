'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('./utils');
var fs = require('fs');

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /copy\.json$/,
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  var jsonConfig = JSON.parse(file.contents);
  var i = file.dist.lastIndexOf('copy.json');
  var distPath = file.dist.slice(0, i);
  var sourcePath = distPath.slice(0, distPath.lastIndexOf('dist'));

  if (Array.isArray(jsonConfig.pkgData)) {
    jsonConfig.pkgData.forEach(function (v) {
      v.source = '' + sourcePath + v.source;
      fs.stat(v.source, function (err, stats) {
        if (err) {
          utils.log.error(err);
          return;
        }
        if (stats.isDirectory()) {
          var targetPath = '' + sourcePath + v.targetFileName;
          fs.mkdir(targetPath, { recursive: true }, function (err) {
            if (err) {
              utils.log.extra('创建npm文件夹成功');
            }
          });
          util.cpFolder({
            srcDir: v.source,
            tarDir: targetPath,
            utils: utils
          });
        }
      });
    });
  }
});
module.exports = exports['default'];
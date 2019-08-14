'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var fs = require('fs');
var path = require('path');

exports.default = {
  cpFile: function cpFile(params) {
    var srcPath = params.srcPath,
      tarPath = params.tarPath,
      cb = params.cb,
      utils = params.utils;

    var rs = fs.createReadStream(srcPath);
    rs.on('error', function(err) {
      if (err) {
        utils.log.error('read error', srcPath);
      }
      cb && cb(err);
    });

    var ws = fs.createWriteStream(tarPath);
    ws.on('error', function(err) {
      if (err) {
        utils.log.error('write error', tarPath);
      }
      cb && cb(err);
    });
    rs.pipe(ws);
  },
  cpFolder: function cpFolder(params) {
    var _this = this;

    var srcDir = params.srcDir,
      tarDir = params.tarDir,
      utils = params.utils;

    fs.readdir(srcDir, function(err, files) {
      if (files.length === 0) {
        utils.log.error('为毛要复制一个空文件夹');
        return;
      }
      if (err) {
        utils.log.error('哎呀，出错了');
        console.log(err);
        return;
      }

      files.forEach(function(file) {
        var srcPath = path.join(srcDir, file);
        var tarPath = path.join(tarDir, file);

        fs.stat(srcPath, function(err, stats) {
          if (err) {
            utils.log.error(err);
            return;
          }
          if (stats.isDirectory()) {
            fs.mkdir(tarPath, function(err) {
              if (err) {
                utils.log.warn('\u6587\u4EF6\u5939' + file + '\u5DF2\u7ECF\u5B58\u5728');
                return;
              }
              utils.log.change('\u6587\u4EF6\u5939' + file + '\u590D\u5236\u6210\u529F');
              _this.cpFolder({
                srcDir: srcPath,
                tarDir: tarPath,
                utils: utils,
              });
            });
          } else {
            _this.cpFile({ srcPath: srcPath, tarPath: tarPath, utils: utils });
          }
        });
      });
    });
  },
};
module.exports = exports['default'];

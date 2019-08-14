'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.saveCopy = saveCopy;
exports.saveWrite = saveWrite;

var _fs = require('fs');

var _path = require('path');

function saveCopy(path, dist) {
  (0, _fs.copyFileSync)(path, dist);
  if ((0, _fs.lstatSync)(path).isDirectory()) {
    (0, _fs.readdirSync)(path).forEach(function(file) {
      saveCopy((0, _path.join)(path, file), (0, _path.join)(dist, file));
    });
  }
}

function saveWrite(resolvedPath, contents) {
  var _parse = (0, _path.parse)(resolvedPath),
    dir = _parse.dir;
  // 路径的文件夹非空处理

  dir.split(_path.sep).reduce(function(pre, next) {
    var pt = pre + _path.sep + next;
    if (!(0, _fs.existsSync)(pt)) {
      (0, _fs.mkdirSync)(pt);
    }
    return pt;
  });
  (0, _fs.writeFileSync)(resolvedPath, contents);
}

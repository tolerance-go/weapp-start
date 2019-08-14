'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { join, parse } from 'path';
var statSync = _fs2.default.statSync,
    existsSync = _fs2.default.existsSync;
exports.default = {
  addExt: function addExt(lib) {
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.js';

    if (lib.match(new RegExp(ext + '$'))) {
      return lib;
    }
    return lib + ext;
  },

  // 本身是文件 省略后缀 /a/b  (/a/b.js)
  // 本身是文件 不省略后缀 /a/b.js  (/a/b.js)
  // 本身是文件夹 /a/b  (/a/b)
  isDir: function isDir(path) {
    if (!existsSync(path)) {
      return false;
    }
    // 同名的文件夹和文件，文件的查找优先级更高
    var jsSuffix = this.addExt(path);
    if (existsSync(jsSuffix)) {
      if (!statSync(jsSuffix).isDirectory()) {
        return false;
      }
    }
    return statSync(path).isDirectory();
  },
  isExist: function isExist(path) {
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.js';

    return existsSync(path) || existsSync(this.addExt(path, ext));
  }
};
module.exports = exports['default'];
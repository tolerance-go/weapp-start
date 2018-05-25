import fs from 'fs';
// import { join, parse } from 'path';
const { statSync, existsSync } = fs;

export default {
  addExt(lib, ext = '.js') {
    if (lib.match(new RegExp(`${ext}$`))) {
      return lib;
    }
    return lib + ext;
  },
  // 本身是文件 省略后缀 /a/b  (/a/b.js)
  // 本身是文件 不省略后缀 /a/b.js  (/a/b.js)
  // 本身是文件夹 /a/b  (/a/b)
  isDir(path) {
    if (!existsSync(path)) {
      return false;
    }
    // 同名的文件夹和文件，文件的查找优先级更高
    const jsSuffix = this.addExt(path);
    if (existsSync(jsSuffix)) {
      if (!statSync(jsSuffix).isDirectory()) {
        return false;
      }
    }
    return statSync(path).isDirectory();
  },
  isExist(path, ext = '.js') {
    return existsSync(path) || existsSync(this.addExt(path, ext));
  },
};

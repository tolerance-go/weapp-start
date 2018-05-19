const babel = require('babel-core');
const resolveCwd = require('resolve-cwd');
const { join, parse } = require('path');
import createPlugin from 'weapp-util-create-plugin';

const addExt = (lib, ext = '.js') => {
  if (lib.match(new RegExp(`${ext}$`))) {
    return lib;
  }
  return lib + ext;
};

export default createPlugin({
  match: /\.js$/,
})((file, next, plgConfig, utils) => {
  const { byDependPaths } = utils;

  const contents = babel.transformFileSync(file.path, plgConfig).code;

  contents.replace(/[^.]?require\(['"]([\w\d_\-./@]+)['"]\)/gi, (match, lib) => {
    let byDependPath;

    if (lib.startsWith('.')) {
      byDependPath = addExt(join(parse(file.path).dir, lib));
    }

    if (
      lib.indexOf('/') === -1 // require('asset');
    ) {
      try {
        resolveCwd(lib);
      } catch (error) {
        // var common = require('common.js')
        // 小程序里面 相对路径可以省略 ./ 直接引用和第三方模块引入方式冲突
        if (error.code === 'MODULE_NOT_FOUND') {
          byDependPath = addExt(join(parse(file.path).dir, lib));
        }
      }
    }

    if (byDependPath) {
      byDependPaths.push({
        byDependPath,
        dependPath: file.path,
      });
    }
  });

  file.contents = Buffer.from(contents);

  next(file);
});

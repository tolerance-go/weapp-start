const babel = require('babel-core');
const resolveCwd = require('resolve-cwd');
const { join, parse } = require('path');

const addExt = (lib, ext = '.js') => {
  if (lib.match(new RegExp(`${ext}$`))) {
    return lib;
  }
  return lib + ext;
};

const babeltrans = ({ config, file, status, extra, byDependPaths }, plgConfig) => {
  const defaultConfig = {
    match: /\.js$/,
    ...plgConfig,
  };

  if (defaultConfig.ignore) {
    if (file.path.match(defaultConfig.ignore)) return;
  }

  if (!file.path.match(defaultConfig.match)) return;

  file.contents = babel.transformFileSync(file.path, plgConfig).code;

  file.contents.replace(/[^.]?require\(['"]([\w\d_\-./@]+)['"]\)/gi, (match, lib) => {
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
};

export default babeltrans;

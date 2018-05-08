const { join, relative, isAbsolute, basename, parse } = require('path');
const { readFileSync, existsSync } = require('fs');
const resolveCwd = require('resolve-cwd');
const utils = require('./utils');
const Module = require('module');

const npmHack = (libResolvedPath, contents) => {
  // 一些库（redux等） 可能会依赖 process.env.NODE_ENV 进行逻辑判断
  // 这里在编译这一步直接做替换 否则报错
  contents = contents.replace(/process\.env\.NODE_ENV/g, JSON.stringify(process.env.NODE_ENV));

  if (
    libResolvedPath.match('core-js/library/modules/_global.js') ||
    libResolvedPath.match('lodash.js')
  ) {
    contents = contents.replace("Function('return this')()", 'this');
  }

  if (libResolvedPath.match('core-js/library/modules/_html.js')) {
    contents = 'module.exports = false;';
  }

  if (libResolvedPath.match('core-js/library/modules/_cof.js')) {
    contents = contents.replace('return toString.call(it).slice(8, -1);', "return ''");
  }

  if (libResolvedPath.match('core-js/library/modules/_microtask.js')) {
    contents = contents.replace('if (Observer', 'if (false && Observer');
    // IOS 1.10.2 Promise BUG
    contents = contents.replace(
      'Promise && Promise.resolve',
      'false && Promise && Promise.resolve'
    );
  }

  if (libResolvedPath.match('core-js/library/modules/_freeGlobal.js')) {
    contents = contents.replace(
      'module.exports = freeGlobal;',
      'module.exports = freeGlobal || this;'
    );
  }

  return contents;
};

// 假设 前提小程序里的绝对路径引用必须以 / 打头

const npmFolder = 'npm';

const pushExtra = (distResolvedPath, contents, extra) => {
  if (existsSync(distResolvedPath)) return;
  extra.push({
    path: distResolvedPath,
    mode: 'add',
    contents,
  });
};

const checkDeps = (dependCode, dependResolvedPath, dependDistPath, npmInfo, meta, extra) => {
  return dependCode.replace(/[^.]?require\(['"]([\w\d_\-./@]+)['"]\)/gi, (match, lib) => {
    // 依赖查找
    let isNpm = !!npmInfo;

    // 被依赖者
    let libResolvedPath;
    let libResolvedDistPath;

    // 路径替换
    let relativeDistPath;

    if (
      lib.indexOf('/') === -1 // require('asset');
    ) {
      try {
        libResolvedPath = resolveCwd(lib);
        const libBaseName = basename(libResolvedPath);
        libResolvedDistPath = join(
          meta.dist,
          npmFolder,
          libBaseName === 'index.js' ? utils.addExt(lib) : libBaseName
        );
      } catch (error) {
        // var common = require('common.js')
        // 小程序里面 相对路径可以省略 ./ 直接引用和第三方模块引入方式冲突
        if (error.code === 'MODULE_NOT_FOUND') {
          if (!isNpm) {
            const drpOpts = parse(dependResolvedPath);
            let exist = utils.isExist(join(drpOpts.dir, lib));

            if (!exist) {
              throw error;
            }

            console.log(
              '建议小程序中 require module 的路径，使用显示的相对路径 "./module" 来代替 "module" :' +
                match
            );
            if (utils.isDir(join(drpOpts.dir, lib))) {
              // libResolvedPath = join(drpOpts.dir, lib, 'index.js');
              // libResolvedDistPath = join(meta.dist, npmFolder, lib, 'index.js');
              relativeDistPath = './' + join(lib, 'index.js');
            } else {
              // libResolvedPath = join(drpOpts.dir, utils.addExt(lib, '.js'));
              // libResolvedDistPath = join(meta.dist, npmFolder, utils.addExt(lib, '.js'));
              relativeDistPath = './' + join(utils.addExt(lib));
            }
          } else {
            throw error;
          }
        }
      }

      if (!relativeDistPath) {
        relativeDistPath = relative(dependDistPath, libResolvedDistPath);

        // ../lodash.js -> ./lodash
        relativeDistPath = relativeDistPath.slice(1);

        let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

        contents = npmHack(libResolvedPath, contents);

        contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

        pushExtra(libResolvedDistPath, contents, extra);
      }
    }

    if (
      lib.indexOf('/') !== -1 && // require('lodash/_arrayEach')
      !lib.startsWith('/') &&
      !lib.startsWith('.')
    ) {
      const firstStep = [].findIndex.call(lib, it => it === '/');
      const mainNpm = lib.slice(0, firstStep);
      const inner = lib.slice(firstStep + 1);

      try {
        libResolvedPath = resolveCwd(mainNpm);
      } catch (error) {
        // 类似 babel-runtime 这种没有 main 和 index 的包
        if (error.code === 'MODULE_NOT_FOUND') {
          let exist = false;
          const resolveModules = Module._nodeModulePaths(process.cwd(), 'noop.js');
          for (let modulePath of resolveModules) {
            libResolvedPath = join(modulePath, mainNpm);
            if (existsSync(libResolvedPath)) {
              const pkgPath = join(libResolvedPath, 'package.json');
              const mainField = require(pkgPath).main;
              libResolvedPath = join(libResolvedPath, mainField || '', 'noop.js');
              exist = true;
              break;
            }
          }
          if (!exist) {
            throw error;
          }
        }
      }

      // libResolvedPath 一定是带 base 的路径
      const libResolvedPathOpts = parse(libResolvedPath);

      if (utils.isDir(join(libResolvedPathOpts.dir, inner))) {
        libResolvedPath = join(libResolvedPathOpts.dir, inner, 'index.js');
        libResolvedDistPath = join(meta.dist, npmFolder, mainNpm, inner, 'index.js');
      } else {
        libResolvedPath = join(libResolvedPathOpts.dir, utils.addExt(inner, '.js'));
        libResolvedDistPath = join(meta.dist, npmFolder, mainNpm, utils.addExt(inner, '.js'));
      }

      relativeDistPath = relative(dependDistPath, libResolvedDistPath);
      // ../lodash.js -> ./lodash
      relativeDistPath = relativeDistPath.slice(1);

      let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

      contents = npmHack(libResolvedPath, contents);

      contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

      pushExtra(libResolvedDistPath, contents, extra);
    }

    if (
      lib.startsWith('.') // require('./ohter');
    ) {
      if (isNpm) {
        const dependResolvedPathOpts = parse(dependResolvedPath);
        const dependDistPathOpts = parse(dependDistPath);
        const isDirectory = utils.isDir(join(dependResolvedPathOpts.dir, lib));

        if (isDirectory) {
          libResolvedPath = join(dependResolvedPathOpts.dir, lib, 'index.js');
          libResolvedDistPath = join(dependDistPathOpts.dir, lib, 'index.js');
        } else {
          libResolvedPath = join(dependResolvedPathOpts.dir, utils.addExt(lib, '.js'));
          libResolvedDistPath = join(dependDistPathOpts.dir, utils.addExt(lib, '.js'));
        }

        let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

        contents = npmHack(libResolvedPath, contents);

        contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

        pushExtra(libResolvedDistPath, contents, extra);
      }
      relativeDistPath = lib;
    }

    if (
      isAbsolute(lib) // require('/com/button');
    ) {
      relativeDistPath = lib;
    }
    return `${match[0] === 'r' ? '' : match[0]}require('${relativeDistPath}')`;
  });
};

const requiretrans = ({ config, file, status, extra }) => {
  if (file.extname !== '.js') return;
  const { cwd } = file;
  const { src, dist } = config;
  const dependDistPath = join(cwd, dist, relative(join(cwd, src), file.path));
  const dependResolvedPath = file.path;

  const meta = {
    dist: join(cwd, dist),
  };
  file.contents = checkDeps(file.contents, dependResolvedPath, dependDistPath, false, meta, extra);
};

export default requiretrans;

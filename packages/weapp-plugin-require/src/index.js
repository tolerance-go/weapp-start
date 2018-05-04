const { join, relative, isAbsolute, basename, parse } = require('path');
const { readFileSync } = require('fs');
const resolveCwd = require('resolve-cwd');
const { addExt } = require('./utils');

const npmHack = (lib, contents) => {
  // 一些库（redux等） 可能会依赖 process.env.NODE_ENV 进行逻辑判断
  // 这里在编译这一步直接做替换 否则报错
  contents = contents.replace(/process\.env\.NODE_ENV/g, JSON.stringify(process.env.NODE_ENV));
  switch (lib) {
    case 'lodash.js':
    case '_global.js':
      contents = contents.replace("Function('return this')()", 'this');
      break;
    case '_html.js':
      contents = 'module.exports = false;';
      break;
    case '_microtask.js':
      contents = contents.replace('if(Observer)', 'if(false && Observer)');
      // IOS 1.10.2 Promise BUG
      contents = contents.replace(
        'Promise && Promise.resolve',
        'false && Promise && Promise.resolve'
      );
      break;
    case '_freeGlobal.js':
      contents = contents.replace(
        'module.exports = freeGlobal;',
        'module.exports = freeGlobal || this;'
      );
  }
  return contents;
};

// 假设 前提小程序里的绝对路径引用必须以 / 打头

const npmFolder = 'npm';

const checkDeps = (dependCode, dependResolvedPath, dependDistPath, npmInfo, meta, extra) => {
  return dependCode.replace(/[^.]require\(['"]([\w\d_\-./@]+)['"]\)/gi, (match, lib) => {
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
      libResolvedPath = resolveCwd(lib);
      libResolvedDistPath = join(meta.dist, npmFolder, basename(libResolvedPath));
      relativeDistPath = relative(dependDistPath, libResolvedDistPath);

      // ../lodash.js -> ./lodash
      relativeDistPath = relativeDistPath.slice(1);

      let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

      contents = npmHack(basename(libResolvedPath), contents);

      contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

      extra.push({
        path: libResolvedDistPath,
        mode: 'add',
        contents,
      });
    }

    if (
      lib.indexOf('/') !== -1 && // require('lodash/_arrayEach')
      !lib.startsWith('/') &&
      !lib.startsWith('.')
    ) {
      const [mainNpm, inner] = lib.split('/');
      libResolvedPath = resolveCwd(mainNpm);
      libResolvedPath = join(
        libResolvedPath.replace(basename(libResolvedPath), ''),
        addExt(inner, '.js')
      );
      libResolvedDistPath = join(meta.dist, npmFolder, mainNpm, addExt(inner, '.js'));

      relativeDistPath = relative(dependDistPath, libResolvedDistPath);
      // ../lodash.js -> ./lodash
      relativeDistPath = relativeDistPath.slice(1);

      let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

      contents = npmHack(basename(libResolvedPath), contents);

      contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

      extra.push({
        path: libResolvedDistPath,
        mode: 'add',
        contents,
      });
    }

    if (
      lib.startsWith('.') // require('./ohter');
    ) {
      if (isNpm) {
        libResolvedPath = join(parse(dependResolvedPath).dir, addExt(lib, '.js'));
        libResolvedDistPath = join(parse(dependDistPath).dir, addExt(lib, '.js'));
        let contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

        contents = npmHack(basename(libResolvedPath), contents);

        contents = checkDeps(contents, libResolvedPath, libResolvedDistPath, {}, meta, extra);

        extra.push({
          path: libResolvedDistPath,
          mode: 'add',
          contents,
        });
      }
      relativeDistPath = lib;
    }

    if (
      isAbsolute(lib) // require('/com/button');
    ) {
      relativeDistPath = lib;
    }
    return `require('${relativeDistPath}')`;
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
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _require = require('path'),
  join = _require.join,
  relative = _require.relative,
  isAbsolute = _require.isAbsolute,
  basename = _require.basename,
  parse = _require.parse;

var _require2 = require('fs'),
  readFileSync = _require2.readFileSync,
  existsSync = _require2.existsSync;

var resolveCwd = require('resolve-cwd');
var utils = require('./utils');
var Module = require('module');

var replaceNodeEnv = function replaceNodeEnv(contents) {
  contents = contents.replace(
    /process\.env\.NODE_ENV/g,
    (0, _stringify2.default)(process.env.NODE_ENV)
  );
  return contents;
};

var npmHack = function npmHack(libResolvedPath, contents) {
  // 一些库（redux等） 可能会依赖 process.env.NODE_ENV 进行逻辑判断
  // 这里在编译这一步直接做替换 否则报错
  contents = contents.replace(
    /process\.env\.NODE_ENV/g,
    (0, _stringify2.default)(process.env.NODE_ENV)
  );

  if (libResolvedPath.match('core-js/library/modules/_global.js')) {
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

  if (
    libResolvedPath.match('core-js/library/modules/_freeGlobal.js') ||
    libResolvedPath.match('lodash/_freeGlobal.js')
  ) {
    contents = contents.replace(
      'module.exports = freeGlobal;',
      'module.exports = freeGlobal || this;'
    );
  }

  return contents;
};

// 假设 前提小程序里的绝对路径引用必须以 / 打头

var npmFolder = 'npm';

var checkDeps = function checkDeps(
  dependCode,
  dependResolvedPath,
  dependDistPath,
  npmInfo,
  config,
  log,
  extra,
  plgConfig
) {
  var distCode = dependCode.replace(/require\(['"]([\w\d_\-./@]+)['"]\)/gi, function(match, lib) {
    // 依赖查找
    var isNpm = !!npmInfo;

    // 被依赖者
    var libResolvedPath = void 0;
    var libResolvedDistPath = void 0;

    // 路径替换
    var relativeDistPath = void 0;

    if (
      lib.indexOf('/') === -1 // require('asset');
    ) {
      try {
        libResolvedPath = resolveCwd(lib);
        var libBaseName = basename(libResolvedPath);
        libResolvedDistPath = join(
          config.resolvedDist,
          npmFolder,
          libBaseName === 'index.js' ? utils.addExt(lib) : libBaseName
        );
      } catch (error) {
        // var common = require('common.js')
        // 小程序里面 相对路径可以省略 ./ 直接引用和第三方模块引入方式冲突
        if (error.code === 'MODULE_NOT_FOUND') {
          if (!isNpm) {
            var drpOpts = parse(dependResolvedPath);
            var exist = utils.isExist(join(drpOpts.dir, lib));

            if (!exist) {
              throw error;
            }

            log.warn(
              '[weapp-plugin-require]: 建议小程序中 require module 的路径，使用显示的相对路径 "./module" 来代替 "module" :' +
                match
            );
            if (utils.isDir(join(drpOpts.dir, lib))) {
              // libResolvedPath = join(drpOpts.dir, lib, 'index.js');
              // libResolvedDistPath = join(config.dist, npmFolder, lib, 'index.js');
              relativeDistPath = './' + join(lib, 'index.js');
            } else {
              // libResolvedPath = join(drpOpts.dir, utils.addExt(lib, '.js'));
              // libResolvedDistPath = join(config.dist, npmFolder, utils.addExt(lib, '.js'));
              relativeDistPath = './' + join(utils.addExt(lib));
            }
          } else {
            throw error;
          }
        }
      }

      if (!relativeDistPath) {
        relativeDistPath = relative(dependDistPath, libResolvedDistPath);
        relativeDistPath = relativeDistPath.replace(/\\/g, '/');
        // ../lodash.js -> ./lodash
        relativeDistPath = relativeDistPath.slice(1);

        var contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

        contents = npmHack(libResolvedPath, contents);

        contents = checkDeps(
          contents,
          libResolvedPath,
          libResolvedDistPath,
          {},
          config,
          log,
          extra
        );

        extra[libResolvedDistPath] = { contents: contents };
      }
    }

    if (
      lib.indexOf('/') !== -1 && // require('lodash/_arrayEach')
      !lib.startsWith('/') &&
      !lib.startsWith('.')
    ) {
      var firstStep = [].findIndex.call(lib, function(it) {
        return it === '/';
      });
      var mainNpm = lib.slice(0, firstStep);
      var inner = lib.slice(firstStep + 1);

      try {
        libResolvedPath = resolveCwd(mainNpm);
      } catch (error) {
        // 类似 babel-runtime 这种没有 main 和 index 的包
        if (error.code === 'MODULE_NOT_FOUND') {
          var _exist = false;
          var resolveModules = Module._nodeModulePaths(process.cwd(), 'noop.js');
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = (0, _getIterator3.default)(resolveModules), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var modulePath = _step.value;

              libResolvedPath = join(modulePath, mainNpm);
              if (existsSync(libResolvedPath)) {
                var pkgPath = join(libResolvedPath, 'package.json');
                var mainField = require(pkgPath).main;
                libResolvedPath = join(libResolvedPath, mainField || '', 'noop.js');
                _exist = true;
                break;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (!_exist) {
            throw error;
          }
        }
      }

      // libResolvedPath 一定是带 base 的路径
      var libResolvedPathOpts = parse(libResolvedPath);

      if (utils.isDir(join(libResolvedPathOpts.dir, inner))) {
        libResolvedPath = join(libResolvedPathOpts.dir, inner, 'index.js');
        libResolvedDistPath = join(config.resolvedDist, npmFolder, mainNpm, inner, 'index.js');
      } else {
        libResolvedPath = join(libResolvedPathOpts.dir, utils.addExt(inner, '.js'));
        libResolvedDistPath = join(
          config.resolvedDist,
          npmFolder,
          mainNpm,
          utils.addExt(inner, '.js')
        );
      }

      relativeDistPath = relative(dependDistPath, libResolvedDistPath);
      relativeDistPath = relativeDistPath.replace(/\\/g, '/');
      // ../lodash.js -> ./lodash
      relativeDistPath = relativeDistPath.slice(1);

      var _contents = readFileSync(libResolvedPath, { encoding: 'utf-8' });

      _contents = npmHack(libResolvedPath, _contents);

      _contents = checkDeps(
        _contents,
        libResolvedPath,
        libResolvedDistPath,
        {},
        config,
        log,
        extra
      );

      extra[libResolvedDistPath] = { contents: _contents };
    }

    if (
      lib.startsWith('.') // require('./ohter');
    ) {
      if (isNpm) {
        var dependResolvedPathOpts = parse(dependResolvedPath);
        var dependDistPathOpts = parse(dependDistPath);
        var isDirectory = utils.isDir(join(dependResolvedPathOpts.dir, lib));

        if (isDirectory) {
          libResolvedPath = join(dependResolvedPathOpts.dir, lib, 'index.js');
          libResolvedDistPath = join(dependDistPathOpts.dir, lib, 'index.js');
        } else {
          libResolvedPath = join(dependResolvedPathOpts.dir, utils.addExt(lib, '.js'));
          libResolvedDistPath = join(dependDistPathOpts.dir, utils.addExt(lib, '.js'));
        }

        var _contents2 = readFileSync(libResolvedPath, { encoding: 'utf-8' });

        _contents2 = npmHack(libResolvedPath, _contents2);

        _contents2 = checkDeps(
          _contents2,
          libResolvedPath,
          libResolvedDistPath,
          {},
          config,
          log,
          extra
        );

        extra[libResolvedDistPath] = { contents: _contents2 };
      }
      relativeDistPath = lib;
    }

    if (
      isAbsolute(lib) // require('/com/button');
    ) {
      // 对配置的路径绝对路径进行处理
      var dependResolvedPathArr = dependResolvedPath.replace(/\\/g, '/').split('/');
      var pathTemp = '../';
      (0, _keys2.default)(plgConfig.alias).forEach(function(v) {
        if (lib.split('/')[1] === v) {
          var configPath = plgConfig.alias[v].replace(/\\/g, '/').split('/');
          for (var i = 0; i < dependResolvedPathArr.length - configPath.length; i++) {
            lib = pathTemp + (i === 0 ? lib.slice(1) : lib);
          }
        }
      });

      relativeDistPath = lib;
    }
    return "require('" + relativeDistPath + "')";
  });
  return Buffer.from(distCode);
};

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.js$/,
})(function(file, next, plgConfig, utils) {
  var _utils$config = utils.config,
    resolvedDist = _utils$config.resolvedDist,
    resolvedSrc = _utils$config.resolvedSrc;

  var dependDistPath = join(resolvedDist, relative(resolvedSrc, file.path));
  var dependResolvedPath = file.path;
  // 支持代码中环境变量
  var contents = replaceNodeEnv(file.contents.toString());
  file.contents = checkDeps(
    contents,
    dependResolvedPath,
    dependDistPath,
    false,
    utils.config,
    utils.log,
    file.extra,
    plgConfig
  );

  next(file);
});
module.exports = exports['default'];

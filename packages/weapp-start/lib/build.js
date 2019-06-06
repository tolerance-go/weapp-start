'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = exports.watch = undefined;

var _path = require('path');

var _fs = require('fs');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _getFileObj = require('./getFileObj');

var _getFileObj2 = _interopRequireDefault(_getFileObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

function isIgnoreFile(config, path) {
  if (path.match(/\.DS_Store$/gi)) return true;
  if (!config.ignore) return false;
  return config.ignore.match(path);
}

function collect(resolvedSrcPath, resolvedDistPath, filsObjs) {
  if (!(0, _fs.existsSync)(resolvedSrcPath)) return;
  var status = (0, _fs.statSync)(resolvedSrcPath);
  if (status.isDirectory()) {
    if (!(0, _fs.existsSync)(resolvedDistPath)) {
      (0, _fs.mkdirSync)(resolvedDistPath);
    }
    var files = (0, _fs.readdirSync)(resolvedSrcPath);
    files.forEach(function (file) {
      collect((0, _path.join)(resolvedSrcPath, file), (0, _path.join)(resolvedDistPath, file), filsObjs);
    });
  } else {
    filsObjs.push((0, _getFileObj2.default)(resolvedSrcPath, resolvedDistPath));
  }
}

function build(config, noCache) {
  var resolvedDist = config.resolvedDist,
      resolvedSrc = config.resolvedSrc,
      mode = config.mode;

  if (noCache || mode === 'build') {
    _rimraf2.default.sync(resolvedDist);
  }
  var filsObjs = [];
  collect(resolvedSrc, resolvedDist, filsObjs);
  filsObjs.forEach(function (file) {
    if (isIgnoreFile(config, file.path)) return;
    config.transform(file);
  });
}

function watch(config) {
  var resolvedSrc = config.resolvedSrc,
      resolvedDist = config.resolvedDist;

  var watcher = _chokidar2.default.watch(resolvedSrc, {
    ignoreInitial: true
  });
  watcher.on('all', function (event, resolvedSrcPath) {
    var printPath = resolvedSrcPath.replace(cwd + '/', '');

    if (event === 'unlink' || event === 'unlinkDir') {
      _log2.default.remove(printPath);
      return _rimraf2.default.sync((0, _path.join)(resolvedDist, (0, _path.relative)(resolvedSrc, resolvedSrcPath)));
    }

    if (event === 'add' || event === 'addDir') {
      _log2.default.add(printPath);
    }

    if (event === 'change') {
      _log2.default.change(printPath);
    }

    if (event !== 'addDir') {
      var resolvedDistPath = (0, _path.join)(config.resolvedDist, (0, _path.relative)(config.resolvedSrc, resolvedSrcPath));

      var file = (0, _getFileObj2.default)(resolvedSrcPath, resolvedDistPath);
      if (isIgnoreFile(config, file.path)) return;
      config.transform(file);
    }
  });
}

exports.watch = watch;
exports.build = build;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _less2 = require('less');

var _less3 = _interopRequireDefault(_less2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _weappUtilCreatePlugin = require('weapp-util-create-plugin');

var _weappUtilCreatePlugin2 = _interopRequireDefault(_weappUtilCreatePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

var resolver = {
  install: function install(_less, pluginManager) {
    var fm = new _less3.default.FileManager();
    fm.loadFile = function (filename, dir, options, env, cb) {
      return new _promise2.default(function (resolve, reject) {
        if (_path2.default.isAbsolute(filename)) {
          filename = _path2.default.join(process.cwd(), cache.src, filename);
        } else {
          filename = _path2.default.join(dir || cache.dirname, filename);
        }
        cache.byDependPaths.push({
          byDependPath: filename,
          dependPath: cache.path
        });
        var contents = _fs2.default.readFileSync(filename, 'utf8');
        // FIXME adding prefix while I shouldn't have to
        resolve({ contents: contents, filename: filename });
        // or
        // reject("could not find " + filename);
      });
    };
    fm.supportsSync = false;
    pluginManager.addFileManager(fm);
  }
};

exports.default = (0, _weappUtilCreatePlugin2.default)({
  match: /\.wxss$/,
  afterExt: '.wxss',
  encoding: 'utf8'
})(function (file, next, plgConfig, utils) {
  cache.dirname = file.dir;
  cache.src = utils.config.src;
  cache.path = file.path;
  cache.byDependPaths = utils.byDependPaths;

  plgConfig.plugins = [resolver];
  _less3.default.render(file.contents, plgConfig).then(function (res, imports) {
    file.contents = res.css;
    next(file);
  });
});
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _fs = require('fs');

var _path = require('path');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var error = null;
var cwd = process.cwd();
var mockDir = (0, _path.join)(cwd, 'mock');
var mockFile = (0, _path.join)(cwd, 'mock.js');

function getConfig() {
  var config = {};
  var existDir = (0, _fs.existsSync)(mockDir);
  var existFile = (0, _fs.existsSync)(mockFile);

  if (existDir || existFile) {
    // disable require cache
    (0, _keys2.default)(require.cache).forEach(function(file) {
      if (file.indexOf(mockDir) > -1) {
        delete require.cache[file];
      }
    });

    if (existDir) {
      var files = (0, _fs.readdirSync)(mockDir);
      files.forEach(function(file) {
        var fullPath = (0, _path.join)(mockDir, file);
        if ((0, _fs.lstatSync)(fullPath).isDirectory()) {
          return console.log(
            _chalk2.default.red('mock folders support only one level of directories')
          );
        }
        if ((0, _path.parse)(fullPath).ext === '.js') {
          (0, _assign2.default)(config, require(fullPath));
        }
      });
    }

    if (existFile) {
      (0, _assign2.default)(config, require(mockFile));
    }
  }
  return config;
}

function createMockHandler(method, path, value) {
  return function mockHandler() {
    var res = arguments.length <= 1 ? undefined : arguments[1];
    if (typeof value === 'function') {
      value.apply(undefined, arguments);
    } else {
      res.json(value);
    }
  };
}

function createProxy(method, path, target) {
  return (0, _expressHttpProxy2.default)(target, {
    filter: function filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath: function forwardPath(req) {
      var matchPath = req.originalUrl;
      var matches = matchPath.match(path);
      if (matches.length > 1) {
        matchPath = matches[1];
      }
      return (0, _path.join)(_url2.default.parse(target).path, matchPath);
    },
  });
}

function applyMock(app) {
  try {
    realApplyMock(app);
    error = null;
  } catch (e) {
    console.log(e);
    error = e;
    outputError();

    var watcher = _chokidar2.default.watch([mockDir, mockFile], {
      ignored: /node_modules/,
      ignoreInitial: true,
    });
    watcher.on('change', function(path) {
      console.log(_chalk2.default.green('CHANGED'), path.replace(cwd + '/', ''));
      watcher.close();
      applyMock(app);
    });
  }
}

function realApplyMock(app) {
  var config = getConfig();

  app.use(_bodyParser2.default.json({ limit: '5mb', strict: false }));
  app.use(
    _bodyParser2.default.urlencoded({
      extended: true,
      limit: '5mb',
    })
  );

  (0, _keys2.default)(config).forEach(function(key) {
    var keyParsed = parseKey(key);
    (0, _assert2.default)(!!app[keyParsed.method], 'method of ' + key + ' is not valid');
    (0,
    _assert2.default)(typeof config[key] === 'function' || (0, _typeof3.default)(config[key]) === 'object' || typeof config[key] === 'string', 'mock value of ' + key + ' should be function or object or string, but got ' + (0, _typeof3.default)(config[key]));
    if (typeof config[key] === 'string') {
      var path = keyParsed.path;

      if (/\(.+\)/.test(path)) {
        path = new RegExp('^' + path + '$');
      }
      app.use(path, createProxy(keyParsed.method, path, config[key]));
    } else {
      app[keyParsed.method](
        keyParsed.path,
        createMockHandler(keyParsed.method, keyParsed.path, config[key])
      );
    }
  });

  var watcher = _chokidar2.default.watch([mockDir, mockFile], {
    ignored: /node_modules/,
    persistent: true,
  });
  watcher.on('change', function(path) {
    console.log(_chalk2.default.green('CHANGED'), path.replace(cwd + '/', ''));
    watcher.close();

    // 删除旧的 mock api
    app._router.stack = app._router.stack.filter(function(item) {
      return item.name !== 'bound dispatch';
    });

    applyMock(app);
  });
}

function parseKey(key) {
  var method = 'get';
  var path = key;

  if (key.indexOf(' ') > -1) {
    var splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method: method, path: path };
}

function outputError() {
  if (!error) return;

  var filePath = error.message.split(': ')[0];
  var relativeFilePath = filePath.replace(cwd + '/', '');
  var errors = error.stack
    .split('\n')
    .filter(function(line) {
      return line.trim().indexOf('at ') !== 0;
    })
    .map(function(line) {
      return line.replace(filePath + ': ', '');
    });
  errors.splice(1, 0, ['']);

  console.log(_chalk2.default.red('Failed to parse mock config.'));
  console.log();
  console.log('Error in ' + relativeFilePath);
  console.log(errors.join('\n'));
  console.log();
}

function launchMock() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$port = opts.port,
    port = _opts$port === undefined ? 3000 : _opts$port;

  var app = (0, _express2.default)();
  applyMock(app);
  app.listen(port);
  console.log(_chalk2.default.green('\n🔥 mock server start:', 'http://localhost:' + port + '\n'));
}

exports.default = launchMock;
module.exports = exports['default'];

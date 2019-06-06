'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonCfgFields = ['ignore', 'match', 'afterExt', 'extra'];

var createPlugin = function createPlugin() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // http://nodejs.cn/api/buffer.html#buffer_buffers_and_character_encodings
  var encoding = meta.encoding,
      commonConfig = (0, _objectWithoutProperties3.default)(meta, ['encoding']);


  return function (cb) {
    return function (utils) {
      return function (next) {
        return function (file) {
          var plgConfig = utils.pluginConfig;
          var defaultCfg = (0, _extends3.default)({}, commonConfig, plgConfig);

          if (defaultCfg.ignore) {
            if (file.path.match(defaultCfg.ignore)) return next(file);
          }

          if (defaultCfg.match) {
            if (!file.path.match(defaultCfg.match)) return next(file);
          }

          if (encoding) {
            file.contents = file.contents.toString(encoding);
          }

          var specConfig = {};
          for (var key in plgConfig) {
            if (!plgConfig.hasOwnProperty(key)) continue;
            if (commonCfgFields.indexOf(key) !== -1) continue;
            specConfig[key] = plgConfig[key];
          }

          var wrappNext = function wrappNext(file) {
            if (defaultCfg.afterExt) {
              file.ext = defaultCfg.afterExt;
            }
            if (encoding) {
              file.contents = Buffer.from(file.contents, encoding);
            }
            next(file);
          };

          cb(file, wrappNext, specConfig, utils);
        };
      };
    };
  };
};

exports.default = createPlugin;
module.exports = exports['default'];
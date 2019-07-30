'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _build = require('./build');

var _getConfig = require('./getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var start = function start(mode, noCache) {
  try {
    var config = (0, _getConfig2.default)(mode);
    var transform = (0, _transform2.default)(config, 'all', 'effect');
    var rawExtraTransform = (0, _transform2.default)(config, 'extra', 'raw');

    config.transform = transform;
    config.rawExtraTransform = rawExtraTransform;

    (0, _build.build)(config, noCache);
    if (config.mode === 'dev') {
      (0, _build.watch)(config);
    }
  } catch (err) {
    _log2.default.error(err);
  }
};

exports.default = start;
module.exports = exports['default'];

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assert;
function assert(condition) {
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'assert no pass';

  var correct = condition;
  if (typeof condition === 'function') {
    correct = condition();
  }
  if (!correct) {
    throw new Error(error);
  }
}
module.exports = exports['default'];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// key 被依赖文件，value 依赖文件数组
var byDependPaths = {
  _byDependPaths: {},
  push: function push(_ref) {
    var dependPath = _ref.dependPath,
        byDependPath = _ref.byDependPath;

    var depends = this._byDependPaths[byDependPath];

    if (!depends) {
      this._byDependPaths[byDependPath] = [dependPath];
      return;
    }

    if (depends.indexOf(dependPath) !== -1) return;

    depends.push(dependPath);
  },
  getDepends: function getDepends(byDependPath) {
    return this._byDependPaths[byDependPath] || [];
  }
};

exports.default = byDependPaths;
module.exports = exports["default"];
// key 被依赖文件，value 依赖文件数组
const byDependPaths = {
  _byDependPaths: {},
  push({ dependPath, byDependPath }) {
    let depends = this._byDependPaths[byDependPath];

    if (!depends) {
      this._byDependPaths[byDependPath] = [dependPath];
      return;
    }

    if (depends.indexOf(dependPath) !== -1) return;

    depends.push(dependPath);
  },
  getDepends(byDependPath) {
    return this._byDependPaths[byDependPath] || [];
  },
};

export default byDependPaths;

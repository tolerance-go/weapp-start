const babel = require('babel-core');
const babeltrans = ({ config, file, status, extra, byDependPaths }, plgConfig) => {
  const defaultConfig = {
    match: /\.js$/,
    ...plgConfig,
  };

  if (defaultConfig.ignore) {
    if (file.path.match(defaultConfig.ignore)) return;
  }

  if (!file.path.match(defaultConfig.match)) return;

const babeltrans = ({ config, file, status, extra }, plgConfig) => {
  if (file.ext !== '.js') return;
  file.contents = babel.transformFileSync(file.path, plgConfig).code;
};

export default babeltrans;

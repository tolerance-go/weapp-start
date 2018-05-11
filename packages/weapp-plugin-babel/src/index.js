const babel = require('babel-core');

const babeltrans = ({ config, file, status, extra }, plgConfig) => {
  if (file.ext !== '.js') return;
  file.contents = babel.transformFileSync(file.path, plgConfig).code;
};

export default babeltrans;

const babel = require('babel-core');

const babeltrans = ({ config, file, status, extra }, plgConfig) => {
  if (file.extname !== '.js') return;
  file.contents = babel.transform(file.contents, plgConfig).code;
};

export default babeltrans;

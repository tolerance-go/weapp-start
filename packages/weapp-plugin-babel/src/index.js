const babel = require('babel-core');
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.js$/,
})((file, next, plgConfig, utils) => {
  const contents = babel.transformFileSync(file.path, plgConfig).code;
  file.contents = Buffer.from(contents);
  next(file);
});

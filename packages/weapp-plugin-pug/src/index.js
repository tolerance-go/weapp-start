import pug from 'pug';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.wxml$/,
  afterExt: '.wxml',
  encoding: 'utf8',
})(({ config, file, status, extra }, plgConfig) => {
  file.contents = pug.render(file.contents, plgConfig);
});

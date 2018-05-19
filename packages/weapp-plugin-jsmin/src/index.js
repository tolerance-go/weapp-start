import uglify from 'uglify-js';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.js$/,
  encoding: 'utf8',
})((file, next, plgConfig, utils) => {
  const result = uglify.minify(file.contents, plgConfig);
  if (result.error) throw result.error;
  file.contents = result.code;
  next(file);
});

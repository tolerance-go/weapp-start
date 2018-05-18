import uglify from 'uglify-js';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.js$/,
  extra: true,
  encoding: 'utf8',
})(({ config, file, status, extra }, plgConfig) => {
  const result = uglify.minify(file.contents, plgConfig);
  if (result.error) throw result.error;
  file.contents = result.code;
});

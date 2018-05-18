import stylus from 'stylus';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.wxss$/,
  afterExt: '.wxss',
  encoding: 'utf8',
})(({ config, file, status, extra, byDependPaths }, plgConfig) => {
  stylus(file.contents)
    .set('filename', file.path)
    .deps()
    .forEach(byDependPath => {
      byDependPaths.push({
        byDependPath,
        dependPath: file.path,
      });
    });

  return new Promise((resolve, reject) => {
    plgConfig.filename = file.path;
    stylus.render(file.contents, plgConfig, function(err, css) {
      if (err) return reject(err);
      file.contents = css;
      resolve({ config, file, status, extra });
    });
  });
});

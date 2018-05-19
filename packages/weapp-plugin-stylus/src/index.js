import stylus from 'stylus';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.wxss$/,
  afterExt: '.wxss',
  encoding: 'utf8',
})((file, next, plgConfig, utils) => {
  stylus(file.contents)
    .set('filename', file.path)
    .deps()
    .forEach(byDependPath => {
      utils.byDependPaths.push({
        byDependPath,
        dependPath: file.path,
      });
    });

  plgConfig.filename = file.path;
  stylus.render(file.contents, plgConfig, function(err, css) {
    if (err) {
      throw err;
    }
    file.contents = css;
    next(file);
  });
});

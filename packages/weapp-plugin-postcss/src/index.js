import createPlugin from 'weapp-util-create-plugin';
import postcss from 'postcss';

export default createPlugin({
  match: /\.wxss$/,
  encoding: 'utf8',
})((file, next, plgConfig, utils) => {
  postcss(plgConfig.plugins)
    .process(file.contents, {
      from: undefined,
    })
    .then(res => {
      file.contents = res.css;
      next(file);
    });
});

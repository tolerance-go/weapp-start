import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  encoding: 'utf8',
})((file, next, plgConfig, utils) => {
  let config = plgConfig.config;
  if (!Array.isArray(config)) {
    config = [config];
  }
  config.forEach(item => {
    const { find, replace } = item;
    file.contents = file.contents.replace(find, replace);
  });
  next(file);
});

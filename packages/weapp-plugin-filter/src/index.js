import createPlugin from 'weapp-util-create-plugin';

export default createPlugin()((file, next, plgConfig, utils) => {
  if (plgConfig.throw) {
    const match = typeof plgConfig.throw === 'function' ? plgConfig.throw() : plgConfig.throw;
    if (file.path.match(match)) {
      file.throw = true;
    }
  }
  next(file);
});

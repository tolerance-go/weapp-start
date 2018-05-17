const filtertrans = ({ config, file, status, extra }, plgConfig) => {
  const defaultConfig = {
    throw: undefined,
    ...plgConfig,
  };

  if (defaultConfig.throw) {
    if (
      file.path.match(
        typeof defaultConfig.throw === 'function' ? defaultConfig.throw() : defaultConfig.throw
      )
    ) {
      file.throw = true;
    }
  }
};

export default filtertrans;

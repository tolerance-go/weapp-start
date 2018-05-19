const commonCfgFields = ['ignore', 'match', 'afterExt', 'extra'];

const createPlugin = (meta = {}) => {
  // http://nodejs.cn/api/buffer.html#buffer_buffers_and_character_encodings
  let { encoding, ...commonConfig } = meta;

  return cb => {
    return utils => next => file => {
      const plgConfig = utils.pluginConfig;
      const defaultCfg = { ...commonConfig, ...plgConfig };

      if (defaultCfg.ignore) {
        if (file.path.match(defaultCfg.ignore)) return next(file);
      }

      if (defaultCfg.match) {
        if (!file.path.match(defaultCfg.match)) return next(file);
      }

      if (encoding) {
        file.contents = file.contents.toString(encoding);
      }

      const specConfig = {};
      for (let key in plgConfig) {
        if (!plgConfig.hasOwnProperty(key)) break;
        if (commonCfgFields.indexOf(key) !== -1) break;
        specConfig[key] = plgConfig[key];
      }

      const wrappNext = file => {
        if (defaultCfg.afterExt) {
          file.ext = defaultCfg.afterExt;
        }
        if (encoding) {
          file.contents = Buffer.from(file.contents, encoding);
        }
        next(file);
      };

      cb(file, wrappNext, specConfig, utils);
    };
  };
};

export default createPlugin;

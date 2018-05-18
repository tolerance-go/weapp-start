const createPlugin = config => {
  // 新增通用插件参数需要在这里加上，为了保证 otherConfig 不包括这些字段
  config = {
    ignore: undefined,
    match: undefined,
    afterExt: undefined,
    extra: undefined,
    // encoding: undefined, // http://nodejs.cn/api/buffer.html#buffer_buffers_and_character_encodings
    ...config,
  };

  // @todo start-cli 在初始化的时候，就对所有插件的默认配置和自定义配置进行融合，现在插件本身是无法动态修改结果配置选项，只能设置默认值
  // extra 是一个例外，在所有编译结束才开始执行 extra，所有给了一个时机修改配置，但是如果这个插件在处理编译阶段一次都没有执行（目前是不可能的，放到
  // 最开始执行）那么插件本身，是无法修改结果配置的，导致原本想编译extra的生成文件，结果相反
  // return {
  //   config,
  //   trans
  // }

  return cb => {
    return (options, plgConfig) => {
      const defaultCfg = { ...config, ...plgConfig };
      const { file } = options;
      const { encoding } = config;

      plgConfig.extra = defaultCfg.extra;

      if (defaultCfg.ignore) {
        if (file.path.match(defaultCfg.ignore)) return;
      }

      if (!file.path.match(defaultCfg.match)) return;

      if (encoding) {
        file.contents = file.contents.toString(encoding);
      }

      const otherConfig = {};
      for (let key in plgConfig) {
        if (!plgConfig.hasOwnProperty(key)) break;
        if (config.hasOwnProperty(key)) break;
        otherConfig[key] = plgConfig[key];
      }

      const result = cb(options, otherConfig);
      if (result instanceof Promise) {
        result.then(options => {
          hanldeFile(options.file);
          return options;
        });
      } else {
        hanldeFile(options.file);
      }

      function hanldeFile(file) {
        if (defaultCfg.afterExt) {
          file.ext = defaultCfg.afterExt;
        }
        if (encoding) {
          file.contents = Buffer.from(file.contents, encoding);
        }
      }

      return result;
    };
  };
};

export default createPlugin;

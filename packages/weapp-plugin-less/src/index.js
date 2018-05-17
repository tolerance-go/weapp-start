import less from 'less';
import path from 'path';
import fs from 'fs';

const cache = {};

const resolver = {
  install: function(_less, pluginManager) {
    var fm = new less.FileManager();
    fm.loadFile = function(filename, dir, options, env, cb) {
      return new Promise(function(resolve, reject) {
        if (path.isAbsolute(filename)) {
          filename = path.join(process.cwd(), cache.src, filename);
        } else {
          filename = path.join(dir || cache.dirname, filename);
        }
        const contents = fs.readFileSync(filename, 'utf8');
        // FIXME adding prefix while I shouldn't have to
        resolve({ contents, filename });
        // or
        // reject("could not find " + filename);
      });
    };
    fm.supportsSync = false;
    pluginManager.addFileManager(fm);
  },
};

export default function({ config, file, status, extra }, plgConfig) {
  const defaultConfig = {
    match: /\.wxss$/,
    afterExt: '.wxss',
    plugins: [resolver],
    ...plgConfig,
  };

  // eslint-disable-next-line
  const { ext, afterExt, ...passConfig } = defaultConfig;

  if (defaultConfig.ignore) {
    if (file.path.match(defaultConfig.ignore)) return;
  }

  if (!file.path.match(defaultConfig.match)) return;
  const contents = file.contents.toString();

  cache.dirname = file.dir;
  cache.src = config.src;

  return new Promise((resolve, reject) => {
    less.render(contents, passConfig).then((res, imports) => {
      file.contents = Buffer.from(res.css);
      file.ext = defaultConfig.afterExt;
      resolve({ config, file, status, extra });
    });
  });
}

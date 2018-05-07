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
          filename = path.join(cache.dirname, filename);
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
  if (file.extname !== '.wxss') return;
  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  plgConfig.plugins = [resolver];

  cache.dirname = file.dirname;
  cache.src = config.src;

  return new Promise((resolve, reject) => {
    less
      .render(contents, plgConfig)
      .then((res, imports) => {
        file.contents = res.css;
        resolve({ config, file, status, extra });
      })
      .catch(reject);
  });
}

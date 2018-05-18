import less from 'less';
import path from 'path';
import fs from 'fs';
import createPlugin from 'weapp-util-create-plugin';

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
        cache.byDependPaths.push({
          byDependPath: filename,
          dependPath: cache.path,
        });
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

export default createPlugin({
  match: /\.wxss$/,
  afterExt: '.wxss',
  encoding: 'utf8',
})(({ config, file, status, extra, byDependPaths }, plgConfig) => {
  cache.dirname = file.dir;
  cache.src = config.src;
  cache.path = file.path;
  cache.byDependPaths = byDependPaths;

  return new Promise((resolve, reject) => {
    plgConfig.plugins = [resolver];
    less.render(file.contents, plgConfig).then((res, imports) => {
      file.contents = res.css;
      resolve({ config, file, status, extra });
    });
  });
});

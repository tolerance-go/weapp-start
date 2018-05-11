const vfs = require('vinyl-fs');
const through = require('through2');
const rimraf = require('rimraf');
const { readFileSync, existsSync } = require('fs');
const { join, relative, parse } = require('path');
const chokidar = require('chokidar');
const assert = require('./utils/assert');
const log = require('./utils/log');
const write = require('./utils/write');
const resolveCwd = require('resolve-cwd');

const cwd = process.cwd();

const getConfig = () => {
  const pts = [join(cwd, 'weapp.config.js'), join(cwd, 'weapp-config.js')];
  let existPt;

  for (let pt of pts) {
    if (existsSync(pt)) {
      existPt = pt;
      break;
    }
  }
  if (!existPt) {
    throw new Error('weapp-config.js cannot find');
  }

  const config = require(existPt);
  return config.default || config;
};

// const demoPlugin = ({code, modify, path}) => {};

function transform(opts = {}) {
  const { status, config, file } = opts;
  const { cwd } = file;

  const extra = {
    _extra: [],
    _map: {},
    push({ path, mode, contents }) {
      if (this._map[path + mode]) return;
      this._map[path + mode] = true;
      this._extra.push({
        path,
        mode,
        contents,
      });
    },
  };

  const params = Promise.resolve({ config, file, status, extra });

  const waitPlg = config.resolvedPlugins.reduce(async (params, next) => {
    return params
      .then(options => {
        let result = next.plugin(options, next.config);
        if (result) {
          assert(
            result instanceof Promise,
            'plugin should return a promise or not return value just modify file'
          );
        }
        if (!result) {
          result = Promise.resolve(options);
        }
        return result;
      })
      .catch(e => log.error(e));
  }, params);

  return waitPlg
    .then(options => {
      options.extra._extra.forEach(({ path: resolvedPath, mode, contents }) => {
        setTimeout(() => {
          if (mode === 'add') {
            log.success(`${resolvedPath.replace(`${cwd}/`, '')}`, 'NPM ADD');
            write(resolvedPath, contents);
          }
          if (mode === 'remove') {
            rimraf.sync(resolvedPath);
          }
        });
      });
      return options;
    })
    .catch(e => log.error(e));
}

function build(config) {
  const { src, dist } = config;
  rimraf.sync(join(cwd, dist));
  vfs
    .src(join(src, '/**/*.*'))
    .pipe(
      through.obj(async (file, enc, cb) => {
        const { basename, extname, dirname, cwd, path, contents } = file;
        // File.contents can only be a Buffer, a Stream, or null.
        const passFile = { basename, extname, dirname, cwd, path, contents };
        log.info(`${path.replace(`${cwd}/`, '')}`, 'TRANSFORM');
        const options = await transform({
          config,
          file: passFile,
        });
        file.contents = new Buffer(options.file.contents);
        cb(null, file);
      })
    )
    .pipe(vfs.dest(dist));
}

const start = mode => {
  const config = {
    src: 'src',
    dist: 'dist',
    plugins: [],
    ...getConfig(),
  };

  const { src, dist, plugins } = config;
  const dev = mode === 'dev';

  process.env.NODE_ENV = dev ? 'development' : 'production';

  const resolvedPlugins = plugins.map(plg => {
    let plgConfig = {};
    if (Array.isArray(plg)) {
      plgConfig = plg[1];
      // order attention
      plg = plg[0];
    }
    const resolvedPath = resolveCwd(plg);
    if (!existsSync(resolvedPath)) log.error(`npm ${plg} not find, please install first`);
    const npm = require(resolvedPath);
    return {
      config: plgConfig,
      plugin: npm.default || npm,
    };
  });

  config.resolvedPlugins = resolvedPlugins;

  build(config);

  if (dev) {
    const watcher = chokidar.watch(join(cwd, src), {
      ignoreInitial: true,
    });
    watcher.on('all', async (event, fullPath) => {
      if (event === 'unlink' || event === 'unlinkDir') {
        log.print(fullPath.replace(`${cwd}/`, ''), 'REMOVED', 'magenta');
        return rimraf.sync(join(join(cwd, dist), relative(join(cwd, src), fullPath)));
      }

      if (event === 'add' || event === 'addDir') {
        log.print(`${fullPath.replace(`${cwd}/`, '')}`, 'ADD', 'yellow');
      }

      if (event === 'change') {
        log.print(`${fullPath.replace(`${cwd}/`, '')}`, 'CHANGED', 'greenBright');
      }

      if (event !== 'addDir') {
        const relPath = relative(join(cwd, src), fullPath);
        const contents = readFileSync(fullPath, 'utf-8');
        const pathData = parse(fullPath);
        const file = {
          basename: pathData.base,
          extname: pathData.ext,
          dirname: pathData.dir,
          cwd,
          path: fullPath,
          contents,
        };
        try {
          const options = await transform({
            file,
            config,
            status: event,
          });
          write(join(cwd, dist, relPath), options.file.contents);
        } catch (e) {
          log.error('Compiled failed.');
          log.error(e.message);
        }
      }
    });
  }
};

export default start;

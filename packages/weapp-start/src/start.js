import rimraf from 'rimraf';
import { statSync, readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, parse } from 'path';
import chokidar from 'chokidar';
import assert from './utils/assert';
import log from './utils/log';
import { saveWrite, saveCopy } from './utils/save';
import resolveCwd from 'resolve-cwd';

const cwd = process.cwd();

// key 被依赖文件，value 依赖文件数组
const byDependPaths = {
  _byDependPaths: {},
  push({ dependPath, byDependPath }) {
    let depends = this._byDependPaths[byDependPath];

    if (!depends) {
      this._byDependPaths[byDependPath] = [dependPath];
      return;
    }

    if (depends.indexOf(dependPath) !== -1) return;

    depends.push(dependPath);
  },
  getDepends(byDependPath) {
    return this._byDependPaths[byDependPath] || [];
  },
};

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

  const options = Promise.resolve({ config, file, status, extra, byDependPaths });

  const waitPlg = config.resolvedPlugins.reduce(async (options, next) => {
    return options
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
      .catch(err => {
        log.error(`[${next.name} error]: ${err}`);
      });
  }, options);

  return waitPlg
    .then(options => {
      options.extra._extra.forEach(({ path: resolvedPath, mode, contents }) => {
        setTimeout(() => {
          if (mode === 'add') {
            log.success(`${resolvedPath.replace(`${cwd}/`, '')}`, 'EXTRA');
            saveWrite(resolvedPath, contents);
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

async function handleFile(resolvedSrcPath, resolvedDistPath, config, status) {
  log.info(`${resolvedSrcPath.replace(`${cwd}/`, '')}`, 'TRANSFORM');

  if (resolvedSrcPath.match(/\.(png|jpg|jpeg|jpe|gif)$/gi)) {
    return saveCopy(resolvedSrcPath, resolvedDistPath);
  }

  const contents = readFileSync(resolvedSrcPath, 'utf-8');
  const pathObj = parse(resolvedSrcPath);
  const passFile = {
    ...pathObj,
    contents,
    path: resolvedSrcPath,
  };

  const { file } = await transform({
    file: passFile,
    config,
    status,
  });

  if (!file.throw) {
    const customResolvedDistPath = join(
      config.resolvedDist,
      parse(relative(config.resolvedSrc, resolvedSrcPath)).dir,
      `${file.name}${file.ext}`
    );

    saveWrite(customResolvedDistPath, file.contents);
  }

  const depends = byDependPaths.getDepends(resolvedSrcPath);
  if (depends.length) {
    depends.forEach(dependResolvedSrcPath => {
      const dependResolvedDistPath = join(
        config.resolvedDist,
        relative(config.resolvedSrc, dependResolvedSrcPath)
      );
      handleFile(dependResolvedSrcPath, dependResolvedDistPath, config, status);
    });
  }
}

async function copy(resolvedSrcPath, resolvedDistPath, handleFile, config) {
  if (!existsSync(resolvedSrcPath)) return;
  const status = statSync(resolvedSrcPath);
  if (status.isDirectory()) {
    mkdirSync(resolvedDistPath);
    const files = readdirSync(resolvedSrcPath);
    files.forEach(file => {
      copy(join(resolvedSrcPath, file), join(resolvedDistPath, file), handleFile, config);
    });
  } else {
    try {
      handleFile(resolvedSrcPath, resolvedDistPath, config);
    } catch (err) {
      log.error(`copy compiled failed: ${err}`);
    }
  }
}

function build(config) {
  const { resolvedDist, resolvedSrc } = config;
  rimraf.sync(resolvedDist);
  copy(resolvedSrc, resolvedDist, handleFile, config);
}

const start = mode => {
  const config = {
    cwd,
    src: 'src',
    dist: 'dist',
    plugins: [],
    ...getConfig(),
  };

  config.resolvedSrc = join(cwd, config.src);
  config.resolvedDist = join(cwd, config.dist);

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
      name: plg,
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
    watcher.on('all', async (event, resolvedSrcPath) => {
      if (event === 'unlink' || event === 'unlinkDir') {
        log.print(resolvedSrcPath.replace(`${cwd}/`, ''), 'REMOVED', 'magenta');
        return rimraf.sync(join(join(cwd, dist), relative(join(cwd, src), resolvedSrcPath)));
      }

      if (event === 'add' || event === 'addDir') {
        log.print(`${resolvedSrcPath.replace(`${cwd}/`, '')}`, 'ADD', 'yellow');
      }

      if (event === 'change') {
        log.print(`${resolvedSrcPath.replace(`${cwd}/`, '')}`, 'CHANGED', 'greenBright');
      }

      if (event !== 'addDir') {
        try {
          const resolvedDistPath = join(
            config.resolvedDist,
            relative(config.resolvedSrc, resolvedSrcPath)
          );

          handleFile(resolvedSrcPath, resolvedDistPath, config, event);
        } catch (e) {
          log.error(`changed file compiled failed: ${e.message}`);
        }
      }
    });
  }
};

export default start;

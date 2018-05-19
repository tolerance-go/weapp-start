import rimraf from 'rimraf';
import { statSync, readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, parse } from 'path';
import chokidar from 'chokidar';
import assert from './utils/assert';
import log from './utils/log';
import { saveWrite } from './utils/save';
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
  const { status, config, file, resolvedPlugins } = opts;

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

  return resolvedPlugins
    .reduce(async (options, next) => {
      return options
        .then(options => {
          assert(Buffer.isBuffer(options.file.contents), 'file contents must be a Buffer');

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
          log.error(new Error(`[${next.name} err]：${err}`));
        });
    }, options)
    .then(options => {
      options.extra._extra.forEach(({ path: resolvedDistPath, mode, contents }) => {
        // 等待所有 src transform 结束
        setTimeout(() => {
          assert(Buffer.isBuffer(contents), 'extra file contents must be a Buffer');

          log.extra(`${resolvedDistPath.replace(`${cwd}/`, '')}`);
          saveWrite(resolvedDistPath, contents);

          setTimeout(async () => {
            const extraPlugins = config.resolvedPlugins.filter(item => item.config.extra);

            if (extraPlugins.length) {
              // 处理 extra 的插件，需要判断 status，当 status 为 extra 时，不可以继续 push extra，否则会造成死循环
              handleSrcFile(resolvedDistPath, resolvedDistPath, extraPlugins, config, 'extra');
            }
          });
        });
      });
      return options;
    })
    .catch(err => log.error(new Error(`transform: ${err}`)));
}

async function handleSrcFile(resolvedSrcPath, resolvedDistPath, resolvedPlugins, config, status) {
  if (resolvedSrcPath.match(/\.DS_Store$/gi)) return;

  log.transform(`${resolvedSrcPath.replace(`${cwd}/`, '')}`);

  const contents = readFileSync(resolvedSrcPath);
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
    resolvedPlugins,
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
      handleSrcFile(dependResolvedSrcPath, dependResolvedDistPath, resolvedPlugins, config, status);
    });
  }
}

async function copy(resolvedSrcPath, resolvedDistPath, resolvedPlugins, handleSrcFile, config) {
  if (!existsSync(resolvedSrcPath)) return;
  const status = statSync(resolvedSrcPath);
  if (status.isDirectory()) {
    if (!existsSync(resolvedDistPath)) {
      mkdirSync(resolvedDistPath);
    }
    const files = readdirSync(resolvedSrcPath);
    files.forEach(file => {
      copy(
        join(resolvedSrcPath, file),
        join(resolvedDistPath, file),
        resolvedPlugins,
        handleSrcFile,
        config
      );
    });
  } else {
    handleSrcFile(resolvedSrcPath, resolvedDistPath, resolvedPlugins, config);
  }
}

function build(config) {
  const { resolvedDist, resolvedSrc, resolvedPlugins, mode } = config;
  if (mode === 'build') {
    rimraf.sync(resolvedDist);
  }
  copy(resolvedSrc, resolvedDist, resolvedPlugins, handleSrcFile, config);
}

function resolvePkg(plg) {
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
}

const start = mode => {
  const config = {
    mode,
    cwd,
    src: 'src',
    dist: 'dist',
    plugins: [],
    env: {},
    ...getConfig(),
    resolvedPlugins: [],
  };

  config.resolvedSrc = join(cwd, config.src);
  config.resolvedDist = join(cwd, config.dist);

  const { src, dist, plugins } = config;

  const dev = mode === 'dev';
  process.env.NODE_ENV = dev ? 'development' : 'production';

  let resolvedPlugins = plugins.map(resolvePkg);

  const envConfig = config.env[process.env.NODE_ENV];
  if (envConfig && envConfig.plugins) {
    assert(Array.isArray(envConfig.plugins), 'plugins type must be Array');
    resolvedPlugins = resolvedPlugins.concat(envConfig.plugins.map(resolvePkg));
  }

  config.resolvedPlugins = resolvedPlugins;

  build(config);

  if (dev) {
    const watcher = chokidar.watch(join(cwd, src), {
      ignoreInitial: true,
    });
    watcher.on('all', async (event, resolvedSrcPath) => {
      const printPath = resolvedSrcPath.replace(`${cwd}/`, '');

      if (event === 'unlink' || event === 'unlinkDir') {
        log.remove(printPath);
        return rimraf.sync(join(join(cwd, dist), relative(join(cwd, src), resolvedSrcPath)));
      }

      if (event === 'add' || event === 'addDir') {
        log.add(printPath);
      }

      if (event === 'change') {
        log.change(printPath);
      }

      if (event !== 'addDir') {
        const resolvedDistPath = join(
          config.resolvedDist,
          relative(config.resolvedSrc, resolvedSrcPath)
        );

        handleSrcFile(resolvedSrcPath, resolvedDistPath, config.resolvedPlugins, config, event);
      }
    });
  }
};

export default start;

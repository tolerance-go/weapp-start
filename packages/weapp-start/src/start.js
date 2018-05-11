import rimraf from 'rimraf';
import { statSync, readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, parse } from 'path';
import chokidar from 'chokidar';
import assert from './utils/assert';
import log from './utils/log';
import { saveWrite } from './utils/save';
import resolveCwd from 'resolve-cwd';

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

  const options = Promise.resolve({ config, file, status, extra });

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
            log.success(`${resolvedPath.replace(`${cwd}/`, '')}`, 'NPM ADD');
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

async function copy(resolvedSrcPath, resolvedDistPath, transform, config) {
  if (!existsSync(resolvedSrcPath)) return;
  const status = statSync(resolvedSrcPath);
  if (status.isDirectory()) {
    mkdirSync(resolvedDistPath);
    const files = readdirSync(resolvedSrcPath);
    files.forEach(file => {
      copy(join(resolvedSrcPath, file), join(resolvedDistPath, file), transform, config);
    });
  } else {
    try {
      const contents = readFileSync(resolvedSrcPath);
      const pathObj = parse(resolvedSrcPath);
      const passFile = {
        ...pathObj,
        contents,
        path: resolvedSrcPath,
      };
      log.info(`${resolvedSrcPath.replace(`${cwd}/`, '')}`, 'TRANSFORM');
      const { file } = await transform({ config, file: passFile });
      writeFileSync(
        join(parse(resolvedDistPath).dir, `${file.name}${file.ext}`), // no-prettier
        file.contents
      );
    } catch (err) {
      log.error(err);
    }
  }
}

function build(config) {
  const { resolvedDist, resolvedSrc } = config;
  rimraf.sync(resolvedDist);
  copy(resolvedSrc, resolvedDist, transform, config);
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
        const contents = readFileSync(fullPath, 'utf-8');
        const pathData = parse(fullPath);
        const file = {
          ...pathData,
          path: fullPath,
          contents,
        };
        try {
          const options = await transform({
            file,
            config,
            status: event,
          });

          const distFullPath = join(
            config.resolvedDist,
            parse(relative(config.resolvedSrc, fullPath)).dir,
            `${options.file.name}${options.file.ext}`
          );
          saveWrite(distFullPath, options.file.contents);
        } catch (e) {
          log.error(`Compiled failed: ${e.message}`);
        }
      }
    });
  }
};

export default start;

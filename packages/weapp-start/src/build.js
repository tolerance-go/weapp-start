import { join, relative } from 'path';
import { existsSync, statSync, readdirSync, mkdirSync } from 'fs';
import rimraf from 'rimraf';
import log from './utils/log';
import chokidar from 'chokidar';
import getFileObj from './getFileObj';
const cwd = process.cwd();

function isIgnoreFile(config, path) {
  if (path.match(/\.DS_Store$/gi)) return true;
  if (!config.ignore) return false;
  return config.ignore.match(path);
}

function collect(resolvedSrcPath, resolvedDistPath, filsObjs) {
  if (!existsSync(resolvedSrcPath)) return;
  const status = statSync(resolvedSrcPath);
  if (status.isDirectory()) {
    if (!existsSync(resolvedDistPath)) {
      mkdirSync(resolvedDistPath);
    }
    const files = readdirSync(resolvedSrcPath);
    files.forEach(file => {
      collect(join(resolvedSrcPath, file), join(resolvedDistPath, file), filsObjs);
    });
  } else {
    filsObjs.push(getFileObj(resolvedSrcPath, resolvedDistPath));
  }
}

function build(config) {
  const { resolvedDist, resolvedSrc, mode } = config;
  if (mode === 'build') {
    rimraf.sync(resolvedDist);
  }
  const filsObjs = [];
  collect(resolvedSrc, resolvedDist, filsObjs);
  filsObjs.forEach(file => {
    if (isIgnoreFile(config, file.path)) return;
    config.transform(file);
  });
}

function watch(config) {
  const { resolvedSrc, resolvedDist } = config;
  const watcher = chokidar.watch(resolvedSrc, {
    ignoreInitial: true,
  });
  watcher.on('all', (event, resolvedSrcPath) => {
    const printPath = resolvedSrcPath.replace(`${cwd}/`, '');

    if (event === 'unlink' || event === 'unlinkDir') {
      log.remove(printPath);
      return rimraf.sync(join(resolvedDist, relative(resolvedSrc, resolvedSrcPath)));
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

      const file = getFileObj(resolvedSrcPath, resolvedDistPath);
      if (isIgnoreFile(config, file.path)) return;
      config.transform(file);
    }
  });
}

export { watch, build };

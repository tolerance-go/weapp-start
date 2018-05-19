import eventBus from './eventBus';
import extra from './extra';
import byDependPaths from './byDependPaths';
import { join, parse, relative } from 'path';
import log from './utils/log';
import { saveWrite } from './utils/save';
import getFileObj from './getFileObj';
const cwd = process.cwd();

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function generateTransform(config, onlyHandleExtraPlugin) {
  // 准备 API
  const middlewareAPI = {
    config,
    log,
    eventBus,
    byDependPaths,
  };

  let middlewares = config.resolvedPlugins;

  // 生成transform plugin

  if (onlyHandleExtraPlugin) {
    middlewares = middlewares.filter(plg => plg.config.extra);
  }

  const chain = middlewares.map(middleware => {
    return middleware.plugin({ ...middlewareAPI, pluginConfig: middleware.config });
  });

  // post file handle
  const base = file => {
    const { resolvedDist, resolvedSrc } = config;

    const { path } = file;
    log.transform(`${path.replace(`${cwd}/`, '')}`);

    // extra
    extra(file.extra, config);

    // throw
    if (!file.throw) {
      const customResolvedDistPath = join(
        resolvedDist,
        parse(relative(resolvedSrc, path)).dir,
        `${file.name}${file.ext}`
      );
      saveWrite(customResolvedDistPath, file.contents);
    }

    // depends
    const depends = byDependPaths.getDepends(path);
    if (depends.length) {
      depends.forEach(dependResolvedSrcPath => {
        const dependResolvedDistPath = join(
          resolvedDist,
          relative(resolvedSrc, dependResolvedSrcPath)
        );
        transform(getFileObj(dependResolvedSrcPath, dependResolvedDistPath));
      });
    }
  };

  const transform = compose(...chain)(base);
  return transform;
}

export default generateTransform;

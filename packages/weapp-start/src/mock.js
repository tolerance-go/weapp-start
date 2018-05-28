import { existsSync, readdirSync, lstatSync } from 'fs';
import { parse, join } from 'path';
import assert from 'assert';
import chokidar from 'chokidar';
import chalk from 'chalk';
import proxy from 'express-http-proxy';
import url from 'url';
import bodyParser from 'body-parser';
import express from 'express';

let error = null;
const cwd = process.cwd();
const mockDir = join(cwd, 'mock');
const mockFile = join(cwd, 'mock.js');

function getConfig() {
  const config = {};
  const existDir = existsSync(mockDir);
  const existFile = existsSync(mockFile);

  if (existDir || existFile) {
    // disable require cache
    Object.keys(require.cache).forEach(file => {
      if (file.indexOf(mockDir) > -1) {
        delete require.cache[file];
      }
    });

    if (existDir) {
      const files = readdirSync(mockDir);
      files.forEach(file => {
        const fullPath = join(mockDir, file);
        if (lstatSync(fullPath).isDirectory()) {
          return console.log(chalk.red('mock folders support only one level of directories'));
        }
        if (parse(fullPath).ext === '.js') {
          Object.assign(config, require(fullPath));
        }
      });
    }

    if (existFile) {
      Object.assign(config, require(mockFile));
    }
  }
  return config;
}

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (typeof value === 'function') {
      value(...args);
    } else {
      res.json(value);
    }
  };
}

function createProxy(method, path, target) {
  return proxy(target, {
    filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath(req) {
      let matchPath = req.originalUrl;
      const matches = matchPath.match(path);
      if (matches.length > 1) {
        matchPath = matches[1];
      }
      return join(url.parse(target).path, matchPath);
    },
  });
}

function applyMock(app) {
  try {
    realApplyMock(app);
    error = null;
  } catch (e) {
    console.log(e);
    error = e;
    outputError();

    const watcher = chokidar.watch([mockDir, mockFile], {
      ignored: /node_modules/,
      ignoreInitial: true,
    });
    watcher.on('change', path => {
      console.log(chalk.green('CHANGED'), path.replace(cwd + '/', ''));
      watcher.close();
      applyMock(app);
    });
  }
}

function realApplyMock(app) {
  const config = getConfig();

  app.use(bodyParser.json({ limit: '5mb', strict: false }));
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '5mb',
    })
  );

  Object.keys(config).forEach(key => {
    const keyParsed = parseKey(key);
    assert(!!app[keyParsed.method], `method of ${key} is not valid`);
    assert(
      typeof config[key] === 'function' ||
        typeof config[key] === 'object' ||
        typeof config[key] === 'string',
      `mock value of ${key} should be function or object or string, but got ${typeof config[key]}`
    );
    if (typeof config[key] === 'string') {
      let { path } = keyParsed;
      if (/\(.+\)/.test(path)) {
        path = new RegExp(`^${path}$`);
      }
      app.use(path, createProxy(keyParsed.method, path, config[key]));
    } else {
      app[keyParsed.method](
        keyParsed.path,
        createMockHandler(keyParsed.method, keyParsed.path, config[key])
      );
    }
  });

  const watcher = chokidar.watch([mockDir, mockFile], {
    ignored: /node_modules/,
    persistent: true,
  });
  watcher.on('change', path => {
    console.log(chalk.green('CHANGED'), path.replace(cwd + '/', ''));
    watcher.close();

    // 删除旧的 mock api
    app._router.stack = app._router.stack.filter(item => item.name !== 'bound dispatch');

    applyMock(app);
  });
}

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method, path };
}

function outputError() {
  if (!error) return;

  const filePath = error.message.split(': ')[0];
  const relativeFilePath = filePath.replace(cwd + '/', '');
  const errors = error.stack
    .split('\n')
    .filter(line => line.trim().indexOf('at ') !== 0)
    .map(line => line.replace(`${filePath}: `, ''));
  errors.splice(1, 0, ['']);

  console.log(chalk.red('Failed to parse mock config.'));
  console.log();
  console.log(`Error in ${relativeFilePath}`);
  console.log(errors.join('\n'));
  console.log();
}

function launchMock(opts = {}) {
  const { port = 3000 } = opts;
  const app = express();
  applyMock(app);
  app.listen(port);
  console.log(chalk.green('\n🔥 mock server start:', `http://localhost:${port}\n`));
}

export default launchMock;

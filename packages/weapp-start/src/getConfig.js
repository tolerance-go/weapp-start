import { join } from 'path';
import resolveCwd from 'resolve-cwd';
import { existsSync } from 'fs';
import log from './utils/log';
import assert from './utils/assert';
const cwd = process.cwd();

const getRootCfg = () => {
  const pts = [join(cwd, 'weapp.config.js'), join(cwd, 'weapp-config.js')];
  let existPt;

  for (let pt of pts) {
    if (existsSync(pt)) {
      existPt = pt;
      break;
    }
  }

  assert(existPt, 'weapp-config.js cannot find');

  const config = require(existPt);
  return config.default || config;
};

const resolvePkg = plg => {
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
};

let config;
function getConfig(mode) {
  if (config) return config;
  config = {
    mode,
    cwd,
    src: 'src',
    dist: 'dist',
    plugins: [],
    env: {},
    ...getRootCfg(),
    resolvedPlugins: [],
  };

  config.resolvedSrc = join(cwd, config.src);
  config.resolvedDist = join(cwd, config.dist);

  const dev = mode === 'dev';
  process.env.NODE_ENV = dev ? 'development' : 'production';

  let resolvedPlugins = config.plugins.map(resolvePkg);

  const envConfig = config.env[process.env.NODE_ENV];
  if (envConfig && envConfig.plugins) {
    assert(Array.isArray(envConfig.plugins), 'plugins type must be Array');
    resolvedPlugins = resolvedPlugins.concat(envConfig.plugins.map(resolvePkg));
  }

  config.resolvedPlugins = resolvedPlugins;
  return config;
}

export default getConfig;

import assert from './utils/assert';
import log from './utils/log';
import { saveWrite } from './utils/save';
import getFileObj from './getFileObj';
import { existsSync } from 'fs';
const cwd = process.cwd();

function extra(extraPaths, config) {
  for (let resolvedDistPath in extraPaths) {
    if (!extraPaths.hasOwnProperty(resolvedDistPath)) break;

    if (existsSync(resolvedDistPath)) continue;

    const { contents } = extraPaths[resolvedDistPath];

    assert(Buffer.isBuffer(contents), 'extra file contents must be a Buffer');

    log.extra(`${resolvedDistPath.replace(`${cwd}/`, '')}`);
    saveWrite(resolvedDistPath, contents);

    const middlewares = config.resolvedPlugins.filter(plg => plg.config.extra);

    if (middlewares.length) {
      config.extraTransform(getFileObj(resolvedDistPath, resolvedDistPath));
    }
  }
}

export default extra;

import assert from './utils/assert';
import log from './utils/log';
import { saveWrite } from './utils/save';
import getFileObj from './getFileObj';
import { existsSync } from 'fs';
const cwd = process.cwd();

function extra(extraPaths, config) {
  const middlewares = config.resolvedPlugins.filter(plg => plg.config.extra);

  for (let resolvedDistPath in extraPaths) {
    if (!extraPaths.hasOwnProperty(resolvedDistPath)) break;

    if (existsSync(resolvedDistPath)) continue;

    const { contents, noProcess } = extraPaths[resolvedDistPath];

    assert(Buffer.isBuffer(contents), 'extra file contents must be a Buffer');

    log.extra(`${resolvedDistPath.replace(`${cwd}/`, '')}`);

    if (!noProcess && middlewares.length) {
      const file = getFileObj(resolvedDistPath, resolvedDistPath, contents);
      config.rawExtraTransform(file);
      saveWrite(resolvedDistPath, file.contents);
    } else {
      saveWrite(resolvedDistPath, contents);
    }
  }
}

export default extra;

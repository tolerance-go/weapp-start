import assert from './utils/assert';
import log from './utils/log';
import { saveWrite } from './utils/save';
import getFileObj from './getFileObj';
import { existsSync } from 'fs';
const cwd = process.cwd();

function extra(extraPaths, config) {
  for (let resolvedDistPath in extraPaths) {
    if (!extraPaths.hasOwnProperty(resolvedDistPath)) break;

    if (existsSync(resolvedDistPath)) return;

    const { contents } = extraPaths[resolvedDistPath];

    assert(Buffer.isBuffer(contents), 'extra file contents must be a Buffer');

    log.extra(`${resolvedDistPath.replace(`${cwd}/`, '')}`);
    saveWrite(resolvedDistPath, contents);

    // 处理 extra 的插件，需要判断 status，当 status 为 extra 时，不可以继续 push extra，否则会造成死循环
    config.extraTransform(getFileObj(resolvedDistPath, resolvedDistPath));
  }
}

export default extra;

import { build, watch } from './build';
import getConfig from './getConfig';
import generateTransform from './transform';
import log from './utils/log';

const start = mode => {
  try {
    const config = getConfig(mode);
    const transform = generateTransform(config, 'all', 'effect');
    const rawExtraTransform = generateTransform(config, 'extra', 'raw');

    config.transform = transform;
    config.rawExtraTransform = rawExtraTransform;

    build(config);
    if (config.mode === 'dev') {
      watch(config);
    }
  } catch (err) {
    log.error(err);
  }
};

export default start;

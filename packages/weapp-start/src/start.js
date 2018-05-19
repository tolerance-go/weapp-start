import { build, watch } from './build';
import getConfig from './getConfig';
import generateTransform from './transform';
import log from './utils/log';

const start = mode => {
  try {
    const config = getConfig(mode);
    const transform = generateTransform(config);
    const extraTransform = generateTransform(config, 'extra');

    config.transform = transform;
    config.extraTransform = extraTransform;

    build(config);
    if (config.mode === 'dev') {
      watch(config);
    }
  } catch (err) {
    log.error(err);
  }
};

export default start;

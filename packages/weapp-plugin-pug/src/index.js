import pug from 'pug';

export default function({ config, file, status, extra }, plgConfig) {
  const defaultConfig = {
    match: /\.wxml$/,
    afterExt: '.wxml',
    ...plgConfig,
  };

  if (defaultConfig.ignore) {
    if (file.path.match(defaultConfig.ignore)) return;
  }

  if (!file.path.match(defaultConfig.match)) return;

  const contents = file.contents.toString();

  file.contents = Buffer.from(pug.render(contents, plgConfig));
  file.ext = defaultConfig.afterExt;
}

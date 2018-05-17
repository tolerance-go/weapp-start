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

  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  file.contents = pug.render(contents, plgConfig);
  file.ext = defaultConfig.afterExt;
}

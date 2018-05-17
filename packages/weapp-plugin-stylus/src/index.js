import stylus from 'stylus';

export default function({ config, file, status, extra }, plgConfig) {
  const defaultConfig = {
    match: /\.wxss$/,
    afterExt: '.wxss',
    filename: file.path,
    ...plgConfig,
  };

  if (defaultConfig.ignore) {
    if (file.path.match(defaultConfig.ignore)) return;
  }

  // eslint-disable-next-line
  const { ext, afterExt, ...passConfig } = defaultConfig;

  if (!file.path.match(defaultConfig.match)) return;

  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  return new Promise((resolve, reject) => {
    stylus.render(contents, passConfig, function(err, css) {
      if (err) reject(err);
      file.contents = css;
      file.ext = defaultConfig.afterExt;
      resolve({ config, file, status, extra });
    });
  });
}

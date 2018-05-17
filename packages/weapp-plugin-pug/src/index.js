import pug from 'pug';

export default function({ config, file, status, extra }, plgConfig) {
  if (file.ext !== '.wxml') return;
  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  file.contents = pug.render(contents, plgConfig);
  file.ext = defaultConfig.afterExt;
}

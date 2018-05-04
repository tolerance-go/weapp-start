import stylus from 'stylus';

export default function({ config, file, status, extra }, plgConfig) {
  if (file.extname !== '.wxss') return;
  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  return new Promise((resolve, reject) => {
    stylus.render(contents, plgConfig, function(err, css) {
      if (err) reject(err);
      file.contents = css;
      resolve({ config, file, status, extra });
    });
  });
}

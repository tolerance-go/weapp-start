import less from 'less';

export default function({ config, file, status, extra }, plgConfig) {
  if (file.extname !== '.wxss') return;
  let contents = file.contents;
  if (Buffer.isBuffer(file.contents)) {
    contents = file.contents.toString();
  }
  return new Promise((resolve, reject) => {
    less
      .render(contents, plgConfig)
      .then((res, imports) => {
        file.contents = res.css;
        resolve({ config, file, status, extra });
      })
      .catch(reject);
  });
}

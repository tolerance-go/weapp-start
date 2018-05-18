import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.(jpg|png|svg)$/,
  extra: true,
})((options, plgConfig) => {
  const { file } = options;
  const defaultConfig = {
    jpg: {
      quality: 80,
    },
    png: {
      quality: 80,
    },
    ...plgConfig,
  };

  return imagemin
    .buffer(file.contents, {
      plugins: [
        imageminMozjpeg(defaultConfig.jpg),
        imageminPngquant(defaultConfig.png),
        imageminSvgo(defaultConfig.svg),
      ],
    })
    .then(buffer => {
      file.contents = buffer;
      return options;
    });
});

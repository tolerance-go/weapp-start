module.exports = {
  plugins: [
    [
      'weapp-plugin-replace',
      {
        match: /\.wxss$/,
        config: {
          find: /([0-9])px/gi,
          replace: (match, count) => {
            console.log(match, count);
            return count + 'rpx';
          },
        },
      },
    ],
    [
      'weapp-plugin-copy',
      {
        config: {
          copy: {},
        },
      },
    ],
    // 'weapp-plugin-babel',
    // 'weapp-plugin-require-enhance',
    'weapp-plugin-less',
    // // [
    // //   'weapp-plugin-filter',
    // //   {
    // //     throw: /\.styl$/,
    // //   },
    // // ],
    // [
    //   'weapp-plugin-stylus',
    //   {
    //     match: /\.styl$/,
    //   },
    // ],
    'weapp-plugin-pug',
    // 'weapp-plugin-eslint',
    // [
    //   'weapp-plugin-jsmin',
    //   {
    //     // extra: true,
    //   },
    // ],
    // 'weapp-plugin-imgmin',
    // // 'weapp-plugin-filemin',
    // [
    //   'weapp-plugin-postcss',
    //   {
    //     plugins: [
    //       require('autoprefixer')({
    //         browsers: ['Android >= 2.3', 'Chrome > 20', 'iOS >= 6'],
    //       }),
    //     ],
    //   },
    // ],
  ],
};

module.exports = {
  plugins: [
    'weapp-plugin-babel',
    'weapp-plugin-require',
    'weapp-plugin-less',
    // [
    //   'weapp-plugin-filter',
    //   {
    //     throw: /\.styl$/,
    //   },
    // ],
    [
      'weapp-plugin-stylus',
      {
        match: /\.styl$/,
      },
    ],
    'weapp-plugin-pug',
    'weapp-plugin-eslint',
    [
      'weapp-plugin-jsmin',
      {
        // extra: true,
      },
    ],
    'weapp-plugin-imgmin',
    // 'weapp-plugin-filemin',
    [
      'weapp-plugin-postcss',
      {
        plugins: [
          require('autoprefixer')({
            browsers: ['Android >= 2.3', 'Chrome > 20', 'iOS >= 6'],
          }),
        ],
      },
    ],
  ],
};

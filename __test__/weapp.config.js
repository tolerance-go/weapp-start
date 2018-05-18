module.exports = {
  plugins: [
    'weapp-plugin-babel',
    'weapp-plugin-require',
    // 'weapp-plugin-less',
    [
      'weapp-plugin-stylus',
      {
        match: /\.styl$/,
      },
    ],
    // 'weapp-plugin-pug',
    // 'weapp-plugin-eslint',
    'weapp-plugin-jsmin',
  ],
};

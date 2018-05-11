module.exports = {
  plugins: [
    'weapp-plugin-babel',
    'weapp-plugin-require',
    'weapp-plugin-less',
    [
      'weapp-plugin-stylus',
      {
        ext: '.styl',
      },
    ],
    'weapp-plugin-pug',
    'weapp-plugin-eslint',
  ],
};

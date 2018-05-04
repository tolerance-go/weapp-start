module.exports = {
  plugins: [
    [
      'weapp-plugin-babel',
      {
        presets: [require('babel-preset-env')],
        plugins: ['add-module-exports', 'transform-object-rest-spread', 'transform-runtime'],
      },
    ],
    'weapp-plugin-require',
    'weapp-plugin-less',
    'weapp-plugin-pug',
    'weapp-plugin-eslint',
  ],
};

# weapp-plugin-jsmin

压缩 `.js` 文件

## 安装 

```bash
npm i weapp-plugin-jsmin -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-jsmin', {
        ignore: undefined,
        match: /\.js$/,
        extra: false,
        ...config // https://github.com/mishoo/UglifyJS2#command-line-options
    }]，
    // 'weapp-plugin-jsmin',
  ],
};
```
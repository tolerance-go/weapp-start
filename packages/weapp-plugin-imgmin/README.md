# weapp-plugin-imgmin

压缩图像文件

## 安装 

```bash
npm i weapp-plugin-imgmin -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-imgmin', {
        match: /\.(jpg|png|svg)$/,
        extra: true,
        jpg: {
          quality: 80,
        },
        png: {
          quality: 80,
        },
        svg: undefined,
        ...config // https://github.com/mishoo/UglifyJS2#command-line-options
    }]，
    // 'weapp-plugin-imgmin',
  ],
};
```

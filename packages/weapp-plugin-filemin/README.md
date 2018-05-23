# weapp-plugin-filemin

[pretty-data](https://github.com/vkiryukhin/pretty-data)

## 安装 

```bash
npm i weapp-plugin-filemin -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-filemin', {
        match: /\.(wxml|json|wxss)$/,
        extra: true,
        ...config
    }]，
    // 'weapp-plugin-filemin',
  ],
};
```

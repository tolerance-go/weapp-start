# weapp-plugin-pug

默认编译后缀名为 .wxml 的 pug 语法文件

## 安装 

```bash
npm i weapp-plugin-pug -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-pug', {
        ignore: undefined,
        match: /\.wxml$/,
        afterExt: '.wxml',
        ...config
    }]，
    // 'weapp-plugin-pug',
  ],
};
```
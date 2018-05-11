# weapp-plugin-stylus

默认编译后缀名为 .wxss 的 stylus 语法文件

## 安装

```bash
npm i weapp-plugin-stylus -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-stylus', {
        ext: '.wxss',
        afterExt: '.wxss',
        ...config
    }]，
    // 'weapp-plugin-stylus',
  ],
};
```
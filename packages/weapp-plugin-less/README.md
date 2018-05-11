# weapp-plugin-less

默认编译后缀名为 .wxss 的 less 语法文件

`@import url(...)` 绝对路径是从 src 目录开始查找的

## 安装

```bash
npm i weapp-plugin-less -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-less', {
        ext: '.wxss',
        afterExt: '.wxss',
        ...config
    }]，
    // 'weapp-plugin-less',
  ],
};
```
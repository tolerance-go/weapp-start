# weapp-plugin-eslint

检查 js 文件语法，可以在 config 定义规则也可以在根目录新建 `.eslintrc`

## 安装

```bash
npm i weapp-plugin-eslint -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-eslint', {
        ignore: undefined,
        match: /\.js$/,
        formatter,
        ...config
    }]，
    // 'weapp-plugin-eslint',
  ],
};
```
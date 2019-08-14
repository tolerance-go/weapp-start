# weapp-plugin-require-enhance

分析 js 文件的 npm 依赖，进行拷贝，修复 weapp-plugin-require 的 bug，并新增了 alias 功能

## 安装

```bash
npm i  weapp-plugin-require-enhance -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-require-enhance', {
        ignore: undefined,
        match: /\.js$/,
        alias: {
          utils: path.resolve(__dirname, 'src/utils/'),
        },
        ...config
    }]，
    // 'weapp-plugin-require-enhance',
  ],
};
```

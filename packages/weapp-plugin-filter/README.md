# weapp-plugin-filter

过滤文件

## 安装

```bash
npm i weapp-plugin-filter -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-filter', {
        throw: undefined, // 抛弃的文件，可以是一个函数
        ...config
    }]，
    // 'weapp-plugin-filter',
  ],
};
```
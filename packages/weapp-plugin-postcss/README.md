# weapp-plugin-postcss

过滤文件

## 安装 

```bash
npm i weapp-plugin-postcss -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-postcss', {
        match: /\.wxss$/,
        plugins: [],
        ...config
    }]，
    // 'weapp-plugin-postcss',
  ],
};
```
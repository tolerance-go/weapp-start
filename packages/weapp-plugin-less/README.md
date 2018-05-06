# weapp-plugin-less

`@import url(...)` 绝对路径是从 src 目录开始查找的

```bash
npm i weapp-plugin-less -D
```

weapp-config.js

```js
module.exports = {
  plugins: [
    'weapp-plugin-less',
    // ['weapp-plugin-less', {
    //     ...config
    // }]
  ],
};
```
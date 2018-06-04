# weapp-plugin-replace

替换文件文本

## 安装

```bash
npm i weapp-plugin-replace -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-replace', {
        match: /\.wxss$/,
        config: {
          find: /([0-9])px/,
          replace: (match, count) => {
            return count + 'rpx'
          }
        }
    }]，
  ],
};
```

```js
module.exports = {
  plugins: [
    ['weapp-plugin-replace', {
      config: [{
        find: '1',
        replace: '11'
      },{
        find: '2',
        replace: '22'
      }]]
    }，
  ],
};
```


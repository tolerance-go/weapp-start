# weapp-plugin-babel

编译 js 语法 ，可以在 config 定义规则也可以在根目录新建 `.babelrc`

## 安装 

```bash
npm i weapp-plugin-babel -D
```

## 使用
weapp.config.js

```js
module.exports = {
  plugins: [
    ['weapp-plugin-babel', {
        ignore: undefined,
        match: /\.js$/,
        ...config
    }]，
    // 'weapp-plugin-babel',
  ],
};
```
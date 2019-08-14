# weapp-plugin-copy

根据项目中 src 文件夹下的 copy.json 配置，从 node_modules 中复制文件到编译后的 dist 文件中的 npm 目录

## 安装

```bash
npm i  weapp-plugin-copy -D
```

## 使用

weapp.config.js

```js
module.exports = {
  plugins: ['weapp-plugin-copy'],
};
```

copy.json 示例

```js
{
  "pkgData": [
    {
      "source": "node_modules/vant-weapp/lib/",
      "targetFileName": "vant"
    },
    {
      "source": "node_modules/acorn/dist/",
      "targetFileName": "acorn"
    }
  ]
}
```

## TODO

- 自动分析小程序中引入的第三方组件，对依赖组件进行分析，只复制使用到的相关组件

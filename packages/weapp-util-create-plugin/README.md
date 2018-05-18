# weapp-util-create-plugin

创建 weapp 插件

## 安装

```bash
npm i weapp-util-create-plugin
```

## 使用
```js
createPlugin({
  match: ?(String|RegExp),
  ignore: ?(String|RegExp),
  afterExt: ?String,
  extra: ?Boolean=false,
})(...)
```

## 例子
```js
// weapp-plugin-jsmin source code
import uglify from 'uglify-js';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.js$/,
  extra: true,
})(({ config, file, status, extra }, plgConfig) => {
  const result = uglify.minify(file.contents.toString(), plgConfig);
  if (result.error) throw result.error;
  file.contents = Buffer.from(result.code);
});
```
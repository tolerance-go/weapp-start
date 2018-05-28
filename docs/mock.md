# 本地 mock

```bash
weapp-start mock

启动本地mock服务

选项：
  --port, -p     指定端口号                                [数字] [默认值: 3000]
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

```

项目根目录，新建 `mock` 文件夹或者 `mock.js`，可以同时存在，后者优先级更高

文件夹下只有后缀名为 `.js` 的文件会被选中，文件名称对于接口没有影响，可以自由组织

```js
module.exports = {
  '/api/hello-world'(req, res) {
    res.end(`hello-world ${new Date().toString()}`);
  },

  'GET /api/users': { users: [1, 2] },

  'POST /api/users/create': (req, res) => {
    res.end('success');
  },
};
```
# weapp-utils-requestfix-promisify

所有的微信方法都挂在 `wx.$` 对象上

# Usage

```js
import rp from 'weapp-utils-requestfix-promisify';

rp.init({
  noPromiseAPI: [],
  requestfix: true,
  promisify: true,
  intercepts: {
    api() {},
  },
});
```

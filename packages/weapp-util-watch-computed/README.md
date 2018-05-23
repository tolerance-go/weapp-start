# weapp-util-watch-computed

使原生小程序支持 watch，computed 属性

## 安装

```bash
npm i weapp-util-watch-computed
```

## API

### this.$setData
对原生 `setData` 进行了拦截处理，所以要想使用计算属性等功能，不可以调用 `this.setData` 改为 `this.$setData`

### computed
```js
{
  computed: {
    ['计算属性']: ['依赖A', '依赖B', (a, b) => newVal]
  }
}
```

### watch
```js
{
  watch: {
    ['监听属性']: (newVal, oldVal) => {}
  },
}
```

## 使用

watch 和 computed 初始化时候（page：onReady，compon：attached）就会执行一次

```js
import {whcComponent, whcPage} from 'weapp-util-watch-computed';

Page(
  whcPage({
    data: {
      fieldA: 1,
      fieldB: 2,
    },
    watch: {
      fieldA(newVal, oldVal) {
        console.log('fieldA updated', oldVal, '->', newVal);
      },
    },
    computed: {
      fieldC: [
        fieldA,
        fieldB,
        (a, b) => {
          return a + b;
        },
      ],
    },
    onLoad() {
      this.$setData({
        fieldA: 10,
      });
      // =>
      // fieldA === 10
      // fieldB === 2
      // fieldC === 12
    },
  })
);
```

## 链接

* [计算属性 vs 侦听属性](https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7-vs-%E4%BE%A6%E5%90%AC%E5%B1%9E%E6%80%A7)

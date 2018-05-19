/* global Component */

Component({
  // String Array	否	组件接受的外部样式类，参见 [外部样式类](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html)
  externalClasses: [''],
  // Object Map	否	组件的对外属性，是属性名到属性设置的映射表，属性设置中可包含三个字段，
  // type 表示属性类型、 value 表示属性初始值、 observer 表示属性值被更改时的响应函数
  properties: {
    dataSource: {
      type: Array,
      value: [],
    },
  },
  // Object	否	组件的内部数据，和 properties 一同用于组件的模版渲染
  data: {},
  // Object	否	组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用，参见 [组件事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)
  methods: {
    onClick() {
      this.triggerEvent('click', this.data, {});
    },
  },
  // String Array	否	类似于mixins和traits的组件间代码复用机制，参见 [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)
  behaviors: {},
  // Function	否	组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
  created: {},
  // Function	否	组件生命周期函数，在组件实例进入页面节点树时执行
  attached: {},
  // Function	否	组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 [SelectorQuery](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html) ）
  ready: {},
  // Function	否	组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: {},
  // Function	否	组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: {},
  // Object	否	组件间关系定义，参见 [组件间关系](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/relations.html)
  relations: {},
  // Object Map	否	一些组件选项，请参见文档其他部分的说明
  options: {},
});

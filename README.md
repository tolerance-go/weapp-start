
<div align=center>
<image src='./assets/1526620785154.jpg' width="550">
</div>

# weapp-start

[![NPM version](https://img.shields.io/npm/v/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Build Status](https://travis-ci.org/tolerance-go/weapp-start.svg?branch=master)](https://travis-ci.org/tolerance-go/weapp-start)
[![NPM downloads](http://img.shields.io/npm/dm/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Dependencies Status](https://david-dm.org/tolerance-go/weapp-start/status.svg)](https://david-dm.org/tolerance-go/weapp-start)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

选择 weapp-start 进行开发的主要理由之一就是**一切扩展功能全部组件化，可以随意组合，打造合适自己的开发环境**

配合状态管理工具 [weappx](https://github.com/tolerance-go/weappx)，再复杂的小程序也可以轻松应

> 小程序早已原生支持组件化开发，体验下来老牌组件化框架在升级过程中非常不顺利，所以选择使用原生语法进行开发，但是同时有很多非常棒的特性，我希望能保留下来，因此有了这个项目

# Why

- 如果你只是开发一款好用的 小程序，单纯使用 小程序官方文档和规范，我建议你可以尝试本项目，它对于原生小程序开发体验有非常棒的提升

- 如果你熟悉 vue，并且打算使用它们来兼容小程序的开发，那么我推荐你可以尝试 wepy 或者 mpvue，它们也都超赞

- 如果你熟悉 react，并且准备一处编写，多端适配，那么我推荐你使用 taro，虽然 wepy，mpvue 也都支持一键转换 H5，但是体验过不够好，而且和 taro 比较，属于 “生而不同”； 写这段话的时候，taro 刚刚开源没多久，但是我相信 taro 绝对够引人瞩目（其实本项目计划之初，也是准备分阶段完成平台转换功能，至少适配 H5，但是 taro 的出现，让我意识到，如果选择一种底层不变的开发语言，显然 react 要比 小程序语法 优秀的多【感觉上是=。=】）

# Features

* 支持 [npm](https://www.npmjs.com/) 包引入
* 支持 promise, async/await 等最新语法
* 支持多种编译器，如 pug/less/stylus
* 支持 ESlint
* 支持本地 [mock](https://github.com/tolerance-go/weapp-start/blob/master/docs/mock.md) 数据
* 支持一键生成项目，组件模版
* 支持发布前资源压缩
* 支持自定义插件
* 多种工具，加速开发

# Install

```bash
npm i weapp-start -g
```

查看帮助

```bash
weapp-start -h
```

```bash
weapp-start <command> [options]

命令：
  weapp-start dev    watch build
  weapp-start build  打包构建
  weapp-start init   生成模版项目
  weapp-start new    生成模板页面
  weapp-start mock   启动本地mock服务

选项：
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]
```

生成开发模版（项目模板都存放在[这里](https://github.com/tolerance-go/weapp-start-templates)，欢迎小伙伴 pr）

```bash
weapp-start init
```

进入生成目录，安装依赖

```bash
npm i
```

启动实时编译

```bash
weapp-start dev
```

使用微信开发者工具新建项目，项目目录选择刚刚生成的文件夹，会自动导入项目配置

# Tips

- `weapp-plugin-require` 是基于 `commonJS` 模块规范的静态处理，也就是说 `es6` 模块定义的话，需要配合 `weapp-plugin-babel` 插件使用，
`weapp-plugin-babel` 的顺序要在它之前。

- 小程序里面对于 `require('common.js')` 是当做相对路径的，而在 node 中是作为模块查找的，因此应该避免这种隐式的相对路径写法，应该用 `require('./common.js')` 代替；`weapp-plugin-require` 对二者做了兼容，不过会发出提示信息要求修改路径

- `weapp-plugin-jsmin` 只能对 es5 规范的代码进行压缩，将其顺序至于 `weapp-plugin-babel` 之后

- 所有压缩功能的插件，如果想对生成的额外文件进行处理，需要指定参数 `extra` 为 `true`

- 因为小程序的特有运行环境，在兼容外部 npm 包，比如 lodash 的时候，需要做一些 hack 操作，替换文本，但是它们更新太频繁了，精力不够，所以请在主项目锁死版本 lodash 版本号 `"lodash": "4.17.5"`

# Plugins

自定义插件文档 coming...

* [weapp-plugin-babel](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-babel) - 集成 [babel](https://github.com/babel/babel)，可以使用最新的 js 语法，而不必担心兼容
* [weapp-plugin-eslint](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-eslint) - 集成 [eslint](https://github.com/eslint/eslint)，自动检测代码规范
* [weapp-plugin-less](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-less) - 集成 [less](https://github.com/less/less.js)，使用 less 语法编写 wxss
* [weapp-plugin-pug](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-pug) - 集成 [pug](https://github.com/pugjs/pug)，使用 pug 语法编写 wxml
* [weapp-plugin-require](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-require) - 分析依赖，导入第三方 npm
* [weapp-plugin-stylus](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-stylus) - 集成 [stylus](https://github.com/stylus/stylus)，使用 stylus 语法编写 wxss
* [weapp-plugin-filter](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-filter) - 过滤文件
* [weapp-plugin-jsmin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-jsmin) - 压缩 js
* [weapp-plugin-filemin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-filemin) - 压缩 xml，json，css
* [weapp-plugin-imgmin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-imgmin) - 压缩图片
* [weapp-plugin-postcss](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-postcss) - 集成 [postcss](https://github.com/postcss/postcss)，可以使用最新的 css 语法和特效，而不必担心兼容
* [weapp-plugin-replace](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-replace) - 文本替换
* ...

# Utils

* [weapp-util-create-plugin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-util-create-plugin) - 创建插件的工具方法
* [weapp-util-requestfix-promisify](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-util-requestfix-promisify) - 原生小程序所有api进行promise化；优化并发请求数量
* [weapp-util-watch-computed](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-util-watch-computed) - 使原生小程序支持 watch，computed 属性
* ...

# Links

* [Contribution](https://github.com/tolerance-go/blog/issues/1#issue-313932480)
* Updatelog - 查看`packages/xxx/CHANGELOG.md`

# Cases

<div align=left>
<image src='./assets/hqjy.jpg' width="290"/>
<image src='./assets/nhwc.jpg' width="290"/>
</div>

# License

[MIT](https://tldrlegal.com/license/mit-license)
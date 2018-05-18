
<div align=center>
<image src='./assets/1526620785154.jpg' width="550">
</div>

# weapp-start

[![NPM version](https://img.shields.io/npm/v/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Build Status](https://travis-ci.org/tolerance-go/weapp-start.svg?branch=master)](https://travis-ci.org/tolerance-go/weapp-start)
[![NPM downloads](http://img.shields.io/npm/dm/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Dependencies Status](https://david-dm.org/tolerance-go/weapp-start/status.svg)](https://david-dm.org/tolerance-go/weapp-start)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

改善小程序开发体验，高效，稳定的原生语法和组件，避免踩坑，同时提供更多的开发能力

> 我想要原生组件开发，我想要及时的文档更新，我想踩更少的坑，所以有了这个项目；如果去掉全部插件，原来的项目一样可以跑；但是如果你喜欢 less，那就加上 less，pug 呢？一样；欢迎 fork，star

# Features

* 支持 npm 包引入
* 支持 promise
* 支持 async/await
* 支持多种编译器，如 pug/less/stylus
* 支持 ESlint

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

- `weapp-plugin-require` 是基于 `commonJS` 模块规范的静态处理，也就是说 `es6` 的话，需要配合 `weapp-plugin-babel` 插件使用，
`weapp-plugin-babel` 的顺序要在它之前。

- 小程序里面对于 `require('common.js')` 是当做相对路径的，而在 node 中是作为模块查找的，因此应该避免这种隐式的相对路径写法，应该用 `require('./common.js')` 代替；`weapp-plugin-require` 对二者做了兼容，不过会发出提示信息要求修改路径


# Plugins

自定义插件文档 coming...

* [weapp-plugin-babel](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-babel)
* [weapp-plugin-eslint](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-eslint)
* [weapp-plugin-less](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-less)
* [weapp-plugin-pug](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-pug)
* [weapp-plugin-require](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-require)
* [weapp-plugin-stylus](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-stylus)
* [weapp-plugin-filter](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-filter)
* [weapp-plugin-jsmin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-jsmin)
* [weapp-plugin-filemin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-filemin)
* [weapp-plugin-imgmin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-plugin-imgmin)
* ...

# Utils

* [weapp-util-create-plugin](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-util-create-plugin)
* [weapp-util-requestfix-promisify](https://github.com/tolerance-go/weapp-start/tree/master/packages/weapp-util-requestfix-promisify)
* ...

# Links

* [Contribution](https://github.com/tolerance-go/blog/issues/1#issue-313932480)
* Updatelog - 参考 `packages` 下各个包的 `CHANGELOG`

# License

[MIT](https://tldrlegal.com/license/mit-license)

# weapp-start
[![NPM version](https://img.shields.io/npm/v/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Build Status](https://travis-ci.org/tolerance-go/weapp-start.svg?branch=master)](https://travis-ci.org/tolerance-go/weapp-start)
[![Coverage Status](https://coveralls.io/repos/github/tolerance-go/weapp-start/badge.svg?branch=master)](https://coveralls.io/github/tolerance-go/weapp-start?branch=master)
[![NPM downloads](http://img.shields.io/npm/dm/weapp-start.svg?style=flat)](https://npmjs.org/package/weapp-start)
[![Dependencies Status](https://david-dm.org/tolerance-go/weapp-start/status.svg)](https://david-dm.org/tolerance-go/weapp-start)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

给小程序开发赋能，稳定的原生语法，更多的开发能力

# Features

- 支持npm包引入
- 支持promise
- 支持async/await
- 支持多种编译器，如pug/less/stylus
- 支持ESlint

# Install

```bash
npm i weapp-start -g
```

查看帮助

```bash
weapp-start [command] -h
```

生成开发模版

```bash
wepy init
```

进入生成目录，安装依赖

```bash
npm i
```

启动实时编译

```bash
wepy-cli dev
```

使用微信开发者工具新建项目，项目目录选择刚刚生成的文件夹，会自动导入项目配置

# Plugins

- weapp-plugin-babel
- weapp-plugin-eslint
- weapp-plugin-less
- weapp-plugin-pug
- weapp-plugin-require
- weapp-plugin-stylus
- ...

# Utils

- weapp-utils-requestfix-promisify
- ...

# Links

- [Documentation](https://github.com/tolerance-go/weapp-start/tree/master/docs/README.md)
- [Update Log](https://github.com/tolerance-go/weapp-start/tree/master/docs/UPDATELOG.md)
- [Contribution](https://github.com/tolerance-go/blog/issues/1#issue-313932480)

# License

[MIT](https://tldrlegal.com/license/mit-license)

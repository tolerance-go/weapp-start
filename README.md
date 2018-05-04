# weapp-cli
[![NPM version](https://img.shields.io/npm/v/weapp-cli.svg?style=flat)](https://npmjs.org/package/weapp-cli)
[![Build Status](https://travis-ci.org/tolerance-go/weapp-cli.svg?branch=master)](https://travis-ci.org/tolerance-go/weapp-cli)
[![Coverage Status](https://coveralls.io/repos/github/tolerance-go/weapp-cli/badge.svg?branch=master)](https://coveralls.io/github/tolerance-go/weapp-cli?branch=master)
[![NPM downloads](http://img.shields.io/npm/dm/weapp-cli.svg?style=flat)](https://npmjs.org/package/weapp-cli)
[![Dependencies Status](https://david-dm.org/tolerance-go/weapp-cli/status.svg)](https://david-dm.org/tolerance-go/weapp-cli)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

给小程序开发赋能，稳定的原生语法，更多的开发能力

# Features

- 支持npm包引入
- 支持promise
- 支持async/await
- 支持多种编译器，如pug/less/stylus
- 支持ESlint

# Install

```bash
npm i weapp-cli -g
```

查看帮助

```bash
weapp-cli [command] -h
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

使用微信开发者工具新建项目，本地开发选择项目根目录，会自动导入项目配置。

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

- [Documentation](https://github.com/tolerance-go/weapp-cli/tree/master/docs/README.md)
- [Update Log](https://github.com/tolerance-go/weapp-cli/tree/master/docs/UPDATELOG.md)
- [Contribution](https://github.com/tolerance-go/blog/issues/1#issue-313932480)

# License

[MIT](https://tldrlegal.com/license/mit-license)
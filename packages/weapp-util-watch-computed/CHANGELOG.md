# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.4"></a>
## [1.0.4](https://github.com/tolerance-go/weapp-start/compare/weapp-util-watch-computed@1.0.3...weapp-util-watch-computed@1.0.4) (2018-06-27)


### Bug Fixes

* watch break -> continue ([25eb650](https://github.com/tolerance-go/weapp-start/commit/25eb650))




<a name="1.0.3"></a>
## [1.0.3](https://github.com/tolerance-go/weapp-start/compare/weapp-util-watch-computed@1.0.2...weapp-util-watch-computed@1.0.3) (2018-06-03)


### Bug Fixes

* 修复whcCompoennt对于父组件缺省properties情况下初始化computed属性错误 ([a3c4b15](https://github.com/tolerance-go/weapp-start/commit/a3c4b15))




<a name="1.0.2"></a>
## [1.0.2](https://github.com/tolerance-go/weapp-start/compare/weapp-util-watch-computed@1.0.1...weapp-util-watch-computed@1.0.2) (2018-05-27)


### Bug Fixes

*  修复$setData undefined ([9d6e673](https://github.com/tolerance-go/weapp-start/commit/9d6e673))
* **util-watch-computed:**  修复hook调用顺序 ([94eb891](https://github.com/tolerance-go/weapp-start/commit/94eb891))
* **util-watch-computed:** 修复依赖顺序间的错误影响；没有setData的依赖取值错误 ([9ec6e52](https://github.com/tolerance-go/weapp-start/commit/9ec6e52))
* **util-watch-computed:** 计算属性兼容在小程序原生组件的 properties中符合预期行为 ([349b975](https://github.com/tolerance-go/weapp-start/commit/349b975))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-util-watch-computed@1.0.0...weapp-util-watch-computed@1.0.1) (2018-05-23)


### Bug Fixes

* 修复构建依赖版本 node8->es5 ([6e94983](https://github.com/tolerance-go/weapp-cli/commit/6e94983))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-util-watch-computed@0.1.0...weapp-util-watch-computed@1.0.0) (2018-05-23)


### Features

* 增加初始化hook ([c7d85af](https://github.com/tolerance-go/weapp-cli/commit/c7d85af))


### BREAKING CHANGES

* 修改api，区分组件和page；默认调用一次计算方法




<a name="0.1.0"></a>
# 0.1.0 (2018-05-22)


### Features

* 使原生小程序支持 watch，computed 属性 ([5467967](https://github.com/tolerance-go/weapp-cli/commit/5467967))

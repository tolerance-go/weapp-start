# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.3.0"></a>
# [1.3.0](https://github.com/tolerance-go/weapp-start/compare/weapp-start@1.2.7...weapp-start@1.3.0) (2018-05-27)


### Features

* dev 命令增加 --no-cache 清除缓存选项 ([562797c](https://github.com/tolerance-go/weapp-start/commit/562797c))




<a name="1.2.7"></a>
## [1.2.7](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.6...weapp-start@1.2.7) (2018-05-23)


### Bug Fixes

* 修复构建依赖版本 node8->es5 ([6e94983](https://github.com/tolerance-go/weapp-cli/commit/6e94983))




<a name="1.2.6"></a>
## [1.2.6](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.5...weapp-start@1.2.6) (2018-05-23)


### Performance Improvements

* extra生成的文件，直接进行transform而无需先写入文件 ([81a4204](https://github.com/tolerance-go/weapp-cli/commit/81a4204))




<a name="1.2.5"></a>
## [1.2.5](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.4...weapp-start@1.2.5) (2018-05-22)


### Bug Fixes

* 修复模版组件代码，字段类型错误 ([e649457](https://github.com/tolerance-go/weapp-cli/commit/e649457))




<a name="1.2.4"></a>
## [1.2.4](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.3...weapp-start@1.2.4) (2018-05-20)


### Performance Improvements

* 修改提示颜色，区分度更高 ([b9876e3](https://github.com/tolerance-go/weapp-cli/commit/b9876e3))




<a name="1.2.3"></a>
## [1.2.3](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.2...weapp-start@1.2.3) (2018-05-19)


### Bug Fixes

* 修复依赖缺失 ([fac7775](https://github.com/tolerance-go/weapp-cli/commit/fac7775))




<a name="1.2.2"></a>
## [1.2.2](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.1...weapp-start@1.2.2) (2018-05-19)


### Bug Fixes

* extra spelling wrong ([cd373e3](https://github.com/tolerance-go/weapp-cli/commit/cd373e3))
* 重复路径直接 return，导致依赖不全 ([b434330](https://github.com/tolerance-go/weapp-cli/commit/b434330))


### Performance Improvements

* 当有处理额外生成文件的插件时候，才去tranform（有中间件和写入的开销） ([11b8023](https://github.com/tolerance-go/weapp-cli/commit/11b8023))




<a name="1.2.1"></a>
## [1.2.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.2.0...weapp-start@1.2.1) (2018-05-19)


### Performance Improvements

* promise => chains ([98d5958](https://github.com/tolerance-go/weapp-cli/commit/98d5958))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.1.1...weapp-start@1.2.0) (2018-05-19)


### Features

* 增加 new 命令，生成项目，组件模版 ([d997ba2](https://github.com/tolerance-go/weapp-cli/commit/d997ba2))


### Performance Improvements

* 优化打印信息 ([e5569bf](https://github.com/tolerance-go/weapp-cli/commit/e5569bf))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.1.0...weapp-start@1.1.1) (2018-05-18)


### Performance Improvements

* refactor extra logic ([f50b91c](https://github.com/tolerance-go/weapp-cli/commit/f50b91c))
* string stream to buffer stream ([e9aec75](https://github.com/tolerance-go/weapp-cli/commit/e9aec75))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.0.1...weapp-start@1.1.0) (2018-05-17)


### Features

* 增加插件依赖编译的能力 ([1a9b1af](https://github.com/tolerance-go/weapp-cli/commit/1a9b1af))


### Performance Improvements

* log add time ([af4bbd2](https://github.com/tolerance-go/weapp-cli/commit/af4bbd2))
* 编译部分代码逻辑重构 ([c767834](https://github.com/tolerance-go/weapp-cli/commit/c767834))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@1.0.0...weapp-start@1.0.1) (2018-05-11)


### Bug Fixes

* saveCopy spelling mistakes ([57251a2](https://github.com/tolerance-go/weapp-cli/commit/57251a2))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@0.1.6...weapp-start@1.0.0) (2018-05-11)


### Features

* 支持插件修改文件名称 ([98a8081](https://github.com/tolerance-go/weapp-cli/commit/98a8081))
* 配置文件名称新增 weapp.config.js ([d2580df](https://github.com/tolerance-go/weapp-cli/commit/d2580df))


### Performance Improvements

* 优化插件报错定位 ([9856e80](https://github.com/tolerance-go/weapp-cli/commit/9856e80))


### BREAKING CHANGES

* 插件接受的 file 参数字段变化




<a name="0.1.6"></a>
## [0.1.6](https://github.com/tolerance-go/weapp-cli/compare/weapp-start@0.1.5...weapp-start@0.1.6) (2018-05-07)




**Note:** Version bump only for package weapp-start

<a name="0.1.5"></a>
## <small>0.1.5 (2018-05-05)</small>

* fix: init 命令生成的 tpl 缺少隐藏文件 ([9bdc360](https://github.com/tolerance-go/weapp-cli/commit/9bdc360))




<a name="0.1.4"></a>
## <small>0.1.4 (2018-05-04)</small>

* build: weapp-start add depend ([3941397](https://github.com/tolerance-go/weapp-cli/commit/3941397))




<a name="0.1.3"></a>
## <small>0.1.3 (2018-05-04)</small>

* fix: 纠正生产依赖 babel-runtime 的位置 ([c5b2cd4](https://github.com/tolerance-go/weapp-cli/commit/c5b2cd4))

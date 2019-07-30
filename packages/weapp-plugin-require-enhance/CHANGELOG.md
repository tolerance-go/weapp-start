# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.3.6"></a>
## [0.3.6](https://github.com/tolerance-go/weapp-start/compare/weapp-plugin-require@0.3.5...weapp-plugin-require@0.3.6) (2018-05-27)


### Bug Fixes

* **weapp-start:** 同名的文件夹和文件，文件的查找优先级更高 ([57c1af5](https://github.com/tolerance-go/weapp-start/commit/57c1af5))




<a name="0.3.5"></a>
## [0.3.5](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.3.4...weapp-plugin-require@0.3.5) (2018-05-23)


### Bug Fixes

* 修复构建依赖版本 node8->es5 ([6e94983](https://github.com/tolerance-go/weapp-cli/commit/6e94983))




<a name="0.3.4"></a>
## [0.3.4](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.3.3...weapp-plugin-require@0.3.4) (2018-05-20)


### Bug Fixes

* lodash _freeglobal hack ([edce5cf](https://github.com/tolerance-go/weapp-cli/commit/edce5cf))




<a name="0.3.3"></a>
## [0.3.3](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.3.2...weapp-plugin-require@0.3.3) (2018-05-19)


### Bug Fixes

* 修复依赖缺失 ([fac7775](https://github.com/tolerance-go/weapp-cli/commit/fac7775))




<a name="0.3.2"></a>
## [0.3.2](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.3.1...weapp-plugin-require@0.3.2) (2018-05-19)


### Performance Improvements

* promise => chains ([98d5958](https://github.com/tolerance-go/weapp-cli/commit/98d5958))




<a name="0.3.1"></a>
## [0.3.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.3.0...weapp-plugin-require@0.3.1) (2018-05-18)


### Performance Improvements

* string stream to buffer stream ([e9aec75](https://github.com/tolerance-go/weapp-cli/commit/e9aec75))
* use create-plugin refactor ([444c2e3](https://github.com/tolerance-go/weapp-cli/commit/444c2e3))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.2.2...weapp-plugin-require@0.3.0) (2018-05-17)


### Bug Fixes

* babel-runtime _root replace hack ([65ddfc9](https://github.com/tolerance-go/weapp-cli/commit/65ddfc9))


### Features

* add match, ignore option ([8b3ed44](https://github.com/tolerance-go/weapp-cli/commit/8b3ed44))




<a name="0.2.2"></a>
## [0.2.2](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.2.1...weapp-plugin-require@0.2.2) (2018-05-11)


### Bug Fixes

* 兼容 weapp-start 1.0.0 ([c7424e6](https://github.com/tolerance-go/weapp-cli/commit/c7424e6))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.2.0...weapp-plugin-require@0.2.1) (2018-05-08)


### Bug Fixes

* 修复babel-runtime环境监测错误 ([bc0fe6e](https://github.com/tolerance-go/weapp-cli/commit/bc0fe6e))
* 修复某些第三方包在npm下文件名都为index.js ([3cbfc95](https://github.com/tolerance-go/weapp-cli/commit/3cbfc95))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/tolerance-go/weapp-cli/compare/weapp-plugin-require@0.1.4...weapp-plugin-require@0.2.0) (2018-05-07)


### Bug Fixes

* 修复 require 替换模块字符串错误 ([f6516d4](https://github.com/tolerance-go/weapp-cli/commit/f6516d4))
* 修复 require 相对路径模块，对文件夹的解析错误 ([e85268c](https://github.com/tolerance-go/weapp-cli/commit/e85268c))
* 修复包 babel-runtime 的环境依赖报错问题 ([336a483](https://github.com/tolerance-go/weapp-cli/commit/336a483))
* 修复对没有 main 字段和 index 文件的 npm 包的解析错误(babel-runtime) ([9aea19d](https://github.com/tolerance-go/weapp-cli/commit/9aea19d))
* 修复重复拷贝npm依赖 ([c0af59d](https://github.com/tolerance-go/weapp-cli/commit/c0af59d))


### Features

* 支持小程序内使用隐式相对路径，不建议使用 ([42f6ee0](https://github.com/tolerance-go/weapp-cli/commit/42f6ee0))




<a name="0.1.4"></a>
## <small>0.1.4 (2018-05-04)</small>

* fix: 纠正生产依赖 babel-runtime 的位置 ([c5b2cd4](https://github.com/tolerance-go/weapp-cli/commit/c5b2cd4))

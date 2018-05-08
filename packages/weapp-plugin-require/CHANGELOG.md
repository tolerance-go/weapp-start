# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

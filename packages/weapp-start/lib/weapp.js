#!/usr/bin/env node
'use strict';

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _fs = require('fs');

var _path = require('path');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

var _save = require('./utils/save');

var _start = require('./start');

var _start2 = _interopRequireDefault(_start);

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shell = require('shelljs');

var argv = _yargs2.default // eslint-disable-line
.usage('$0 <command> [options]').command('dev', 'watch build', function (yargs) {
  yargs.option('no-cache', {
    default: false,
    alias: 'n',
    describe: '禁用缓存',
    type: 'boolean'
  });
}, function (argv) {
  (0, _start2.default)('dev', argv.noCache);
}).command('build', '打包构建', function (yargs) {
  yargs.option('tag', {
    default: false,
    alias: 't',
    describe: '自动打tag',
    type: 'string'
  });
}, function (argv) {
  (0, _start2.default)('build');
  if (argv.tag) {
    shell.exec('git add .');
    shell.exec('git commit -m Publish');
    shell.exec('git tag ' + argv.tag);
  }
}).command('init', '生成模版项目', function () {
  console.log(_chalk2.default.green('下载模板组中，请稍后...'));
  var temp = '__temp';
  (0, _downloadGitRepo2.default)('tolerance-go/weapp-start-templates', temp, function (err) {
    if (err) {
      _rimraf2.default.sync(temp);
      return console.log(_chalk2.default.red('下载模板组失败，请重试几次看看', err));
    }
    console.log(_chalk2.default.green('下载模板组成功，生成临时目录', temp));
    var tpls = (0, _fs.readdirSync)(temp).filter(function (file) {
      if ((0, _fs.lstatSync)((0, _path.join)(temp, file)).isDirectory()) {
        return true;
      }
    });
    var prompt = _inquirer2.default.createPromptModule();
    prompt([{
      name: 'name',
      type: 'input',
      message: '请输入项目名称',
      default: 'weappDemo',
      validate: function validate(name) {
        var cwd = process.cwd();
        if ((0, _fs.existsSync)((0, _path.join)(cwd, name))) {
          console.log(_chalk2.default.red('已存在同名文件'));
          return false;
        }
        return true;
      }
    }, {
      name: 'tpl',
      type: 'list',
      choices: tpls,
      message: '请选择模版类型'
    }]).then(function (input) {
      (0, _save.saveCopy)((0, _path.join)(temp, input.tpl), input.name);
      _rimraf2.default.sync(temp);
      console.log(_chalk2.default.green('Thanks for your use! @bzone'));
    }).catch(function (err) {
      _rimraf2.default.sync(temp);
      console.log(_chalk2.default.red(err));
    });
  });
}).command('new', '生成模板页面', function () {
  var prompt = _inquirer2.default.createPromptModule();
  prompt([{
    name: 'type',
    type: 'list',
    choices: ['page', 'component', 'app'],
    message: '请选择生成类型'
  }, {
    name: 'name',
    type: 'input',
    message: '请输入组件名称',
    validate: function validate(name) {
      if (!name) {
        console.log(_chalk2.default.red('必填项目'));
      }
      return !!name;
    }
  }]).then(function (input) {
    (0, _save.saveCopy)((0, _path.join)(__dirname, '../tpls', input.type), input.name);
    console.log(_chalk2.default.green('generate done!'));
  }).catch(function (err) {
    console.log(_chalk2.default.red(err));
  });
}).command('mock', '启动本地mock服务', function (yargs) {
  yargs.option('port', {
    default: 3000,
    alias: 'p',
    describe: '指定端口号',
    type: 'number'
  });
}, function (argv) {
  (0, _mock2.default)({ port: argv.prot });
}).help().alias('h', 'help').alias('v', 'version').argv;
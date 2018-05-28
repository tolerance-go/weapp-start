#!/usr/bin/env node
import inquirer from 'inquirer';
import yargs from 'yargs';
import { existsSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import download from 'download-git-repo';
import { saveCopy } from './utils/save';
import start from './start';
import launchMock from './mock';
const shell = require('shelljs');

const argv = yargs // eslint-disable-line
  .usage('$0 <command> [options]')
  .command(
    'dev',
    'watch build',
    yargs => {
      yargs.option('no-cache', {
        default: false,
        alias: 'n',
        describe: '禁用缓存',
        type: 'boolean',
      });
    },
    argv => {
      start('dev', argv.noCache);
    }
  )
  .command(
    'build',
    '打包构建',
    yargs => {
      yargs.option('tag', {
        default: false,
        alias: 't',
        describe: '自动打tag',
        type: 'string',
      });
    },
    argv => {
      start('build');
      if (argv.tag) {
        shell.exec('git add .');
        shell.exec('git commit -m Publish');
        shell.exec('git tag ' + argv.tag);
      }
    }
  )
  .command('init', '生成模版项目', () => {
    console.log(chalk.green('下载模板组中，请稍后...'));
    const temp = '__temp';
    download('tolerance-go/weapp-start-templates', temp, function(err) {
      if (err) {
        rimraf.sync(temp);
        return console.log(chalk.red('下载模板组失败，请重试几次看看', err));
      }
      console.log(chalk.green('下载模板组成功，生成临时目录', temp));
      const tpls = readdirSync(temp).filter(file => {
        if (lstatSync(join(temp, file)).isDirectory()) {
          return true;
        }
      });
      const prompt = inquirer.createPromptModule();
      prompt([
        {
          name: 'name',
          type: 'input',
          message: '请输入项目名称',
          default: 'weappDemo',
          validate(name) {
            const cwd = process.cwd();
            if (existsSync(join(cwd, name))) {
              console.log(chalk.red('已存在同名文件'));
              return false;
            }
            return true;
          },
        },
        {
          name: 'tpl',
          type: 'list',
          choices: tpls,
          message: '请选择模版类型',
        },
      ])
        .then(input => {
          saveCopy(join(temp, input.tpl), input.name);
          rimraf.sync(temp);
          console.log(chalk.green('Thanks for your use! @bzone'));
        })
        .catch(err => {
          rimraf.sync(temp);
          console.log(chalk.red(err));
        });
    });
  })
  .command('new', '生成模板页面', () => {
    const prompt = inquirer.createPromptModule();
    prompt([
      {
        name: 'type',
        type: 'list',
        choices: ['page', 'component', 'app'],
        message: '请选择生成类型',
      },
      {
        name: 'name',
        type: 'input',
        message: '请输入组件名称',
        validate(name) {
          if (!name) {
            console.log(chalk.red('必填项目'));
          }
          return !!name;
        },
      },
    ])
      .then(input => {
        saveCopy(join(__dirname, '../tpls', input.type), input.name);
        console.log(chalk.green('generate done!'));
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  })
  .command(
    'mock',
    '启动本地mock服务',
    yargs => {
      yargs.option('port', {
        default: 3000,
        alias: 'p',
        describe: '指定端口号',
        type: 'number',
      });
    },
    argv => {
      launchMock({ port: argv.prot });
    }
  )
  .help()
  .alias('h', 'help')
  .alias('v', 'version').argv;

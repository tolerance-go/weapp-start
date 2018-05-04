#!/usr/bin/env node
import inquirer from 'inquirer';
import yargs from 'yargs';
import { existsSync } from 'fs';
import { join } from 'path';
import start from './start';
import chalk from 'chalk';
const vfs = require('vinyl-fs');

const prompt = inquirer.createPromptModule();

const argv = yargs // eslint-disable-line
  .usage('$0 <command> [options]')
  .command('dev', 'watch build', argv => {
    start('dev');
  })
  .command('build', '打包构建', argv => {
    start('build');
  })
  .command('init', '生成模版项目', () => {
    prompt([
      {
        name: 'name',
        type: 'input',
        message: '请输入项目名称',
        default: 'weappDemo',
        validate(name) {
          const cwd = process.cwd();
          if (existsSync(join(cwd, name))) {
            console.log(chalk.red(' 已存在同名文件'));
            return false;
          }
          return true;
        },
      },
      {
        name: 'tpl',
        type: 'list',
        choices: ['standard-project'],
        message: '请选择模版类型',
      },
      // {
      //   name: 'eslint',
      //   message: '是否使用eslint',
      //   type: 'confirm',
      // },
      // {
      //   name: 'style',
      //   message: '请选择wxss的编译语言',
      //   type: 'list',
      //   choices: ['less', 'stylus'],
      // },
      // {
      //   name: 'xml',
      //   message: '请选择wxml的编译语言',
      //   type: 'list',
      //   choices: ['pug'],
      // },
    ]).then(input => {
      vfs.src(join(__dirname, '../templates', input.tpl, '/**/*.*')).pipe(vfs.dest(input.name));
      console.log(chalk.green('Thanks for your use! @bzone'));
    });
  })
  .help()
  .alias('h', 'help')
  .alias('v', 'version').argv;

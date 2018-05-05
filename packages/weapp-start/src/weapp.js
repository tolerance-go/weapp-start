#!/usr/bin/env node
import inquirer from 'inquirer';
import yargs from 'yargs';
import { existsSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import download from 'download-git-repo';
import copySync from './utils/copySync';
import start from './start';

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
          copySync(join(temp, input.tpl), input.name);
          rimraf.sync(temp);
          console.log(chalk.green('Thanks for your use! @bzone'));
        })
        .catch(err => {
          rimraf.sync(temp);
          console.log(chalk.red(err));
        });
    });
  })
  .help()
  .alias('h', 'help')
  .alias('v', 'version').argv;

import dayjs from 'dayjs';
import chalk from 'chalk';
import { Signale } from 'signale';

const custom = new Signale({
  types: {
    remove: {
      badge: '💥 ',
      color: 'magenta',
      label: 'REMOVE',
    },
    add: {
      badge: '🌶️ ',
      color: 'yellow',
      label: 'ADD',
    },
    change: {
      badge: '🌱 ',
      color: 'greenBright',
      label: 'CHANGE',
    },
    error: {
      badge: '💊 ',
      color: 'red',
      label: 'EXCEPTION',
    },
    transform: {
      badge: '⭐ ',
      color: 'blue',
      label: 'TRANSFORM',
    },
    extra: {
      badge: '💥 ',
      color: 'yellow',
      label: 'EXTRA',
    },
    warn: {
      badge: '😑 ',
      color: 'magenta',
      label: 'warn',
    },
  },
});

const log = {
  extra(message) {
    this.print('extra', message);
  },
  transform(message) {
    this.print('transform', message);
  },
  error(message) {
    this.print('error', message);
  },
  warn(message) {
    this.print('warn', message);
  },
  change(message) {
    this.print('change', message);
  },
  add(message) {
    this.print('add', message);
  },
  remove(message) {
    this.print('remove', message);
  },
  print(type, message) {
    custom[type]({ prefix: chalk.dim(`[${dayjs().format('HH:mm:ss')}]`), message });
  },
};

export default log;

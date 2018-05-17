import chalk from 'chalk';
import dayjs from 'dayjs';

const log = {
  error(msg, tip = 'ERROR') {
    this.print(msg, tip, 'red');
  },
  info(msg, tip = 'INFO') {
    this.print(msg, tip, 'blue');
  },
  success(msg, tip = 'SUCCESS') {
    this.print(msg, tip, 'green');
  },
  print(msg, tip, color) {
    const tLen = tip.length;
    const max = 15;
    let start;
    let end;
    let dTip = '';

    if (tLen < max) {
      start = Math.floor((max - tLen) / 2);
      end = start + tLen;
    }

    for (let i = 0; i < max; i++) {
      if (i === start) dTip += tip;
      if (i > start && i <= end) {
        continue;
      }
      dTip += ' ';
    }

    console.log(chalk.dim(`[${dayjs().format('HH:mm:ss')}]`), chalk[color](`[${dTip}] ${msg}`));
  },
};

export default log;

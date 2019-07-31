const fs = require('fs');
const path = require('path');

export default {
  cpFile(params) {
    const { srcPath, tarPath, cb, utils } = params;
    const rs = fs.createReadStream(srcPath);
    rs.on('error', err => {
      if (err) {
        utils.log.error('read error', srcPath);
      }
      cb && cb(err);
    });

    const ws = fs.createWriteStream(tarPath);
    ws.on('error', err => {
      if (err) {
        utils.log.error('write error', tarPath);
      }
      cb && cb(err);
    });
    ws.on('close', ex => {
      utils.log.add('复制成功--', ex);
      cb && cb(ex);
    });
  },
  cpFolder(params) {
    const { srcDir, tarDir, utils } = params;
    fs.readdir(srcDir, (err, files) => {
      if (files.length === 0) {
        utils.log.error('为毛要复制一个空文件夹');
        return;
      }
      if (err) {
        utils.log.error('哎呀，出错了');
        console.log(err);
        return;
      }

      files.forEach(file => {
        var srcPath = path.join(srcDir, file);
        var tarPath = path.join(tarDir, file);

        fs.stat(srcPath, (err, stats) => {
          if (err) {
            utils.log.error(err);
            return;
          }
          if (stats.isDirectory()) {
            fs.mkdir(tarPath, err => {
              if (err) {
                utils.log.warn(`文件夹${file}已经存在`);
                return;
              }
              utils.log.change(`文件夹${file}复制成功`);
              this.cpFolder({
                srcDir: srcPath,
                tarDir: tarPath,
                utils,
              });
            });
          } else {
            this.cpFile({ srcPath, tarPath, utils });
          }
        });
      });
    });
  },
};

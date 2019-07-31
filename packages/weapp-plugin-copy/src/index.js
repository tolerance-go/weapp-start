import createPlugin from 'weapp-util-create-plugin';
const util = require('./utils');
const fs = require('fs');

export default createPlugin({
  match: /copy\.json$/,
  encoding: 'utf8',
})((file, next, plgConfig, utils) => {
  const jsonConfig = JSON.parse(file.contents);
  const i = file.dist.lastIndexOf('copy.json');
  const distPath = file.dist.slice(0, i);
  const sourcePath = distPath.slice(0, distPath.lastIndexOf('dist'));
  const targetPath = `${sourcePath}dist/npm`;

  if (Array.isArray(jsonConfig.pkgPath)) {
    fs.mkdir(targetPath, err => {
      if (err) {
        utils.log.extra('创建npm文件夹成功');
      }
    });
    jsonConfig.pkgPath.forEach(v => {
      v = `${sourcePath}${v}`;
      fs.stat(v, (err, stats) => {
        if (err) {
          utils.log.error(err);
          return;
        }
        if (stats.isDirectory()) {
          util.cpFolder({
            srcDir: v,
            tarDir: `${sourcePath}dist/npm`,
            utils,
          });
        }
      });
    });
  }
});

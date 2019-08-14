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

  if (Array.isArray(jsonConfig.pkgData)) {
    jsonConfig.pkgData.forEach(v => {
      v.source = `${sourcePath}${v.source}`;
      fs.stat(v.source, (err, stats) => {
        if (err) {
          utils.log.error(err);
          return;
        }
        if (stats.isDirectory()) {
          const targetPath = `${sourcePath}${v.targetFileName}`;
          fs.mkdir(targetPath, { recursive: true }, err => {
            if (err) {
              utils.log.extra('创建npm文件夹成功');
            }
          });
          util.cpFolder({
            srcDir: v.source,
            tarDir: targetPath,
            utils,
          });
        }
      });
    });
  }
});

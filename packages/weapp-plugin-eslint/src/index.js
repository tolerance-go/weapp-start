import eslint from 'eslint';
import formatter from 'eslint-friendly-formatter';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.js$/,
})((file, next, plgConfig, utils) => {
  if (!plgConfig.formatter) {
    plgConfig.formatter = formatter;
  }
  const engine = new eslint.CLIEngine(plgConfig);
  const report = engine.executeOnFiles([file.path]);
  const _formatter = engine.getFormatter();
  let rst = _formatter(report.results);
  if (rst) {
    console.log(rst);
  }
  next(file);
});

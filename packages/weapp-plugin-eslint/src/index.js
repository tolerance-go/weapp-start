import eslint from 'eslint';
import formatter from 'eslint-friendly-formatter';

export default function({ config, file, status, extra }, plgConfig) {
  const defaultConfig = {
    match: /\.js$/,
    ...plgConfig,
  };

  if (defaultConfig.match) {
    if (!file.path.match(defaultConfig.match)) return;
  }

  if (!defaultConfig.formatter) {
    defaultConfig.formatter = formatter;
  }
  const engine = new eslint.CLIEngine(defaultConfig);
  const report = engine.executeOnFiles([file.path]);
  const _formatter = engine.getFormatter();
  let rst = _formatter(report.results);
  if (rst) {
    console.log(rst);
  }
}

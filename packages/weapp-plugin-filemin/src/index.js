import { pd } from 'pretty-data';
import createPlugin from 'weapp-util-create-plugin';

export default createPlugin({
  match: /\.(wxml|json|wxss)$/,
  extra: true,
  encoding: 'utf8',
})(({ config, file, status, extra }, plgConfig) => {
  switch (file.ext) {
    case '.wxml':
      file.contents = pd.xmlmin(file.contents);
      break;
    case '.json':
      file.contents = pd.jsonmin(file.contents);
      break;
    case '.wxss':
      file.contents = pd.cssmin(file.contents);
      break;
  }
});

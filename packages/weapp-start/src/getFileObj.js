import { parse } from 'path';
import { readFileSync } from 'fs';

export default function(resolvedSrcPath, resolvedDistPath) {
  const contents = readFileSync(resolvedSrcPath);
  const pathObj = parse(resolvedSrcPath);
  const file = {
    ...pathObj,
    contents,
    path: resolvedSrcPath,
    dist: resolvedDistPath,
    extra: {},
  };

  return file;
}

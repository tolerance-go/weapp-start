import { parse } from 'path';
import { readFileSync } from 'fs';

export default function(resolvedSrcPath, resolvedDistPath, contents) {
  contents = contents || readFileSync(resolvedSrcPath);
  const file = {
    ...parse(resolvedSrcPath),
    contents,
    path: resolvedSrcPath,
    dist: resolvedDistPath,
    extra: {},
  };

  return file;
}

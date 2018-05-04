import { parse, sep } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

export default function write(resolvedPath, contents) {
  const { dir } = parse(resolvedPath);
  // 路径的文件夹非空处理
  dir.split(sep).reduce((pre, next) => {
    let pt = pre + sep + next;
    if (!existsSync(pt)) {
      mkdirSync(pt);
    }
    return pt;
  });
  writeFileSync(resolvedPath, contents, 'utf-8');
}

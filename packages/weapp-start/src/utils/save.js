import { readdirSync, lstatSync, copyFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, sep, parse } from 'path';

export function saveCopy(path, dist) {
  copyFileSync(path, dist);
  if (lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(file => {
      saveCopy(join(path, file), join(dist, file));
    });
  }
}

export function saveWrite(resolvedPath, contents) {
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

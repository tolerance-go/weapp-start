import { readdirSync, lstatSync, copyFileSync } from 'fs';
import { join } from 'path';

export default function copySync(path, dist) {
  copyFileSync(path, dist);
  if (lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(file => {
      copySync(join(path, file), join(dist, file));
    });
  }
}

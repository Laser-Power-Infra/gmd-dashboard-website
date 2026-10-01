import fs from 'fs';
import path from 'path';
import { normalizeName } from './valveName';

const VALVE_IMG_DIR = path.join(process.cwd(), 'public', 'valve img');

export function getValveImageMap(): Record<string, string> {
  try {
    const files = fs.readdirSync(VALVE_IMG_DIR).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext);
    });

    const map: Record<string, string> = {};
    for (const file of files) {
      const key = normalizeName(path.basename(file, path.extname(file)));
      if (key) {
        map[key] = `/valve img/${encodeURIComponent(file)}`;
      }
    }
    return map;
  } catch {
    return {};
  }
}
import * as fs from 'fs';
import * as path from 'path';

function hasE2eSpecFile(prefix: string, pathDir: string): boolean {
  const testDir = path.resolve(__dirname, '../'+pathDir);
  const files = fs.readdirSync(testDir);
  return files.some(file => file.startsWith(prefix) && file.endsWith('.e2e-spec.ts'));
}

export { hasE2eSpecFile };

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Creates an isolated temp dir and writes the given relative files into it. */
export async function makeTempRepo(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'repoguard-test-'));
  for (const [relativePath, contents] of Object.entries(files)) {
    const full = path.join(dir, relativePath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, contents, 'utf8');
  }
  return dir;
}

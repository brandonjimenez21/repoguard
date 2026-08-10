import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/** Returns the first candidate path (relative to repoPath) that exists, or null. */
export async function findFirstExisting(
  repoPath: string,
  candidates: string[],
): Promise<string | null> {
  for (const candidate of candidates) {
    const full = path.join(repoPath, candidate);
    if (await pathExists(full)) return candidate;
  }
  return null;
}

export async function readFileIfExists(target: string): Promise<string | null> {
  try {
    return await fs.readFile(target, 'utf8');
  } catch {
    return null;
  }
}

export async function listDirIfExists(target: string): Promise<string[]> {
  try {
    return await fs.readdir(target);
  } catch {
    return [];
  }
}

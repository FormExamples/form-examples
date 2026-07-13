import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '..', '..');

/**
 * The list of form slugs the current run should exercise.
 *
 * `FORMS` env var (space- or comma-separated) narrows the run; otherwise every
 * form slug from bin/forms-as-kebab-case is used. Slugs are filtered to those
 * whose HTML front-end actually exists on disk.
 */
export function formSlugs(): string[] {
  const fromEnv = (process.env.FORMS ?? '').trim();
  let slugs: string[];
  if (fromEnv) {
    slugs = fromEnv.split(/[\s,]+/).filter(Boolean);
  } else {
    const out = execSync('bin/forms-as-kebab-case', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    slugs = out.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  return slugs.filter((slug) =>
    existsSync(resolve(REPO_ROOT, 'forms', slug, 'front-end-with-html', 'index.html')),
  );
}

export function htmlDir(slug: string): string {
  return resolve(REPO_ROOT, 'forms', slug, 'front-end-with-html');
}

export function svelteDir(slug: string): string {
  return resolve(REPO_ROOT, 'forms', slug, 'front-end-with-svelte');
}

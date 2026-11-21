#!/usr/bin/env node
// Build every form's own Svelte front-end for this site and assemble it into
// build/, so https://formexamples.github.io/<slug>/ serves that form.
//
// Run after `pnpm run build` (the site itself). For each form app that opts in
// (its vite.config.ts reads VITE_FORM_EXAMPLES_SITE), it runs
// `pnpm install --frozen-lockfile` and `pnpm run build` with
// VITE_FORM_EXAMPLES_SITE=1, which makes the form build statically: its pages
// prerendered under /<slug>/, its assets under /_app/<slug>/, and a /<slug>/200.html
// shell for pages that are not prerendered (a record, /<slug>/.../[id]/). It
// then copies build/<slug>/ and build/_app/<slug>/ into this site's build/.
// The forms' theme CSS is not copied: every form loads the site's /themes/.
// Nor is pdfmake: a form's report loads the site's one copy at /vendor/pdfmake/,
// which this script copies from the site's own pdfmake dependency.
//
// Finally it writes build/404.html. GitHub Pages serves it for any path with
// no file; for a path under a form it forwards to that form's 200.html with
// ?__spa=<path>, and the form's app.html puts the path back before its router
// starts. Any other path shows a plain "page not found".
//
// Form sources are read from $FORMS_DIR, else ../forms (inside the
// form-examples monorepo). The exported formexamples.github.io repo has no
// forms/, so its deploy workflow sparse-checks-out the monorepo's
// forms/*/front-end-with-svelte/ and sets FORMS_DIR.
//
// Usage:
//   node scripts/build-forms.mjs [--jobs N] [<slug>...]   # default: every form, N = cores / 2

import { spawn } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(SITE, 'build');
const MARKER = 'VITE_FORM_EXAMPLES_SITE';

function formsDir() {
  if (process.env.FORMS_DIR) return resolve(process.env.FORMS_DIR);
  for (const dir of [join(SITE, '..', 'forms'), join(SITE, 'forms')]) {
    if (existsSync(dir)) return dir;
  }
  throw new Error('no forms/ directory beside or inside the site');
}

function apps(dir, only) {
  return readdirSync(dir)
    .filter((slug) => only.length === 0 || only.includes(slug))
    .map((slug) => ({ slug, app: join(dir, slug, 'front-end-with-svelte') }))
    .filter(({ app }) => {
      try {
        return readFileSync(join(app, 'vite.config.ts'), 'utf-8').includes(MARKER);
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function run(command, args, cwd, env = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => resolveRun({ code, output }));
  });
}

async function buildOne({ slug, app }) {
  const install = await run('pnpm', ['install', '--frozen-lockfile', '--prefer-offline', '--silent'], app);
  if (install.code !== 0) return { slug, error: `pnpm install failed\n${install.output.slice(-2000)}` };
  const build = await run('pnpm', ['run', 'build'], app, { [MARKER]: '1' });
  if (build.code !== 0) return { slug, error: `build failed\n${build.output.slice(-2000)}` };
  const pages = join(app, 'build', slug);
  const assets = join(app, 'build', '_app', slug);
  if (!existsSync(join(pages, 'index.html')) || !existsSync(assets)) {
    return { slug, error: 'build/ lacks <slug>/index.html or _app/<slug>/' };
  }
  if (existsSync(join(BUILD, slug)) && !existsSync(join(BUILD, slug, '200.html'))) {
    return { slug, error: `the site already has a /${slug}/ page` };
  }
  // Replace, not merge: a rebuild's hashed chunks must not pile up beside the last ones.
  rmSync(join(BUILD, slug), { recursive: true, force: true });
  rmSync(join(BUILD, '_app', slug), { recursive: true, force: true });
  cpSync(pages, join(BUILD, slug), { recursive: true });
  cpSync(assets, join(BUILD, '_app', slug), { recursive: true });
  return { slug };
}

function notFoundPage(slugs) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — Form Examples</title>
<script>
  // A page under a form that is not prerendered (a record) opens in that
  // form's app shell, which restores this path before its router starts.
  (function () {
    var forms = ${JSON.stringify(slugs)};
    var slug = location.pathname.split('/')[1];
    if (forms.indexOf(slug) >= 0 && location.pathname.indexOf('/' + slug + '/200.html') !== 0) {
      location.replace('/' + slug + '/200.html?__spa=' + encodeURIComponent(location.pathname + location.search + location.hash));
    }
  })();
</script>
<style>
  body { font: 1rem/1.5 system-ui, sans-serif; margin: 0; padding: 3rem 1.5rem; max-width: 40rem; margin-inline: auto; }
  @media (prefers-color-scheme: dark) { body { background: #111; color: #eee; } a { color: #9cf; } }
</style>
</head>
<body>
<h1>Page not found</h1>
<p>There is no page at this address. <a href="/">Go to Form Examples</a> or <a href="/forms/">browse the forms</a>.</p>
</body>
</html>
`;
}

async function main() {
  const argv = process.argv.slice(2);
  let jobs = Math.max(1, Math.floor(availableParallelism() / 2));
  const only = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--jobs') jobs = Number(argv[++i]);
    else only.push(argv[i]);
  }
  if (!existsSync(join(BUILD, 'index.html'))) throw new Error('build/ has no site; run `pnpm run build` first');

  const queue = apps(formsDir(), only);
  const results = [];
  const started = Date.now();
  await Promise.all(
    Array.from({ length: Math.min(jobs, queue.length) }, async () => {
      while (queue.length) {
        const result = await buildOne(queue.shift());
        results.push(result);
        console.log(result.error ? `FAIL ${result.slug}: ${result.error.split('\n')[0]}` : `ok   ${result.slug}`);
      }
    }),
  );

  const vendor = join(BUILD, 'vendor', 'pdfmake');
  for (const file of ['pdfmake.min.js', 'vfs_fonts.js']) {
    cpSync(join(SITE, 'node_modules', 'pdfmake', 'build', file), join(vendor, file));
  }

  const built = results.filter((r) => !r.error).map((r) => r.slug).sort();
  // Every form now in build/, not only this run's: a run may build just a few.
  const served = readdirSync(BUILD)
    .filter((slug) => existsSync(join(BUILD, slug, '200.html')))
    .sort();
  writeFileSync(join(BUILD, '404.html'), notFoundPage(served));
  const failed = results.filter((r) => r.error);
  for (const { slug, error } of failed) console.error(`\n--- ${slug}\n${error}`);
  console.log(`build-forms: ${built.length} built, ${failed.length} failed, ${Math.round((Date.now() - started) / 1000)}s`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((error) => {
  console.error(`build-forms: ${error.message}`);
  process.exit(1);
});

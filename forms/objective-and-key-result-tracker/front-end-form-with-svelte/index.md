# OKR Tracker — Svelte form (SvelteKit)

SvelteKit single-page wizard for the OKR tracker. Built with Svelte 5 runes,
Tailwind 4, and `@sveltejs/adapter-static` so the production output is a
static site.

- 10 steps on one continuous page
- Scoring engine reused from Plan 1 (TypeScript, Vitest-tested)
- PDF export via `pdfmake`
- Plain-text triage summary
- Playwright e2e: 14 shared fixtures driven through the engine + 1 fixture
  driven through the UI

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md).

## Verify

```sh
pnpm install
pnpm test         # 44 Vitest engine tests
pnpm test:e2e     # 15 Playwright tests
pnpm build        # static site → build/
```

# OKR Tracker — HTML form (vanilla)

Static single-page wizard for the OKR tracker form. No build step. Opens directly from the file system.

- 10 steps on one continuous page
- Scoring engine ported to vanilla JS (same logic as `front-end-form-with-svelte/src/lib/engine/`)
- PDF export via pdfmake (CDN)
- Plain-text triage summary
- Smoke-tested with the 14 shared fixtures via Playwright

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md).

## Verify

```sh
pnpm install && pnpm test
```

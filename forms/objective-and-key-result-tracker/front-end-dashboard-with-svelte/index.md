# OKR Tracker — Svelte dashboard (SvelteKit)

SvelteKit + Tailwind dashboard for the OKR tracker. Filter sidebar, sortable
table, right-side detail panel showing KRs / flags / latest check-in.

- Sample objectives loaded from `static/objectives.json`
- Filters: level, RAG, owner (substring match)
- Click a row to open the detail panel; click the close button to dismiss
- Sortable by clicking any column header

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md).

## Verify

```sh
pnpm install
pnpm test:e2e
pnpm build
```

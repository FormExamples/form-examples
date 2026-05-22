# OKR Tracker — HTML dashboard (vanilla)

Static review dashboard for the OKR tracker. No build step. Loads sample
objectives from a co-located JSON file.

- Sortable, filterable table of objectives
- Row click expands a panel showing KRs, flags, and the latest check-in
- CSV export of the visible rows
- Filters: level, status, RAG, owner

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md).

## Verify

```sh
pnpm install && pnpm test
```

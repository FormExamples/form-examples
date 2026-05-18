# Agile Checklist — SvelteKit Dashboard Tasks

## Done

- [x] Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project
- [x] Sample data in `src/lib/data/sample.ts` (15 rows, 6 teams, full maturity spread)
- [x] Backend API client with sample-data fallback
- [x] Aggregation engine (`aggregate.ts` with `aggregateByTeam`, `sparklineGeometry`, `rowsToCsv`)
- [x] Vitest unit tests for aggregation (25/25 passing, includes CSV parser
      + import round-trip cases)
- [x] Sortable table (individuals view)
- [x] Aggregated team view with sparkline trend
- [x] Dropdown filters (maturity, role)
- [x] CSV export
- [x] Anonymous-submission redaction in CSV
- [x] `pnpm run check` clean, `pnpm build` succeeds, browser smoke-tested
- [x] CSV import for offline review — `parseCsv` + `rowsFromCsv` in
      `aggregate.ts` (5 new test cases), "Import CSV" file picker, "Reset
      to sample" button, accessible status banner for ok/error feedback.
      Browser smoke-tested round-trip: 15 sample → 2 imported → reset →
      15 sample → malformed CSV preserves state with explicit error.
- [x] Per-submission detail view at `/submission/[id]` — composite maturity
      banner, per-section breakdown table, respondent metadata, weak
      sections, operational flags, larger team trend sparkline, and links
      to other submissions in the same team. Driven by a shared
      `rowsStore` so imported CSVs are visible on the detail page too.
      Browser smoke-tested end-to-end.

- [x] LocalStorage cache of last successful API response — successful
      `/api/checklists` writes to `agile-checklist-dashboard:cache:v1`;
      on subsequent visits the cache hydrates (within a 24h TTL) before
      a fresh fetch is attempted, and the status banner shows the
      cached-from timestamp when the API is unreachable. Browser
      smoke-tested: mocked API → cache populated → offline reload serves
      cached rows.

- [x] Multi-team trend chart over time — single SVG that overlays every
      team's overall-percent series, with date ticks (≤ 5), y grid at
      0/25/50/75/100, maturity-colored lines + end-of-line team labels,
      and a sidebar legend. Lives in a collapsible `<details>` above the
      individuals table; updates live with the filter set.
      `multiTeamChart` helper has 5 dedicated test cases (total 30/30).
      Browser smoke-tested: 5 series from the full sample, 1 series after
      ad-hoc filter, 5 back after reset.

## Pending

(none — see top-level tasks.md for remaining roadmap items)

# Tasks

- [x] Initialise the SvelteKit project (Vite, Svelte 5 runes, Tailwind 4,
      SVAR DataGrid Willow theme) — `package.json`, `svelte.config.js`,
      `vite.config.ts`, `tsconfig.json`, `pnpm-workspace.yaml`,
      `src/app.{html,css,d.ts}`
- [x] Author `src/lib/api.ts` — same-origin `fetchScorecards(base)` and
      `fetchScorecard(id, base)`. `base = ''` keeps the dashboard
      working standalone via its own `+server.ts` endpoints; passing a
      Loco URL points it at the real backend. Sample-data fallback
      runs on network failure
- [x] Same-origin SvelteKit endpoints:
      `src/routes/api/dashboard/scorecards/+server.ts` (GET list) and
      `src/routes/api/scorecards/[id]/+server.ts` (GET one or 404).
      Same JSON shape as the Loco backend mounts
- [x] Author `src/lib/types.ts` — `ScorecardRow`, `ScorecardFlag`,
      `Band`, `DashboardScorecardsResponse`
- [x] Author `src/lib/data.ts` — 12 representative scorecards spanning
      all four bands
- [x] Author `src/routes/+page.svelte` mounting the SVAR DataGrid with
      11 columns (organization, sector, size, respondent, date, score,
      manifesto, principles, band, flags count, recommendation) plus
      live dropdown filters (band / sector / size) and free-text search
- [x] Author `src/routes/report/[id]/+page.svelte` for the read-only
      per-scorecard report view. Shows organization, respondent,
      score breakdown, band badge, recommendation copy, and flag list;
      noticeably notes that item-by-item answers come from the Loco
      backend at `/api/scorecards/[id]` (not bundled in the sample data)
- [x] Wire the `organizationName` grid column to render as a link to
      the per-scorecard report
- [x] Author `src/routes/import/+page.svelte` — bulk-import UI that
      POSTs a JSON-Lines body to the Rust axum server's
      `/api/bulk-import`, then renders the accepted / rejected /
      skipped-blank / skipped-comment / total counts, plus a per-line
      rejection list. Linked from the dashboard header. Verified live:
      3 golden rows + 1 comment + 1 blank → accepted 3, dashboard
      grows 12 → 15
- [x] Stats panel on the dashboard root, fed by `fetchStats()` from
      `$lib/api`. Shows: total scorecards, average score, total
      readiness-flag count (red when > 0, green when 0), and a
      band-distribution stacked bar coloured by the four band tokens.
      Backed by the Rust server's `GET /api/stats` when available,
      with a same-origin `src/routes/api/stats/+server.ts` fallback
      that aggregates the bundled sample data
- [x] Extract `bandToRecommendation()` + `RECOMMENDATION_COPY` into
      `src/lib/recommendation.ts` and unit-test (5 cases)
- [x] Vitest invariants for `src/lib/data.ts` (8 cases): 12 rows,
      unique ids, all 4 bands present, subtotal ranges, score equals
      subtotal sum, band derivable from score, every flag category /
      priority drawn from the allowed sets

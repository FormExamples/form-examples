# Agile Checklist — Tasks

## Done

- [x] Author `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`
- [x] Confirm 57 items in `seed.md` (Teams 25, Stakeholders 14, Practices 18)
- [x] SQL migrations
      (`agile_checklist`, `agile_checklist_grade`,
      `agile_checklist_grade_rule`, `agile_checklist_grade_flag`)
- [x] Generate `xml-representations/` from SQL via the monorepo helper
- [x] Generate `fhir-r5/` JSON from SQL via the monorepo helper
- [x] SvelteKit front-end form (5-step wizard, scoring engine, PDF report)
      — `pnpm test` 21/21, `pnpm run check` clean, browser smoke-tested
- [x] SvelteKit dashboard (individuals + teams views, sparkline trend,
      filters, CSV export, anonymous-row redaction)
      — `pnpm test` 15/15, `pnpm run check` clean, browser smoke-tested
- [x] Multi-respondent aggregation (mean-of-means by team)
- [x] Trend chart per team via inline SVG sparkline
- [x] Anonymous submission rendering with CSV redaction
- [x] CSV export from the dashboard

- [x] Static HTML form (single-page wizard with vanilla JS engine, no
      build step, runs under `file://`) — browser smoke-tested, engine
      output matches SvelteKit form exactly
- [x] Static HTML dashboard (tiles, sortable individuals view,
      aggregated teams view with SVG sparkline, filters, CSV export)
      — browser smoke-tested, output matches Svelte dashboard exactly

- [x] Rust full-stack (axum + Tera + HTMX + Alpine) with Rust port of the
      engine — `cargo test` 8/8, `cargo build` clean, browser smoke-tested,
      MATURE 89% matches SvelteKit and static-HTML outputs identically
- [x] Author background notes in `doc/` (scoring-algorithm, coaching-rules,
      flag-rules, sister-form-comparison)

- [x] Resolved `bin/test-form` SQL-filename mismatch — renamed
      `00_create_extensions.sql` → `00_extensions.sql` to match the
      monorepo convention (118 forms use `00_extensions.sql`; only 4
      used the longer name). `bin/test-form agile-checklist` no longer
      reports the missing-file error.
      The remaining `pnpm install` exit-code-1 messages are a
      pnpm-11 "ignored build scripts" warning that affects every form in
      the repo and is non-blocking (the script falls through and the
      build still works).

## Pending

- [ ] Wire Rust full-stack to PostgreSQL via SeaORM / Loco scaffolding
      (`../full-stack-with-loco-tera-htmx-alpine-setup`)

- [x] Sister-form linkage with `agile-principles-assessment` —
      `/comparison` route in the SvelteKit dashboard accepts both forms'
      CSVs, pairs teams by `team + organisation`, classifies each pair
      into one of the four quadrants from `doc/sister-form-comparison.md`
      (healthy-adoption / aspirational-gap / cargo-cult / pre-agile /
      insufficient-data), and renders both a per-team table and a 0–100
      quadrant scatter SVG. New `comparison.ts` module with 12 unit tests
      (overall now 42/42). Browser smoke-tested with a 4-team fixture
      covering each quadrant exactly.

## Future

- [ ] Weighted-section scoring with configurable weights

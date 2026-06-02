# Agile Checklist — Full-stack Tasks

## Done

- [x] `Cargo.toml` with axum 0.8, tokio, tera 1.20, serde, tower-http, tracing, uuid
- [x] `.gitignore` (`/target`)
- [x] `src/items.rs` — 57 items as `&'static [ItemDef]` constants
- [x] `src/engine.rs` — pure Rust port of the composite grader (band, maturity,
      section scoring, coaching rules, all flags); `#[cfg(test)]` unit tests
- [x] `src/main.rs` — axum routes (GET `/`, POST `/toggle`, POST `/reset`),
      Tera-rendered single-page wizard with HTMX partial-swap of the summary,
      Alpine.js local state on the action-plan disclosure
- [x] `templates/base.html.tera` (with HTMX 2.0.8 + Alpine 3.14.8 +
      `<body hx-boost="true">`)
- [x] `templates/index.html.tera` — full 5-step wizard
- [x] `templates/_summary.html.tera` — HTMX swap target, computed maturity
- [x] `cargo build` clean (0 warnings)
- [x] `cargo test` — 8/8 unit tests pass (band/maturity thresholds, all-yes,
      all-no with section flags, fewer-than-30 insufficient-data,
      finished-work flag, psych-safety flag, n/a denominator handling)
- [x] Browser smoke test (Playwright): 57 items render, HTMX yes/no/n-a
      clicks update the summary partial, all-yes-teams + all-yes-stakeholders
      + 12yes/6no-practices yields the expected MATURE 89% with section-imbalance
      and psychological-safety flags — **identical** to SvelteKit + static-HTML
      output. 0 console errors.

- [x] `src/dashboard.rs` — sample data (15 rows, 6 teams), `aggregate_by_team`,
      `totals`, server-side SVG sparkline path generation; 5 dashboard unit tests
- [x] `templates/dashboard.html.tera` — tiles, individuals table (13 columns),
      teams table with inline SVG sparklines
- [x] `GET /dashboard` route with Form↔Dashboard nav-tab on both pages
- [x] Browser smoke test: 15 individuals rows, 6 teams, 5 sparklines (Fornax
      has no scored rows), Aurora mean 77% — identical to SvelteKit and
      static-HTML dashboard output, 0 console errors
- [x] `cargo test` — 13/13 passing (8 engine + 5 dashboard)
- [x] SQLite persistence — `src/db.rs` opens a connection
      (in-memory by default, or file via `DB_PATH=…`), applies a
      `submissions` schema at startup, and exposes `insert`, `list`,
      `count`, `clear`, `latest`. New `POST /submit` handler reads the
      current answers from session state, computes the grading, captures
      the respondent (anonymous when name is blank), persists a row, and
      redirects to `/dashboard`. `GET /dashboard` reads from DB when
      non-empty and falls back to the bundled sample data otherwise.
      `cargo test` — **17/17** passing (8 engine + 5 dashboard + 4 db:
      open + insert, date-desc ordering, clear, null percent round-trip).
      Browser smoke-tested end-to-end: empty DB → 15 sample rows; submit
      Test User → redirect to dashboard, 1 row from DB with correct
      MATURE 88% from the engine; reload preserves the row; second
      anonymous submission → 2 rows with the anonymous row redacted.
      0 console errors.
- [x] Per-item answer persistence + `/submission/:id` detail route — the
      submissions table now carries an `answers_json` TEXT column;
      `db.insert` takes a `HashMap<String, String>` of answers. New
      `db.find` and `db.answers_for` queries power a Tera-rendered
      detail page showing respondent meta, weak sections, operational
      flags, and the full per-item answer table (yes/no/n-a coloured).
      Dashboard's individuals table gained a "Detail →" column.
      `cargo test` — **19/19** (added round-trip + find-by-id cases).
      Browser smoke-tested: a submission with t01=yes, t08=no, p14=n/a
      round-trips through the detail page exactly; `/submission/bogus`
      shows the "No submission found" empty state.
- [x] `/comparison` route — Rust port of the comparison algorithm in
      `src/comparison.rs` (`read_sister_csv`, `quadrant_for`,
      `pair_submissions`, `totals`) with 7 unit tests. GET renders a
      Tera page with two textareas; POST parses both CSVs server-side
      and re-renders inline tiles + scatter SVG + per-team table.
      Errors surface in an inline `<p class="err">` (e.g. "Principles
      CSV: missing required column: team"). `cargo test` — **26/26**
      passing (8 engine + 5 dashboard + 6 db + 7 comparison). Browser
      smoke-tested with a 4-team fixture that lands one team in each
      quadrant; error path verified by submitting a malformed CSV.
- [x] Action plan + coach notes — wizard step 5 grew an "Action plan"
      fieldset (top action 1/2/3, coach notes, overall notes). New
      `ActionPlan` struct + `db.action_plan_for(id)` query; the
      `submissions` table grew 5 TEXT columns. The detail page renders
      a conditional "Action plan" section that's omitted when the
      submission had no plan. `cargo test` — **27/27** (added round-trip
      test). Browser smoke-tested: actions + notes appear on detail;
      empty-plan submission correctly hides the section.
- [x] DB-backed comparison source — `/comparison` grew a "Behaviour data
      source" radio group. When set to "Use submissions persisted in
      this app", the server reads `db.list()`, converts each row to a
      `SisterRow` (using `overall_percent` as the score), and pairs it
      against the pasted principles CSV. When the DB is empty the page
      surfaces a friendly inline error ("Database: no submissions in the
      database yet — submit one first or paste a CSV"). Browser
      smoke-tested: empty-DB error path; submit-then-compare yields the
      correct HEALTHY ADOPTION classification for Aurora plus an
      INSUFFICIENT-DATA row for a principles team with no DB
      counterpart. 0 console errors.
- [x] JSON `GET /api/checklists` — returns `db.list()` serialised as the
      same camelCase `ChecklistRow` shape the SvelteKit and HTML
      dashboards consume. `tower-http` `cors` feature wired up with a
      permissive `Access-Control-Allow-Origin: *` so the static
      front-ends can fetch cross-origin (e.g. a dashboard served from
      `file://` or a different port). Smoke-tested: `[]` from empty DB;
      after a wizard submit, `application/json` + CORS header + the
      expected 16 camelCase keys (`team`, `overallPercent`,
      `isAnonymous`, etc.); cross-origin browser `fetch` from a blank
      page succeeds.

## Pending

- [ ] Wire to PostgreSQL via SeaORM (current store is SQLite; keep both?)
- [ ] Loco scaffolding via `cargo loco generate scaffold` per
      `../back-end-with-loco-setup`

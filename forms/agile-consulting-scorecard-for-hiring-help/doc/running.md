# Agile Consulting Scorecard — Running the system

Every piece of this form runs standalone — no shared database, no
service mesh, no orchestration. Pick whichever component you want
and follow the section below.

## The whole pipeline in one command

```sh
scripts/demo.sh
```

Boots the Rust axum server on a free port, exercises every one of the
nine HTTP endpoints with the golden sample (grade, recommendations,
pre-tender, submit, bulk-import, stats), and tears the server down on
exit. Requires `cargo`, `curl`, `python3`.

## SvelteKit wizard (form-with-svelte)

The 6-step wizard with the live score preview, the `/report` page
(with PDF export + pre-tender JSON download + "submit to backend"
button), and the `/diff` page (compare against a prior snapshot).

```sh
cd front-end-form-with-svelte
pnpm install
pnpm run dev            # http://localhost:5173 by default
pnpm run check          # svelte-check + 64 Vitest cases
pnpm run build          # production build
```

Engine + zod schema + pdfmake + recommendations + pre-tender + diff +
bulk-import all live under `src/lib/engine/`. The PDF endpoint is
`/report/pdf` (server-only `+server.ts`).

## SvelteKit dashboard (dashboard-with-svelte)

The reviewer dashboard with the SVAR DataGrid, the stats panel, the
per-scorecard report drilldown at `/report/[id]`, and the
`/import` bulk-import UI.

```sh
cd front-end-dashboard-with-svelte
pnpm install
pnpm run dev            # http://localhost:5173 by default
pnpm run check          # svelte-check + 13 Vitest cases
pnpm run build
```

By default the dashboard fetches from its own same-origin
`+server.ts` endpoints (`/api/dashboard/scorecards`,
`/api/scorecards/[id]`, `/api/stats`), which return the bundled sample
data. To point at the Rust backend instead, pass a base URL into
`fetchScorecards(base)` etc. (see `src/lib/api.ts`).

## Rust axum backend (back-end-with-loco)

The HTTP server with all nine endpoints, the in-memory `ScorecardStore`,
and the CLI grader.

```sh
cd back-end-with-loco
cargo run --bin agile-consulting-scorecard-server     # http://127.0.0.1:5150
cargo run --bin agile-consulting-scorecard-cli        # stdin JSON → stdout grade JSON
cargo test                                            # 43 tests (30 unit + 13 integration)
PORT=15500 cargo run --bin agile-consulting-scorecard-server   # override port
```

The endpoints are documented in [`api-reference.md`](./api-reference.md).

## Static HTML triple (no build step)

Three single-file pages that work without any dev server, framework,
or backend:

- `front-end-form-with-html/index.html` — the 6-step wizard with a
  sticky live preview and JSON export.
- `front-end-form-with-html/report.html` — printable readiness report
  (file-input / paste-JSON / load-sample, `@media print` stylesheet).
- `front-end-dashboard-with-html/index.html` — sortable / filterable
  11-column table with 12 inline samples.

Open any of them directly in a browser:

```sh
open front-end-form-with-html/index.html
open front-end-form-with-html/report.html
open front-end-dashboard-with-html/index.html
```

## Test everything

From the form root:

```sh
bin/test-form agile-consulting-scorecard-for-hiring-help
```

This runs the structural checks plus `pnpm run check` and
`cargo test` for every subdirectory. Expect ~120 passing tests and
zero `Error:` lines.

## Schema regeneration

If you change the SQL migrations:

```sh
bin/xml-representations/generate-xml-representations.py
bin/fhir-r5/generate-fhir-r5-representations.py
```

Both scripts run across every form in the monorepo; the
agile-consulting-scorecard-for-hiring-help entry produces XML+DTD
and FHIR R5 JSON for each of its 7 SQL tables.

## Engine-parity regeneration

The golden grade in `samples/sample-grade.json` is produced by the
Rust CLI:

```sh
cd back-end-with-loco
cargo run --quiet --bin agile-consulting-scorecard-cli \
    < ../samples/sample-assessment.json \
    > ../samples/sample-grade.json
```

The TypeScript Vitest suite (`src/lib/engine/parity.test.ts`) and the
Rust `matches_golden_sample` test both load this file and assert
their output equals it — so any divergence breaks CI.

# Architecture Decision Record — Tasks

## Scaffolding

- [x] `bin/create-form architecture-decision-record`
- [x] `index.md`
- [x] `AGENTS.md`
- [x] `plan.md`
- [x] `tasks.md`

## Schema

- [x] `00_extensions.sql`
- [x] `01_create_function_set_updated_at.sql`
- [x] `02_create_table_author.sql`
- [x] `03_create_table_organization.sql`
- [x] `04_create_table_architecture_decision_record.sql`
- [x] `05_create_table_architecture_decision_record_position.sql`
- [x] `06_create_table_architecture_decision_record_note.sql`

## Interchange

- [x] XML + DTD via `bin/xml-representations/generate-xml-representations.py`
- [x] FHIR R5 JSON via `bin/fhir-r5/generate-fhir-r5-representations.py`

## Front-ends

- [x] HTML wizard (16 steps) with Markdown export, localStorage autosave,
      and Markdown import (parser is the reverse of `buildMarkdown`)
- [x] SvelteKit wizard (16 steps, Svelte 5 runes, Tailwind 4) with
      autosave and Vitest tests for `buildMarkdown` (8 tests)
- [x] HTML dashboard (sortable / filterable register with status pills)
- [x] SvelteKit dashboard with `VITE_API_BASE_URL` override, falls back
      to sample data when the backend is unreachable

## Full-stack (Rust + Loco + Tera + HTMX + Alpine)

- [x] Loco app scaffolded; 5 ADR tables generated via
      `cargo loco generate scaffold`; migrations applied
- [x] Custom 16-section wizard at `/architecture_decision_records/{id}/edit`
- [x] HTMX-driven positions (Step 8) and notes (Step 15) with inline
      add/remove/exclusive-chosen
- [x] Read-only show view at `/architecture_decision_records/{id}`
- [x] Markdown export at `/architecture_decision_records/{id}/markdown`
- [x] JSON API at `/api/adrs` for the SvelteKit dashboard
- [x] CORS middleware whitelisting `http://localhost:5173`/`:4173`
- [x] Server-side enum validation (`status`, `decision_group`, `title`)
      returning HTTP 400 for SQL CHECK violations
- [x] Loco starter auth scaffolding (users, mailers, downloader worker,
      auth tests) removed; `cargo test` clean (5 validator unit tests)
- [x] FTL bundle initializer fix (empty `shared.ftl`, terms inlined per
      locale); server boots in default config

## Tests & verification

- [x] `bin/test-form architecture-decision-record` — passes apart from
      the environmental pnpm 11 `ERR_PNPM_IGNORED_BUILDS` on fresh
      installs, which affects every form in the repo
- [x] Round-trip test for `parseMarkdown` ↔ `buildMarkdown` via
      `doc/0001-use-tyree-and-akerman-template.md`

## Example artefact

- [x] `doc/0001-use-tyree-and-akerman-template.md` — a real ADR
      documenting this form's own template choice, in the canonical
      Markdown format. Doubles as a fixture for the HTML form's
      "Import .md" feature.

## Deferred

- Diagram embedding (currently link-only)
- Multi-author co-signing
- Search/filter across ADRs in the dashboard backend (in-page only)
- Auto-numbering of ADR slugs
- Supersession traversal (linking superseded ADRs visually)
- Playwright e2e for the SvelteKit wizard happy path
- Replace plain table with SVAR DataGrid in the dashboard
- `[slug]` Markdown viewer route in the SvelteKit dashboard

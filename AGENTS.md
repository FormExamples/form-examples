# Medical Forms

Medical forms monorepo for structured clinical assessments, patient intake,
cardiovascular risk calculators, administrative healthcare documents, privacy
notices, and staff training checklists. Each form collects data via a
single-page, step-by-step questionnaire, applies a validated scoring or grading
engine, and generates a clinical report with flagged issues.

## Spec-driven development

The system spec lives in [`spec.md`](spec.md) at the repo root. Each form
has its own domain spec in [`forms/<slug>/spec.md`](forms/AGENTS.md).
Update specs before changing code; regenerate derived artefacts after
schema changes. See `spec.md` §10 for the spec-driven workflow.

## Tools

### Structure and validation

- `bin/forms-as-kebab-case` — list all form directory slugs
- `bin/test` — run all form validation tests
- `bin/test-form <slug>` — test a single form by slug
- `bin/test-tools` — smoke-test every Lily-system tool's `--check` / `--counts` / `--help` modes
- `bin/create-form <slug>` — scaffold a new form directory
- `bin/update` — run the `update / upgrade / fix / harmonize / audit / test` Claude Code prompt against the repo

### SQL

- `bin/migrate-sql-filenames.py` — one-shot migration of each form's `sql-migrations/` to the canonical `NN_create_table_<name>.sql` layout
- `bin/sql-migrations/generate-sql-comments.py` — append missing `COMMENT ON TABLE` / `COMMENT ON COLUMN` to numbered SQL migrations
- `bin/sql-migrations/generate-sql-combined.py` — combine each form's numbered SQL migrations into `schema.sql`

### Loco back-end refactor

- `bin/loco-config-refactor [--check] [--dry-run] [--all|<slug>]` — mechanical Loco crate refactor for the canonical background-queue (Postgres only; drops `bg_sqlt` / `bg_redis`) and observability (OpenTelemetry + Prometheus `/metrics`) conventions; `--check` is the CI drift detector

### Generators (SQL → derived representations)

- `bin/xml-representations/generate-xml-representations.py` — generate XML and DTD per SQL table entity
- `bin/fhir-r5/generate-fhir-r5-representations.py` — generate FHIR HL7 R5 JSON per SQL entity
- `bin/protobuf/generate-protobuf-representations.py` — generate Protocol Buffers `.proto` schemas per SQL entity
- `bin/openapi/generate-openapi-representations.py` — generate OpenAPI 3.1 `.yaml` specifications per SQL entity
- `bin/back-end-with-loco/generate-back-end-with-loco-setup.py` — emit each form's `cargo loco generate scaffold --api` setup script

### Lily Design System (HTML front-ends)

- `bin/lily-html-refactor [--check] [--dry-run] [--scope=form|dashboard|both] [--all|<slug>]` — mechanical Lily HTML class swaps; `--check` is the CI drift detector
- `bin/lily-sync [--check] [--lily-dir PATH]` — snapshot Lily HTML component specs into `forms/lily-spec/` and record the pinned upstream commit in `forms/lily-version.md`

### Lily Design System (Svelte front-ends)

- `bin/lily-svelte-refactor [--check] [--dry-run] [--scope=form|dashboard|both] [--show-risky] [--all|<slug>]` — mechanical Lily Svelte class swaps + risky-pattern report; `--check` is the CI drift detector
- `bin/lily-svelte-status [--counts] [--slugs-only] [--status=PASS|PARTIAL|TODO|EMPTY]` — per-form Lily Svelte conformance report (PASS = canonical UI; PARTIAL = legacy names but Lily classes; TODO = no Lily yet; EMPTY = no implementation)
- `bin/lily-svelte-sync [--check] [--lily-dir PATH]` — snapshot Lily Svelte component sources into `forms/lily-svelte-spec/` and record the pinned upstream commit in `forms/lily-svelte-version.md`

### Specs

- `bin/generate-spec.py [--check] [<slug>…]` — generate per-form `spec.md` (living domain spec) from each form's `index.md`

## Form index

See [`forms/AGENTS.md`](forms/AGENTS.md) for the alphabetical index of every
form project.

## Form directory structure

Each form lives in `forms/<slug>/` with a consistent layout (the scaffolding
is created by `bin/create-form`):

```
forms/<slug>/
  index.md                                         # Form description and scoring details
  README.md -> index.md                            # Symlink for GitHub rendering
  AGENTS.md                                        # Agent instructions for this form
  CLAUDE.md                                        # Claude Code project instructions
  spec.md                                          # Living spec for spec-driven development
  plan.md                                          # Implementation plan and status
  tasks.md                                         # Task tracking
  doc/                                             # Documentation and references
  sql-migrations/                                  # PostgreSQL Liquibase migrations (source of truth)
  xml-representations/                             # XML + DTD per SQL table entity (generated)
  fhir-r5/                                         # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                                        # Protocol Buffers .proto schemas per SQL entity (generated)
  openapi/                                         # OpenAPI 3.1 .yaml specifications per SQL entity (generated)
  front-end-form-with-html/                        # Questionnaire (HTML + Lily Design System)
  front-end-form-with-svelte/                      # Questionnaire (SvelteKit)
  front-end-dashboard-with-html/                   # Dashboard (HTML + table)
  front-end-dashboard-with-svelte/                 # Dashboard (SvelteKit + SVAR Grid)
  back-end-with-loco/                              # Back-end Rust JSON API (axum + Loco; no Tera/HTMX/Alpine/CSS)
  back-end-with-loco-setup                         # Scaffold generator (executable shell script of `cargo loco generate scaffold --api` calls; generated)
```

## Standard workflow for a new form

1. `bin/create-form <slug>` — scaffold the directory.
2. Fill in `forms/<slug>/index.md`, `spec.md`, `AGENTS.md`, `plan.md`,
   `tasks.md` with the design spec.
3. Author SQL migrations in `forms/<slug>/sql-migrations/`.
4. Regenerate derived representations:
   - `python3 bin/xml-representations/generate-xml-representations.py`
   - `python3 bin/fhir-r5/generate-fhir-r5-representations.py`
   - `python3 bin/protobuf/generate-protobuf-representations.py`
   - `python3 bin/openapi/generate-openapi-representations.py`
   - `python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py`
5. Build the front-ends (form and dashboard, each in HTML and SvelteKit).
6. Build the back-end Rust JSON API implementation.
7. Run `bin/lily-html-refactor --check --all` to confirm no Lily contract drift.
8. `bin/test-form <slug>` — validate structure.
9. Update `forms/<slug>/tasks.md` with the work done.

## User interface

**IMPORTANT:** the form must be one continuous single-page wizard. No
multi-page forms.

## Technology stacks

See the per-stack agent docs:

- [Front-end with HTML / Lily Design System headless](forms/AGENTS-front-end-html.md)
- [Front-end with SvelteKit / Lily Design System Svelte headless](forms/AGENTS-front-end-svelte.md)
- [Front-end with SvelteKit / Tailwind / SVAR](AGENTS/front-end-with-sveltekit-tailwind-svar.md)
- [Back-end with Rust / axum / Loco (JSON API)](AGENTS/back-end-with-loco.md)
- [Back-end scaffold generator (setup script)](AGENTS/back-end-with-loco-setup.md)
- [SQL migrations](AGENTS/sql-migrations.md)
- [XML representations](AGENTS/xml-representations.md)
- [FHIR HL7 R5 representations](AGENTS/fhir-r5.md)
- [Protocol Buffers representations](AGENTS/protobuf.md)
- [OpenAPI representations](AGENTS/openapi.md)

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces, ampersands, or parentheses in filename).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV (Comma-Separated Values), and TSV (Tab-Separated Values).
- Generated artefacts are never hand-edited (XML, FHIR, protobuf, OpenAPI, Loco setup script).

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022 — Design and development of information for users](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

## Verify

```sh
bin/test                              # validates every form's structure
bin/lily-html-refactor --check --all  # Lily HTML contract drift detector
bin/lily-sync --check                 # Lily HTML spec-snapshot drift detector
bin/lily-svelte-refactor --check --all # Lily Svelte contract drift detector
bin/lily-svelte-sync --check          # Lily Svelte spec-snapshot drift detector
bin/generate-spec.py --check          # Per-form spec.md drift detector
bin/loco-config-refactor --check --all # Loco background-queue + observability drift detector
```

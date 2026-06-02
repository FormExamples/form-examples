# Medical Forms

Medical forms monorepo for structured clinical assessments, patient intake,
cardiovascular risk calculators, administrative healthcare documents, privacy
notices, and staff training checklists. Each project collects data via a
single-page, step-by-step questionnaire, applies a validated scoring or grading
engine, and generates a clinical report with flagged issues.

## Contents

- **134** form project directories under `forms/<slug>/`.
- PostgreSQL SQL migrations in Liquibase SQL format (source of truth for data shape).
- XML + DTD representations per SQL entity (generated).
- FHIR HL7 R5 JSON resources per SQL entity (generated).
- Protocol Buffers `.proto` schemas per SQL entity (generated).
- OpenAPI 3.1 `.yaml` specifications per SQL entity (generated).
- Four front-end implementations per form (form + dashboard, each in HTML and SvelteKit).
- One Rust back-end JSON API implementation per form (axum + Loco).
- Lily Design System HTML headless contract for every HTML front-end.
- Lily Design System Svelte headless contract for every SvelteKit front-end.

For the full list of form projects, see [`forms/AGENTS.md`](forms/AGENTS.md)
or run `bin/forms-as-kebab-case`.

## Spec-driven development

- [`spec.md`](spec.md) — system spec (this monorepo)
- [`forms/<slug>/spec.md`](forms/AGENTS.md) — per-form domain spec

Update the spec before changing code. See `spec.md` §10 for the workflow.

## Form categories

| Category                  | Examples                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| Risk scores & calculators | Framingham, QRISK3-based heart health check, PREVENT, SCORE2-Diabetes     |
| Specialty assessments     | Cardiology (NYHA/CCS), Oncology (ECOG), Pulmonology (GOLD), Renal (KDIGO) |
| Symptom scales            | PHQ-9, GAD-7, PCL-5, DLQI, PSQI, ESAS-r, SNOT-22, DHI                     |
| Pre-op / peri-op          | Pre-operative assessment (ASA), Anesthesiology, Post-operative report     |
| Safety & safeguarding     | Fall risk, Casualty card (NEWS2), Medical error report, Consent           |
| Administrative            | Patient intake, Medical records release, Hospital discharge, Transfer     |
| Donation & eligibility    | Blood donation (JPAC), Organ donation, Bone marrow, Semaglutide           |
| Occupational & workplace  | Workplace safety (HSE), Workplace stress, Workplace climate, Ergonomics   |
| Training & certification  | CPR training, First aid, EMT psychomotor, Medical language speaking       |
| Privacy & legal           | Care privacy notice, Code of conduct notice, Research privacy notice      |
| WHO referral & emergency  | Acute referral, Counter-referral, Prehospital, Emergency unit forms       |
| UK statutory              | DVLA B1/M1/V1, MAT B1 maternity certificate, LPA, fit-note (Med 3)        |

## Repository structure

```
.
├── AGENTS.md                       # Cross-cutting agent instructions
├── AGENTS/                         # Per-stack agent documentation
│   ├── fhir-r5.md
│   ├── front-end-with-sveltekit-tailwind-svar.md
│   ├── back-end-with-loco.md
│   ├── back-end-with-loco-setup.md
│   ├── openapi.md
│   ├── protobuf.md
│   ├── sql-migrations.md
│   └── xml-representations.md
├── bin/                            # Tools: generators, refactor, sync, scaffold, test
├── forms/                          # All form projects
│   ├── AGENTS.md                       # Index of all forms
│   ├── AGENTS-front-end-html.md        # Lily Design System HTML contract
│   ├── AGENTS-front-end-svelte.md      # Lily Design System Svelte contract
│   ├── lily-spec/                      # Pinned Lily HTML component snapshots
│   ├── lily-svelte-spec/               # Pinned Lily Svelte component snapshots
│   ├── lily-version.md                 # Pinned Lily HTML upstream commit hash
│   ├── lily-svelte-version.md          # Pinned Lily Svelte upstream commit hash
│   ├── plan.md                         # Lily HTML refactor plan
│   ├── tasks.md                        # Lily HTML refactor tasks
│   └── <slug>/                         # One directory per form (see below)
├── index.md                        # This file
├── README.md -> index.md           # Symlink for GitHub rendering
├── spec.md                         # System spec (spec-driven development)
├── plan.md                         # Development plan / roadmap
└── tasks.md                        # Task tracking
```

## Per-form structure

Each form lives in `forms/<slug>/` with a consistent layout:

```
forms/<slug>/
  index.md                                         # Form description + scoring system
  README.md -> index.md                            # Symlink for GitHub rendering
  AGENTS.md                                        # Agent instructions for this form
  CLAUDE.md                                        # Claude Code project instructions
  spec.md                                          # Living domain spec
  plan.md                                          # Implementation plan and status
  tasks.md                                         # Task tracking
  doc/                                             # Documentation and references
  sql-migrations/                                  # PostgreSQL Liquibase migrations (source of truth)
  xml-representations/                             # XML + DTD per SQL entity (generated)
  fhir-r5/                                         # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                                        # Protocol Buffers .proto schemas (generated)
  openapi/                                         # OpenAPI 3.1 .yaml specifications (generated)
  front-end-form-with-html/                        # Patient questionnaire (HTML + Lily)
  front-end-form-with-svelte/                      # Patient questionnaire (SvelteKit)
  front-end-dashboard-with-html/                   # Dashboard (HTML)
  front-end-dashboard-with-svelte/                 # Dashboard (SvelteKit + SVAR Grid)
  back-end-with-loco/                              # Back-end Rust JSON API (axum + Loco)
  back-end-with-loco-setup                         # Scaffold generator (executable script; generated)
```

## Design patterns

### Form

1. Single-page, step-by-step wizard using `StepNavigation` + `ProgressBar` (SvelteKit) or `<progress class="progress">` + `<ol class="step-list">` (HTML / Lily).
2. Pure scoring engine split into small files: `types.ts` → `*-rules.ts` → `*-grader.ts` → `flagged-issues.ts`.
3. Class-based Svelte 5 reactive store (`assessment.svelte.ts`) — no Svelte 3/4 stores.
4. PDF report generation via SvelteKit server endpoint (`/report/pdf`) using `pdfmake`.
5. Vitest unit tests for grading logic.

### Dashboard

- SVAR DataGrid with sortable columns and dropdown filters (SvelteKit) or `.data-table-*` family (HTML / Lily).
- Willow theme wrapper for consistent styling.
- Backend API client with sample-data fallback.
- Row list shows computed scores, severities, and safety flags.

### Back-end

- Loco framework with axum routing (default port 5150).
- Rust scoring engine mirrors TypeScript types with `serde(rename_all = "camelCase")`.
- SeaORM entities against PostgreSQL 18.
- JSON API only — no HTML rendering, no Tera templates, no HTMX, no Alpine.js, no static assets.
- Canonical resource at `/api/assessments` (list, create, read, update, submit, result).

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

## Tools

- `bin/forms-as-kebab-case` — list all form directory slugs
- `bin/create-form <slug>` — scaffold a new form directory
- `bin/test` — validate structure of all forms
- `bin/test-form <slug>` — validate one form
- `bin/update` — run the update/upgrade/fix/harmonize/audit/test prompt via Claude Code
- `bin/migrate-sql-filenames.py` — canonicalise `sql-migrations/` filenames
- `bin/sql-migrations/generate-sql-comments.py` — append missing SQL comments
- `bin/sql-migrations/generate-sql-combined.py` — combine numbered migrations into `schema.sql`
- `bin/xml-representations/generate-xml-representations.py` — XML + DTD per SQL entity
- `bin/fhir-r5/generate-fhir-r5-representations.py` — FHIR R5 JSON per SQL entity
- `bin/protobuf/generate-protobuf-representations.py` — Protocol Buffers per SQL entity
- `bin/openapi/generate-openapi-representations.py` — OpenAPI 3.1 per SQL entity
- `bin/back-end-with-loco/generate-back-end-with-loco-setup.py` — Loco setup script per form
- `bin/lily-html-refactor` — mechanical Lily HTML class swaps; `--check` is the CI drift detector
- `bin/lily-sync` — snapshot Lily HTML component specs and pin the upstream commit
- `bin/lily-svelte-sync` — snapshot Lily Svelte component sources and pin the upstream commit
- `bin/generate-spec.py` — generate per-form `spec.md` from `index.md`

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022 — Design and development of information for users](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

## Install

### Claude Code (optional)

```claudecode
/plugin marketplace add sveltejs/ai-tools
/plugin install svelte
```

### Claude terminal (optional)

```sh
claude mcp add -t stdio -s project svelte -- npx -y @sveltejs/mcp
```

### Rust back-end

Loco:

```sh
cargo install loco
cargo install sea-orm-cli
```

Create role if needed via shell:

```sh
createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
```

Create role if needed via psql:

```sql
CREATE USER loco PASSWORD 'loco';
ALTER USER loco CREATEDB;
```

Create databases via shell (example for `pre-operative-assessment-by-clinician`):

```sh
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_production || :
```

Create databases via psql:

```sql
CREATE DATABASE pre_operative_assessment_by_clinician_development OWNER loco;
CREATE DATABASE pre_operative_assessment_by_clinician_test OWNER loco;
CREATE DATABASE pre_operative_assessment_by_clinician_production OWNER loco;
```

Create languages:

```txt
assets/i18n/en-GB/main.ftl
assets/i18n/en-US/main.ftl
assets/i18n/cy-GB/main.ftl
assets/i18n/de-DE/main.ftl
```

## Verify

```sh
bin/test                              # validate every form's structure
bin/lily-html-refactor --check --all  # Lily HTML contract drift
bin/lily-sync --check                 # Lily HTML spec-snapshot drift
bin/lily-svelte-sync --check          # Lily Svelte spec-snapshot drift
bin/generate-spec.py --check          # Per-form spec.md drift
```

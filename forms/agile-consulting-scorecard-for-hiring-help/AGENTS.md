# Agile Consulting Scorecard for Hiring Help — Agent Instructions

A self-assessment scorecard for organizations considering hiring agile
consulting help. Captures sixteen yes/no checklist items (4 from the
Agile Manifesto, 12 from the Agile Principles) through a 6-step
single-page wizard, sums them into a 0–16 score, and emits a banded
readiness verdict (Low / Borderline / Medium / High) plus six
readiness flags.

See [`index.md`](./index.md) for the full design and the 6-step wizard
table. The unmodified design seed lives in [`seed.md`](./seed.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — original design seed (preserved verbatim)
- `./doc/` — `AGENTS.md` (references), `running.md` (how to run each
  subcomponent), `api-reference.md` (request/response shapes for the
  9 HTTP endpoints, with curl examples)
- `./samples/` — golden-file fixtures (`sample-assessment.json`,
  `sample-grade.json`) used by engine-parity tests on both the
  TypeScript and Rust sides
- `./scripts/` — `demo.sh` runs the whole pipeline end-to-end in ~10s
- `./sql/` — Liquibase-formatted Postgres schema (8 files)
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./front-end-form-with-html/` — static single-page wizard +
  printable report (`index.html`, `report.html`)
- `./front-end-form-with-svelte/` — SvelteKit wizard with the scoring
  engine, zod schema, pdfmake export, pre-tender summary, diff,
  recommendations, and `/report/pdf` server endpoint
- `./front-end-dashboard-with-html/` — static reviewer table with
  inline samples
- `./front-end-dashboard-with-svelte/` — SVAR DataGrid dashboard with
  same-origin endpoints, per-row report drilldown at `/report/[id]`,
  bulk-import UI at `/import`, and a band-distribution stats panel
- `./back-end-with-loco/` — Rust axum server (nine
  HTTP endpoints), CLI grader, in-memory `ScorecardStore`, and the
  full scoring engine (grader + recommendations + pre-tender + diff +
  bulk-import; parity-tested against the TypeScript engine)

## Scoring engine

- **Input shape:** `AgileConsultingScorecardAssessment` TypeScript type
  containing organization metadata, respondent metadata, and the sixteen
  boolean checklist answers (`item01`..`item16`) with optional evidence
  text per item.
- **Output shape:**
  ```ts
  gradeScorecard(data: AgileConsultingScorecardAssessment): {
    scoreTotal: number;                       // 0..16
    scoreBand: 'low' | 'borderline' | 'medium' | 'high';
    manifestoSubtotal: number;                // 0..4
    principlesSubtotal: number;               // 0..12
    firedRules: FiredRule[];                  // one per item, recording the answer
    additionalFlags: AdditionalFlag[];        // readiness flags
  }
  ```
- **Algorithm:** sum-of-points. Each `true` answer scores 1; the band
  is read from the table:
  - 0–4 → `low`
  - 5 → `borderline`
  - 6–10 → `medium`
  - 11–16 → `high`
- **Engine files:**
  `types.ts`, `utils.ts`, `manifesto-rules.ts`, `principles-rules.ts`,
  `score-grader.ts`, `flagged-issues.ts`.
- **Tests:** `score-grader.test.ts`, `manifesto-rules.test.ts`,
  `principles-rules.test.ts`, `flagged-issues.test.ts`.

## Readiness flags

These fire independently of the band:

- **No senior leadership buy-in** — manifesto item 4 false →
  `flag_no_senior_leadership_buyin` (high priority).
- **No customer contact** — manifesto item 1 or principle 5 false →
  `flag_no_customer_contact` (high).
- **No working software** — manifesto item 2 *and* principle 11 both
  false → `flag_no_working_software` (high).
- **No sustainable budget** — principle 12 false →
  `flag_no_sustainable_budget` (medium).
- **No self-organization** — principle 15 false →
  `flag_no_self_organization` (medium).
- **No reflection culture** — principle 16 false →
  `flag_no_reflection_culture` (medium).

## Reviewer override

The engine produces a computed band. The respondent (or a reviewing
sponsor) may override the verdict on step 6 with a documented reason.
Both the **computed** band and the **final** band are stored and
rendered in the report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text fields.
- `null` for unanswered booleans (item not yet attempted in the wizard).
- `false` for an explicit "no" answer; `true` for an explicit "yes".
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client- or server-side PDF
- Vitest for engine unit tests
- Single-page wizard with `StepNavigation` and `ProgressBar`

## Reviewer-dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns; dropdown filters on band, manifesto subtotal,
  principles subtotal, sector, organization size.
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL 18
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- ISO 9001:2015 — quality-management-system context for organizational
  self-assessment.
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users.
- UK GDPR — respondent name, email, and signature are personal data and
  must be handled per the form's privacy notice.
- This form is *not* a medical device. MDR / IVDR classification does
  not apply.

## Verify

```sh
bin/test-form agile-consulting-scorecard-for-hiring-help
```

# United Kingdom Statement of Fitness for Work — Agent Instructions

Implementation of the UK Med 3 / fit note. A healthcare professional records
a fitness-for-work assessment via a ten-step single-page wizard. A
policy-compliance grader classifies the fitness category, adaptation
intensity, and period compliance, and fires safety flags from DWP rules.

See [`index.md`](./index.md) for the full specification, ten-step wizard
table, and safety-flag catalogue.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — source material from DWP fit-note guidance
- `./doc/` — clinical and policy references
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` per SQL table
- `./typespec/` — generated TypeSpec definitions per SQL table
- `./front-end-form-with-html/` — static single-page HTML + Alpine.js wizard
- `./front-end-form-with-svelte/` — SvelteKit 2 + Svelte 5 wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SVAR DataGrid dashboard
- `./back-end-with-loco/` — Rust backend with
  server-rendered HTMX UI
- `./back-end-with-loco-setup` — `cargo loco scaffold`
  generator shell script

## Grading engine

- **Input shape:** `FitNote` TypeScript type containing issuer, patient,
  assessment, diagnosis, fitness, adaptation, comments, period, and
  follow-up sub-structures.
- **Output shape:**
  ```ts
  gradeFitNote(data: FitNote): {
    fitnessCategory: 'not_fit' | 'may_be_fit' | '';
    adaptationIntensity: 'none' | 'light' | 'moderate' | 'substantial' | 'comprehensive' | '';
    adaptationCount: number;          // 0..4
    periodDays: number | null;        // calculated from from/to or duration
    periodCompliance:
      | 'self_cert_range'
      | 'compliant'
      | 'exceeds_initial_max'
      | 'long_term'
      | 'very_long_term'
      | '';
    recommendation:
      | 'standard'
      | 'refer_occupational_health'
      | 'refer_access_to_work'
      | 'refer_employment_advisor'
      | 'review_for_validity'
      | '';
    firedRules: FiredRule[];
    safetyFlags: SafetyFlag[];
  }
  ```
- **Algorithm:** rules fire independently; the recommendation is the worst-
  severity match across fired rules. The validity check supersedes other
  recommendations.
- **Engine files:** `types.ts`, `utils.ts`, `validity-rules.ts`,
  `adaptation-rules.ts`, `period-rules.ts`, `safety-flag-rules.ts`,
  `grader.ts`.
- **Tests:** `grader.test.ts` covers the policy matrix.

## Policy rules (summary)

- A fit note cannot certify a patient as "fit for work" — only `not_fit` or
  `may_be_fit` (DWP policy 3.2).
- Initial fit-note maximum duration is 3 months in the first 6 months of the
  condition (DWP policy 3.3).
- Fit notes are not required for absence ≤ 7 calendar days
  (self-certification — DWP policy 2.1).
- A fit note without the issuer's name, profession, and practice address is
  invalid (DWP policy 3.7).
- Fit notes cannot be issued for non-medical problems (DWP policy 3.6).
- HIV, cancer, and multiple sclerosis are automatically classed as
  disabilities under the Equality Act 2010 (DWP policy 5.8).
- The 2022 amendment broadened issuance to nurses, occupational therapists,
  pharmacists, and physiotherapists in addition to doctors (DWP policy 1.2).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed, ten steps).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps.
- Import and export via JSON, XML, CSV, TSV.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF rendering matching the official DWP layout
- Vitest for engine unit tests
- Dynamic step route `/fit-note/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–10

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme
- Sortable columns, dropdown filters (fitness category, period compliance,
  recommendation, issuer profession)
- Backend API client with sample-data fallback for standalone development

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I data-capture.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form united-kingdom-statement-of-fitness-for-work
```

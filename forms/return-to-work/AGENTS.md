# Return to Work — Agent Instructions

Clinician-issued *Statement of Fitness for Work*. Captures the
clinician's assessment of an employee's fitness to resume work after
illness, injury, or extended absence; enumerates workplace adjustments
and restrictions; and computes a fitness statement (fit / may be fit /
not fit) plus a restriction-priority grade (routine / standard /
restricted / high-risk) with safety flags.

See [`index.md`](./index.md) for the full design and the 12-step wizard
table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — original research brief
- `./doc/` — clinical reference documentation (Med 3 guidance,
  self-certification, ICD-10 / SNOMED mapping, phased-return guidance,
  RIDDOR / DVLA cross-walks, Equality Act adjustments)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./typespec/` — generated TypeSpec schemas
- `./front-end-form-with-html/` — static single-page clinician wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page clinician
  wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid review
  dashboard
- `./back-end-with-loco/` — Rust backend with
  server-rendered HTMX UI
- `./back-end-with-loco-new/` — scaffold generator

## Scoring engine

- **Input shape:** `ReturnToWorkAssessment` TypeScript type containing
  patient, clinician, job-context, absence, diagnosis, treatment,
  functional, fitness-statement, phased-return, adjustment, follow-up,
  and sign-off sub-types.
- **Output shape:**
  ```ts
  calculateReturnToWork(data: ReturnToWorkAssessment): {
    fitnessStatement: 'fit' | 'may-be-fit' | 'not-fit';
    restrictionPriority: 'routine' | 'standard' | 'restricted' | 'high-risk';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the most severe adjustment sets the
  restriction priority; safety flags fire independently.
- **Engine files:** `types.ts`, `utils.ts`, `fitness-rules.ts`,
  `restriction-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `restriction-rules.test.ts`.

## Clinician-only rules

These rules require clinician judgement and do not appear on a
self-certification SC2:

- **Safety-critical-role + active restriction** → high-priority flag.
- **DVLA-notifiable diagnosis** → high-priority flag and forced
  `dvla_notification_required = yes`.
- **Workplace cause without RIDDOR reference** → high-priority flag.
- **Mental-health diagnosis without follow-up** → high-priority flag.
- **Period of incapacity > 28 days without OH referral** →
  medium-priority flag.
- **Clinician confidence "low" with no review date** → low-priority
  flag.

## Clinician override

The fitness engine produces a computed statement. The clinician may
override on step 12 with a documented reason. Both the **computed**
statement and the **final** statement are stored and rendered in the
PDF report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric and date fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed; steps 1-12).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Single continuous page — no multi-page wizard split.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- Dynamic step route `/assessment/[step=step]/+page.svelte` with the
  `step` param matcher validating 1-12.

## Clinician-dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow
  theme.
- Sortable columns, dropdown filters (fitness statement, restriction
  priority, follow-up status).
- Backend API client with sample-data fallback for standalone
  development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Clinical grounding

- UK DWP *Statement of Fitness for Work (Med 3): guidance for
  healthcare professionals*.
- UK gov.uk *The fit note: guidance for patients and employees*.
- NHS Employers *Fit Note FAQ for line managers*.
- Acas *Return-to-work meeting template*.
- HSE *RIDDOR* — workplace-cause reporting.
- DVLA *Assessing fitness to drive*.
- Equality Act 2010 — reasonable-adjustment duty.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- UK GDPR + Data Protection Act 2018.

## Verify

```sh
bin/test-form return-to-work
```

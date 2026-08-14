# Learning Disability Annual Health Check — Agent Instructions

UK primary-care annual health check for people aged 14 or over on a practice's
learning-disability register. Captured via a single continuous single-page
wizard covering reasonable adjustments and communication, physical health,
screening and immunization uptake, a medication review including **STOMP**,
mental health and behaviour, syndrome-specific checks, and carer and social
circumstances — and producing a **Health Action Plan**. This is a
**documentation / completeness** form: the engine grades whether the check was
carried out completely against the required components, confirms the Health
Action Plan, and raises clinical flags. It does not diagnose or grade severity.

Distinct from the sibling **learning-disability-assessment** form, which grades
adaptive functioning and a severity category.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS England AHC, RCGP/Cardiff template, STOMP)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Completeness engine

- **Input shape:** `AnnualHealthCheck` TypeScript type — context and
  identification fields, one field per required component, and the Health Action
  Plan fields.
- **Output shape:**
  ```ts
  check(data: AnnualHealthCheck): {
    status: 'complete' | 'incomplete';
    completenessPercent: number;          // 0..100
    healthActionPlanComplete: boolean;
    firedRules: FiredRule[];              // required components + completed flag
    flags: Flag[];                        // { code, priority, message }
  }
  ```
- **Algorithm:** a required component is **completed** only when it carries a
  real recorded value (`not-recorded` / `not-assessed` / `not-reviewed` / `''`
  do not count; `not-applicable` / `not-eligible` / `no-carer` do count).
  `completenessPercent = round(100 * completedCount / requiredCount)`. Overall
  `status` is `complete` only when every required component is completed **and**
  `healthActionPlanComplete` is `true` (Health Action Plan produced **and**
  shared). See spec §4.
- **STOMP handling:** raise the STOMP flag when `psychotropicPrescribed == 'yes'`
  and any of — indication missing, STOMP not discussed, or no last-review date.
  See spec §5.
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover a fully
  complete check (100%, `complete`), each missing component, the Health Action
  Plan gate, and every flag including the STOMP flag's three trigger paths.

## Flagged issues

Computed independently of the status (see spec §5): STOMP — psychotropic without
clear indication or review (high), no Health Action Plan (high), unaddressed
physical-health issue (high), dysphagia / choking risk (high), constipation risk
(medium), missing screening uptake (medium), reasonable adjustments not recorded
(medium), incomplete check (low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- NHS England. *Annual health checks for people with a learning disability.*
- RCGP / Cardiff University. *Health check template for the annual health check
  of people with a learning disability.*
- NHS England. *STOMP* and *STAMP* national programmes.
- NHS *Accessible Information Standard*; PHE *Making reasonable adjustments.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form learning-disability-annual-health-check
```

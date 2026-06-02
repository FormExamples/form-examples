# United States HIPAA Authorization Form — Agent Instructions

A legal authorization, governed by **45 CFR § 164.508**, by which a patient
(or their authorized representative) permits a covered entity to use or
disclose specifically described Protected Health Information (PHI) to a
named recipient for a stated purpose. The form is collected via a 9-step
single-page wizard and a rule-based validity engine that asserts every
HIPAA core element and required statement is present.

See [`index.md`](./index.md) for the full design and the 9-step wizard
table. See [`seed.pdf`](./seed.pdf) for the Tennessee DHS HS-2557
reference form on which the schema is modelled.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap
- `./tasks.md` — task tracking
- `./seed.md` / `./seed.pdf` — source materials
- `./doc/` — HIPAA Privacy Rule, 42 CFR Part 2, and state-template notes
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./typespec/` — TypeSpec models
- `./front-end-form-with-html/` — static single-page authorization wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page authorization
  wizard (primary data-entry UI)
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit + SVAR DataGrid review
  dashboard
- `./back-end-with-loco/` — Rust backend with
  server-rendered HTMX UI
- `./back-end-with-loco-setup` — scaffold generator
  (executable shell script of `cargo loco generate scaffold` calls)

## Validity engine

- **Input shape:** `HipaaAuthorization` TypeScript type containing patient,
  signer, disclosing source, recipient, records to disclose, purpose,
  expiration, patient rights acknowledgements, and signature subtypes.
- **Output shape:**
  ```ts
  validateAuthorization(data: HipaaAuthorization): {
    validityStatus: 'valid' | 'invalid' | '';
    completenessScore: number; // 0..100
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
    validatedAt: string; // ISO 8601
  }
  ```
- **Algorithm:** every required core element (45 CFR § 164.508(c)(1)) and
  required statement (45 CFR § 164.508(c)(2)) is checked by a separate
  rule. `validityStatus` is `valid` if and only if zero rules fire and no
  high-priority additional flags are raised. The `completenessScore` is
  a simple ratio of filled-to-required fields, used by the UI progress
  bar; it does not gate validity.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `sensitive-category-rules.ts`, `expiration-rules.ts`,
  `signature-rules.ts`, `flagged-issues.ts`, `validate-authorization.ts`.
- **Test files:** `validate-authorization.test.ts`,
  `sensitive-category-rules.test.ts`, `expiration-rules.test.ts`.

## Sensitive-category rules

Sensitive categories under federal law require explicit, segregated
authorization. Each rule is evaluated independently of the overall
core-element check:

- **Substance-use disorder (42 CFR Part 2):** records of drug or alcohol
  treatment / referral may not be disclosed without (a) explicit
  yes-with-initials consent and (b) the Part 2 prohibition-on-
  redisclosure statement attached to the disclosure.
- **HIV/AIDS:** many state laws require additional consent language and
  separate initials.
- **Mental-health records:** must be specifically and separately
  initialled — a single global checkbox is not sufficient.
- **Psychotherapy notes (45 CFR § 164.508(a)(2)):** must be authorised
  on a *separate* form; no compound authorization permitted.
- **Genetic information (GINA):** flagged but not federally restricted
  on disclosure.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered date / numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at`
  timestamps on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF generation
- Vitest for engine unit tests
- Dynamic step route `/authorization/[step=step]/+page.svelte` with the
  `step` param matcher validating 1–9.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme
- Sortable columns; dropdown filters for validity status, purpose, and
  sensitive-category coverage
- Backend API client with sample-data fallback for standalone dev

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Source documents

- Tennessee Department of Human Services HS-2557 (revised 12-15) —
  `seed.pdf`.
- HHS Office for Civil Rights — *Sample HIPAA Authorization Form*.
- Pennsylvania DHS HIPAA Authorization Form.
- 45 CFR § 164.508; 42 CFR Part 2; 38 U.S.C. § 7332.

## Compliance

- HIPAA Privacy Rule (45 CFR parts 160 and 164).
- HITECH Act (42 U.S.C. § 17921 et seq.).
- 21st Century Cures Act information-blocking rule.
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users.

## Verify

```sh
bin/test-form united-states-hipaa-authorization-form
```

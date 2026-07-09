# UK Lasting Power of Attorney for Health and Care Decisions — Agent Instructions

Digital implementation of the statutory **LP1H** form under the Mental
Capacity Act 2005 (England and Wales). Collects every LP1H field via a
14-step single-page wizard, runs a deterministic validity engine, raises
statutory and ambiguity flags, and emits a registration-ready application
bundle for the Office of the Public Guardian.

See [`index.md`](./index.md) for the full design and the 14-step wizard
table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — statutory references, OPG guidance, certificate-provider
  decision tree, rule catalogue
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./typespec/` — TypeSpec API definitions
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard (SVAR DataGrid)
- `./back-end-with-loco/` — Rust axum + Loco JSON API back-end
- `./back-end-with-loco-new/` — Loco scaffold generator

## Validity engine

- **Input shape:** `LpaApplication` TypeScript type containing donor,
  attorneys[], replacementAttorneys[], decisionRules, lstChoice,
  preferences, instructions, peopleToNotify[], certificateProvider,
  signatures, registration.
- **Output shape:**

```ts
calculateLpaValidity(data: LpaApplication): {
  validityStatus: 'ready-to-register' | 'needs-correction' | 'invalid';
  completenessScore: number;          // 0..100
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
  effectiveDate: string | null;       // earliest OPG submission date
};
```

- **Algorithm:** statutory-fatal cascade — any *fatal* fired rule sets
  `validityStatus = 'invalid'`. *High*-severity rules set `'needs-correction'`.
  Medium / informational rules surface in `additionalFlags` only.
- **Engine files:** `types.ts`, `utils.ts`, `donor-rules.ts`, `attorney-rules.ts`,
  `certificate-provider-rules.ts`, `signature-order-rules.ts`,
  `instruction-rules.ts`, `composite-validator.ts`, `flagged-issues.ts`.
- **Tests:** `composite-validator.test.ts`, `certificate-provider-rules.test.ts`.

## Statute-specific rules

Every rule has a stable identifier rooted in its statutory source:

- `R-MCA-S9-AGE` — donor ≥ 18 (MCA 2005 s.9(2)(c))
- `R-MCA-ATT-AGE` — each attorney ≥ 18 (s.10(1)(a))
- `R-MCA-CP-FAM`, `R-MCA-CP-EMP`, `R-MCA-CP-ROUTE` — certificate-provider
  eligibility (LPA Regs 2007 Sch.1 Pt.2)
- `R-MCA-ORDER` — donor → certificate provider → attorneys sign order
- `R-MCA-LST-CHOICE` — life-sustaining-treatment Option A / B selected
- `R-MCA-COP-PROHIBITED` — instructions do not authorise unlawful acts
- `R-MCA-INSTR-ADRT` — instructions do not contradict an existing ADRT

See [`doc/rule-catalogue.md`](./doc/rule-catalogue.md) for the full table.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` on every
  table.
- Statutory rule identifiers are stable across releases and re-use the
  source-document prefix (`R-MCA-…`, `R-LPA-REG-…`, `R-COP-…`).

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript strict
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for OPG-ready PDF generation
- Vitest for engine unit tests
- Dynamic step route `/lpa/[step=step]/+page.svelte` with the `step` param
  matcher validating 1 – 14.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (validity status, registration stage,
  donor jurisdiction).
- Sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Statutory grounding

- Mental Capacity Act 2005 (E&W).
- MCA Code of Practice (2007, draft 2022).
- Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007 + amendments.
- Powers of Attorney Act 2023.
- Office of the Public Guardian practice notes.
- gov.uk/lasting-power-attorney guidance.

## Compliance

- MDCG 2019-11 Rev.1 — administrative legal-document tool, not a medical
  device.
- UK GDPR Article 9 — donor and attorney personal data classified as
  special-category health data.
- NHS Data Security and Protection Toolkit when deployed in an NHS trust.

## Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions
```

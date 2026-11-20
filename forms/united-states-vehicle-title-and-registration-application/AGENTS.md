# United States Vehicle Title and Registration Application — Agent Instructions

An application for a certificate of title and registration with a United States
state motor vehicle agency. Collects the application (state, transaction,
acquisition), the owner identification, the vehicle and VIN, the federal
odometer disclosure, the title history and brands, any lien, insurance and
inspections, and the fees and tax via a single continuous single-page wizard.
The engine is a **completeness, validity, and eligibility** engine, not a numeric
score: it classifies the application as **Ready to submit**, **Incomplete**, or
**Title brand or lien issue**, and raises flagged issues.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — federal and state reference documentation and citations
- `./sql/` — PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./examples/` — filled-form fixtures and `personas.json`
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API

## Classification engine

- **Input shape:** `TitleApplication`: `application`, `owner`, `vehicle`,
  `odometer`, `titleHistory`, `lien`, `compliance`, `feesTax`.
- **Output shape:**
  ```ts
  validateApplication(a: TitleApplication): {
    applicationClass: 'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue';
    vinStatus: string;
    odometerDisclosureRequired: boolean;
    brandOrLienIssue: boolean;
    outstandingItemCount: number;
    stateRuleKnown: boolean;
    estimatedStateTaxUsd: number | null;
  }
  ```
  plus `detectFlaggedIssues(a)` for the flag list.
- **Algorithm:** classification, not additive. Precedence: a title brand, NMVTIS
  alert, unreleased lien, or "not actual mileage" odometer disclosure →
  `title-brand-or-lien-issue`; else any outstanding item → `incomplete`; else
  `ready-to-submit`. See spec §4.
- **HTML engine files:** `front-end-with-html/js/{types,rules,grader,flags}.js`.
  `rules.js` holds `STATE_RULES` (CA, NY, TX, FL, IL, PA, OH, WA, AZ), the VIN
  check digit, the odometer exemption, the brand and lien predicates, and
  `outstandingItems`.
- **Svelte engine files:** `front-end-with-svelte/src/lib/engine/`:
  `types.ts`, `utils.ts`, `title-rules.ts`, `title-grader.ts`,
  `flagged-issues.ts`, and `title-grader.test.ts`. Keep it a line-for-line port
  of the HTML engine.
- **Pinned by personas:** `examples/personas.json` pins the exact class and flags
  per persona (`bin/test-personas`).

## State rules

Federal law is encoded for every state; the state table is small and cited in
`doc/index.md`. Never encode a fee: fees change every legislative session. When
adding a state, add the row to `STATE_RULES` in both engines, to spec §4.3 and
`doc/index.md` (with its source), and add a persona.

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
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.

## Legal grounding

- 49 CFR 565.15 (VIN); 49 U.S.C. 32705 and 49 CFR Part 580 (odometer); 49 U.S.C.
  chapter 305 and 28 CFR part 25 (NMVTIS); the Uniform Certificate of Title Act;
  each state's certificate-of-title statute.

## Compliance

A non-medical, administrative documentation tool. The medical-device baselines
in the root `AGENTS.md` do not apply to its function. It is documentation
support, not legal advice; the issuing state agency decides.

## Verify

```sh
bin/test-form united-states-vehicle-title-and-registration-application
bin/test-personas united-states-vehicle-title-and-registration-application
bin/test-engines united-states-vehicle-title-and-registration-application
```

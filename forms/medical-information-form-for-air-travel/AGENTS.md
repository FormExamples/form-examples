# Medical Information Form for Air Travel — Agent Instructions

Digitization of the airline **Medical Information Form (MEDIF)**: a single-page
wizard that captures passenger identification, trip details, the attending
physician's clinical evaluation, requested in-flight medical accommodations,
and produces a fitness-to-fly band plus safety flags suitable for submission to
an airline medical desk.

See [`index.md`](./index.md) for the full design and the 14-step wizard table.

## Directory map

- `./index.md` — project overview and 14-step wizard table
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — research seed sourced from public airline MEDIF references
- `./doc/` — clinical reference notes (IATA, ASMA, airline-specific quirks)
- `./sql/` — Liquibase-formatted PostgreSQL migrations
- `./xml/` — XML + DTD per SQL table
- `./fhir/r5/` — FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — Protocol Buffers `.proto` schemas per SQL entity
- `./typespec/` — TypeSpec interface definitions per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard (SVAR DataGrid)
- `./back-end-with-loco/` — Rust axum + Loco JSON API back-end
- `./back-end-with-loco-setup` — shell script of `cargo loco generate scaffold` calls

## Scoring engine

- **Input shape:** `MedifAssessment` TypeScript type containing trip details,
  passenger identity, attending-physician identity, 7 clinical sections
  (cardiovascular, respiratory, recent-event, pregnancy, communicable,
  in-flight-needs, medications) and the requested accommodations.
- **Output shape:**
  ```ts
  evaluateFitnessToFly(data: MedifAssessment): {
    fitnessBand: 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
    firedRules: FiredRule[];
    safetyFlags: SafetyFlag[];
    deskRecommendation: string;
    validUntil: string; // ISO 8601 date
  }
  ```
- **Algorithm:** max-grade — the worst-band finding sets the overall
  fitness band; `fit` is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `equipment-rules.ts`,
  `recent-event-rules.ts`, `cardiorespiratory-rules.ts`, `pregnancy-rules.ts`,
  `communicable-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `recent-event-rules.test.ts`,
  `cardiorespiratory-rules.test.ts`, `pregnancy-rules.test.ts`.

## Airline-aligned rules

These rules track common airline MEDIF criteria across IATA member carriers.
Where carriers diverge, the most conservative window is used:

- **Acute MI within 7 days** → `unfit-to-fly`, high-priority cardiac flag.
- **Pneumothorax within 14 days** → `unfit-to-fly`, high-priority pulmonary
  flag (cabin pressure expands trapped gas).
- **Recent intra-ocular, intra-cranial, or intra-abdominal gas** within 7 days
  → `unfit-to-fly`, high-priority gas-expansion flag.
- **Recent abdominal surgery (laparotomy)** within 10 days → `requires-review`
  (some carriers 14 days).
- **Active communicable disease** in infectious period → `unfit-to-fly`,
  high-priority communicable flag.
- **Singleton pregnancy > 36 weeks** or **multiple pregnancy > 32 weeks** →
  `unfit-to-fly`.
- **Singleton pregnancy 28–36 weeks** or **multiple pregnancy 24–32 weeks** →
  `requires-review`, certificate required.
- **Severe anaemia (Hb < 75 g/L)** → `unfit-to-fly`.
- **Resting SpO₂ < 85 % on room air** → `unfit-to-fly`.
- **Supplemental oxygen requested, flow > 4 L/min sustained** →
  `requires-review`, dangerous-goods declaration mandatory.
- **Stretcher or incubator** → `requires-review`, sector-specific approval.
- **Battery-powered medical device** → `requires-review`, IATA Dangerous
  Goods Regulations clearance.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps
  on every table.
- The data-entry UI lives in `front-end-with-*` directories;
  the submitting agent may be the passenger, an accessible-travel agent, or
  the attending physician.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns; dropdown filters (fitness band, airline, departure date).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL 18
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- IATA *Medical Manual* (13th ed.).
- IATA *Dangerous Goods Regulations* for in-cabin batteries and oxygen.
- Aerospace Medical Association *Medical Guidelines for Airline Travel*.
- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I documentation
  aid (the airline medical desk holds the final decision).
- UK Medical Devices Regulations 2002.
- UK MHRA Software and AI as a Medical Device.
- ISO/IEC/IEEE 26514:2022.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```

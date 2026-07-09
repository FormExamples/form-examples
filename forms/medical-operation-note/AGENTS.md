# Medical Operation Note — Agent Instructions

Operating-team contemporaneous record of a surgical procedure. Collects
**objective intra-operative findings** via a 12-step single-page wizard,
computes a composite operative risk grade
(Routine / Complicated / High-risk / Critical) with Clavien–Dindo and
ASA context, produces a set of safety flags (incorrect count, retained
item, never-event candidate, massive haemorrhage, conversion to open,
unplanned ICU admission, anaesthetic incident), and emits a signed PDF
op note plus a FHIR R5 `Procedure` bundle.

See [`index.md`](./index.md) for the full design and the 12-step wizard
table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — source seed material from the user
- `./doc/` — clinical reference documentation (RCS Good Surgical Practice,
  WHO Safer Surgery Checklist, Never Events policy, Clavien–Dindo,
  OPCS-4 notes)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` per SQL entity
- `./openapi/` — generated OpenAPI 3.1 `.yaml` per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard (SVAR DataGrid)
  dashboard
- `./back-end-with-loco/` — Rust backend with
  a JSON API

## Scoring engine

- **Input shape:** `OperationNote` TypeScript type containing
  identification, team, diagnoses, procedures, anaesthesia, approach,
  technique, materials, drains, specimens, counts, EBL, complications,
  and post-op plan sub-types.
- **Output shape:**
  ```ts
  calculateOperationGrade(data: OperationNote): {
    compositeRisk: 'routine' | 'complicated' | 'high-risk' | 'critical';
    clavienDindoGrade: '0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V';
    asaPhysicalStatus: 1 | 2 | 3 | 4 | 5 | 6 | null;
    bloodLossBand: 'minimal' | 'mild' | 'moderate' | 'severe' | 'massive';
    countsAgreed: boolean;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade;
  Routine is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `composite-grader.ts`,
  `clavien-dindo-rules.ts`, `blood-loss-rules.ts`, `count-rules.ts`,
  `never-event-rules.ts`, `anaesthetic-event-rules.ts`,
  `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `clavien-dindo-rules.test.ts`,
  `count-rules.test.ts`.

## Operating-team-only rules

These rules depend on intra-operative observations and have no
patient-self-report analogue:

- **Incorrect count flag** — swab / needle / instrument count
  discrepancy unresolved at sign-out → high-priority flag, composite
  risk ≥ High-risk.
- **Retained foreign body flag** — any declared retained item → high
  priority, never-event candidate, composite risk = Critical.
- **Never-event flag** — wrong-site / wrong-side / wrong-patient /
  wrong-procedure / wrong-implant → high, statutory NHS England
  notification.
- **Massive haemorrhage flag** — EBL > 1500 mL → high, composite risk
  ≥ High-risk; EBL > 3000 mL → Critical.
- **Massive transfusion flag** — ≥ 4 units PRBC intra-op or massive
  haemorrhage protocol activated → high.
- **Conversion to open flag** — planned minimally-invasive case
  converted to open → medium.
- **Intra-operative arrest flag** — cardiac or respiratory arrest in
  theatre → high, composite risk = Critical.
- **Anaesthetic incident flag** — failed intubation, awareness,
  anaphylaxis, malignant hyperthermia, suxamethonium apnoea → high.

## Surgeon override

The grading engine produces a computed composite risk. The lead
surgeon may override on step 12 with a documented reason. Both the
**computed** grade and the **final** grade are stored and rendered in
the PDF report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces,
  ampersands, or parentheses in filename).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Times are stored as `TIMESTAMPTZ`; durations are derived in code.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests
- Dynamic step route `/operation-note/[step=step]/+page.svelte` with the
  `step` param matcher validating 1–12.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (composite risk, Clavien–Dindo,
  urgency, specialty, surgeon).
- Backend API client with sample-data fallback for standalone
  development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Clinical grounding

- Royal College of Surgeons of England — *Good Surgical Practice* (2014,
  updated 2023), §3.5 *Record-keeping and the operation note*.
- WHO Surgical Safety Checklist (2009, 2nd edition).
- NHS England Never Events Policy and Framework (2018).
- Clavien–Dindo classification of surgical complications (Ann Surg
  2004; 240:205).
- NCEPOD Classification of Intervention.
- OPCS-4 procedure coding (NHS Digital).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form medical-operation-note
```

# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) — Agent Instructions

A UK personalized emergency care and treatment plan created through shared
decision-making. Collects the person's summary of health, preferences and what
matters, agreed clinical recommendations, an explicit CPR recommendation, and
ceilings of treatment via a single continuous single-page wizard. This is a
**documentation and completeness** form — it produces no numeric clinical score.
The engine validates the plan against mandatory content and process rules,
reports a **status** (Complete / Incomplete) with a completeness percentage, and
raises safety and governance flags.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical / regulatory reference documentation (ReSPECT v3.0
  guidance, Mental Capacity Act 2005, GMC end-of-life guidance)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily;
  RESTful `/plans/` list + `/plans/[id]` form)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Validation engine

- **Input shape:** `RespectPlan` TypeScript type — the eight section groups
  (personal details, summary of health, preferences, clinical recommendations,
  CPR recommendation, ceilings of treatment, capacity and involvement, clinician
  sign-off).
- **Output shape:**
  ```ts
  validate(plan: RespectPlan): {
    status: 'complete' | 'incomplete';
    completenessPercent: number;   // 0..100
    firedRules: FiredRule[];       // which mandatory rules passed / failed
    flags: Flag[];                 // safety and governance flags
  }
  ```
- **Algorithm:** rule-based, not additive. Each mandatory rule (see spec §4) is
  evaluated as satisfied or unsatisfied. `status` is `complete` only when every
  mandatory rule is satisfied; otherwise `incomplete`. `completenessPercent` is
  the proportion of mandatory fields present, reported independently of status.
  The capacity rule is conditional: proxy / consultee involvement is only
  required when the person is recorded as lacking capacity.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `plan-validator.ts`, `flagged-issues.ts`.
- **Tests:** `plan-validator.test.ts`, `validation-rules.test.ts` — cover each
  mandatory rule passing and failing, the conditional capacity rule (has-capacity
  vs lacks-capacity), completeness-percent arithmetic, and status transitions.

## Flagged issues

Computed independently of status (see spec §5), each with a priority:

- **CPR recommendation not documented** (high) — no attempt / do-not-attempt
  selection.
- **Capacity assessment missing** (high) — person lacks capacity but no capacity
  assessment or proxy / consultee involvement recorded (Mental Capacity Act
  2005).
- **No clinician signature** (high) — plan unsigned.
- **DNACPR without documented discussion** (high) — do-not-attempt-CPR recorded
  with no record of discussion with the person or their proxy.
- **Review date passed** (medium) — planned review date is in the past.
- **Summary of health missing** (low) — no clinical summary recorded.

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

- Resuscitation Council UK. *ReSPECT* — form and guidance, version 3.0.
- General Medical Council. *Treatment and care towards the end of life.*
- Mental Capacity Act 2005; Adults with Incapacity (Scotland) Act 2000.
- BMA / Resuscitation Council UK / RCN. *Decisions relating to cardiopulmonary
  resuscitation* (3rd edition).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- Mental Capacity Act 2005 (capacity and involvement rules).
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form recommended-summary-plan-for-emergency-care-and-treatment
```

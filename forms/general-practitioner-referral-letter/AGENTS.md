# General Practitioner Referral Letter — Agent Instructions

A structured primary-care referral letter to a specialist or service. Collects
patient and referrer details, referral destination, urgency, reason and history,
examination and investigation findings, medications and allergies, and the
patient's expectations, consent, and safety-netting via a single continuous
single-page wizard. A **documentation engine** grades completeness
(Complete / Incomplete), classifies urgency (routine / urgent / two-week-wait
suspected cancer / emergency), computes a completeness percentage, and raises
flags. It is a documentation and completeness form, **not** a numeric-score or
diagnostic instrument.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical / administrative reference documentation (NICE NG12,
  NHS e-RS referral standards)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Documentation engine

- **Input shape:** `Referral` TypeScript type — referrer, patient, destination,
  urgency, and clinical-content fields (see spec §3).
- **Output shape:**
  ```ts
  assess(referral: Referral): {
    status: 'Complete' | 'Incomplete';
    urgency: 'routine' | 'urgent' | 'two-week-wait' | 'emergency';
    completenessPercent: number;   // 0..100
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
- **Algorithm:** completeness — the mandatory-field set depends on the selected
  urgency; `status` is `Complete` only when every mandatory field is present, and
  `completenessPercent` is the proportion present (see spec §4). `urgency` is
  echoed as the classification. The engine reports; it never blocks sending.
  - always mandatory: patient id / name / DOB, referrer name / role / practice,
    specialty, urgency, reason, relevant history
  - `urgent` / `two-week-wait` → `urgencyReason` mandatory
  - `two-week-wait` → `suspectedCancerCriterion` + `suspectedCancerPathway`
    mandatory
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `referral-validator.ts`, `flagged-issues.ts`.
- **Tests:** `referral-validator.test.ts`, `validation-rules.test.ts` — cover
  each urgency's mandatory set, the Complete / Incomplete boundary,
  `completenessPercent` at 0 / partial / 100, and every flag.

## Flagged issues

Computed independently of the status (see spec §5): suspected-cancer pathway
(`urgency == 'two-week-wait'`, high), emergency features (`urgency == 'emergency'`
or `redFlagSymptoms` present, high), mandatory information missing (any
always-mandatory field absent, high), urgency information missing (urgent /
two-week-wait without reason / criterion / pathway, medium), consent not
documented (`consentToShare != 'yes'`, medium), no safety-netting recorded
(medium/low).

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
- British English throughout.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical and administrative grounding

- NICE NG12. *Suspected cancer: recognition and referral* — two-week-wait
  criteria.
- NHS e-Referral Service (e-RS) referral standards and Directory of Services.
- Academy of Medical Royal Colleges. *Please, write to me* (2018).
- Montgomery v Lanarkshire Health Board [2015] UKSC 11 — consent.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form general-practitioner-referral-letter
```

# Cervical Screening record — Agent Instructions

A structured record of a cervical screening (smear) encounter under the UK NHS
Cervical Screening Programme. Collects eligibility, consent, sample adequacy, the
primary high-risk HPV (hrHPV) result, and reflex cytology via a single continuous
single-page wizard, then classifies the **result** and the **management outcome**
(routine recall / early repeat 12 months / colposcopy referral / cease) and
raises safety flags. This is a documentation and result-classification form, not
a numeric-score calculator.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS CSP HPV primary screening)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `ScreeningRecord` TypeScript type — encounter context,
  identification, eligibility, consent, symptoms, sample adequacy, hrHPV result,
  and reflex cytology fields.
- **Output shape:**
  ```ts
  grade(record: ScreeningRecord): {
    resultClass:
      | 'inadequate'
      | 'hpv-negative'
      | 'hpv-positive-cytology-normal'
      | 'hpv-positive-cytology-abnormal-low'
      | 'hpv-positive-cytology-abnormal-high'
      | 'hpv-positive-cytology-pending'
      | 'cease-not-eligible'
      | 'pending';
    managementAction:
      | 'routine-recall'
      | 'early-repeat-12-months'
      | 'colposcopy-referral'
      | 'urgent-colposcopy-referral'
      | 'repeat-sample-3-months'
      | 'cease-screening'
      | 'awaiting-cytology'
      | 'awaiting-result';
    status: 'complete' | 'incomplete';
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
- **Algorithm:** first-match pathway (see spec §4). Eligibility is checked first
  (age 25–64 and not ceased), then sample adequacy, then the hrHPV primary
  result; a positive hrHPV result is refined by reflex cytology into the
  normal / low-grade / high-grade branches. This is **not** additive scoring —
  no numeric total is computed.
- **Engine files:** `types.ts`, `utils.ts`, `screening-rules.ts`,
  `screening-grader.ts`, `flagged-issues.ts`.
- **Tests:** `screening-grader.test.ts`, `screening-rules.test.ts` — cover every
  result class and management action, the eligibility and adequacy gates, and
  each reflex-cytology branch.

## Result classes and management outcomes

| `resultClass` | `managementAction` |
| --- | --- |
| `inadequate` | `repeat-sample-3-months` |
| `hpv-negative` | `routine-recall` |
| `hpv-positive-cytology-normal` | `early-repeat-12-months` |
| `hpv-positive-cytology-abnormal-low` | `colposcopy-referral` |
| `hpv-positive-cytology-abnormal-high` | `urgent-colposcopy-referral` |
| `cease-not-eligible` | `cease-screening` |
| `hpv-positive-cytology-pending` | `awaiting-cytology` |
| `pending` | `awaiting-result` |

## Flagged issues

Computed independently of the result class (see spec §5): urgent colposcopy
(HPV-positive + high-grade cytology, high), symptomatic — refer regardless of
screen (high), missing consent (high), inadequate sample — repeat (medium),
HPV-positive with cytology outstanding (medium), patient overdue (medium), age
outside the eligible 25–64 range (medium).

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

- NHS Cervical Screening Programme — *HPV primary screening* pathway (PHE /
  UKHSA / NHS England).
- NHS CSP — *Colposcopy and Programme Management* (NHSCSP Publication 20).
- BAC / RCPath — cervical cytology terminology (dyskaryosis grading).
- NICE NG12 — *Suspected cancer: recognition and referral*.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form cervical-screening
```

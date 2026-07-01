# Zarit Burden Interview (ZBI) — Agent Instructions

A caregiver self-report questionnaire measuring the subjective burden of an
informal carer looking after a person with dementia, chronic illness, or
disability. The carer rates 22 items on a 0–4 frequency scale via a single
continuous single-page wizard; the items sum to a total of 0–88, mapped to a
burden band from *little or no burden* to *severe burden*. A validated 12-item
short form (total 0–48; high-burden cut-off ≥ 17) is supported. A high total
prompts carer support, respite, and mental-health screening.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Zarit 1980, Bédard 2001 short form)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `ZaritAssessment` TypeScript type — the context and subject
  fields plus the 22 item ratings (`item1`…`item22`, each `0 | 1 | 2 | 3 | 4 |
  null`) and the `instrumentForm` selector (`'zbi22' | 'zbi12'`).
- **Output shape:**
  ```ts
  gradeZarit(data: ZaritAssessment): {
    firedItems: FiredItem[];
    totalScore: number;              // 0..88 (ZBI-22) or 0..48 (ZBI-12)
    maxScore: 88 | 48;
    burdenBand:
      | 'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe'
      | 'lower' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the answered ratings over the active item set
  (all 22, or the 12 short-form items `1,2,3,6,9,10,11,12,17,20,21,22`); a
  missing rating contributes 0 and raises a data-completeness flag. The total
  maps to a burden band (ZBI-22: 0–21 / 22–40 / 41–60 / 61–88; ZBI-12: <17 /
  ≥17). See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `zarit-rules.ts`, `zarit-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `zarit-grader.test.ts`, `zarit-rules.test.ts` — cover each band
  boundary (21/22, 40/41, 60/61 for ZBI-22; 16/17 for ZBI-12), the all-0 minimum
  and all-4 maximum, missing-item handling, and both instrument forms.

## Flagged issues

Computed independently of the band (see spec §5): severe burden
(`totalScore >= 61` ZBI-22 or `>= 17` ZBI-12, high), moderate-to-severe burden
(`totalScore` 41–60 ZBI-22, high), carer mental-health screen (high/severe
burden or `item22 == 4`, high), high global burden (`item22 >= 3`, medium),
incomplete assessment (any active item missing, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, time, and item-rating fields.
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

- Zarit S.H., Reeves K.E., Bach-Peterson J. Relatives of the impaired elderly.
  *The Gerontologist* 1980; 20(6):649–655.
- Bédard M. *et al.* The ZBI: a new short version and screening version.
  *The Gerontologist* 2001; 41(5):652–657.
- Hébert R. *et al.* Reliability, validity and reference values of the ZBI.
  *Canadian Journal on Aging* 2000; 19(4):494–507.
- NICE NG97. *Dementia: assessment, management and support for people living
  with dementia and their carers.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form zarit-burden-interview
```

# Edinburgh Postnatal Depression Scale (EPDS) — Agent Instructions

A 10-item self-report screen for perinatal (antenatal and postnatal) depression,
completed via a single continuous single-page wizard. Each item scores 0–3 for a
total of 0–30. Items **3, 5, 6, 7, 8, 9 and 10 are reverse-scored**. A total of
**≥ 10** flags possible depression and **≥ 13** likely depression; either prompts
further assessment. **Any score > 0 on item 10** (self-harm) is a mandatory
safety flag requiring immediate risk assessment, regardless of the total.

See [`index.md`](./index.md) for the full design and the item / assessment-step
tables, and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Cox 1987, NICE CG192)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `EpdsAssessment` TypeScript type — the ten item responses plus
  context and identification fields. Each item response is the **already-scored**
  0–3 value; the reverse-scoring is applied when mapping the printed option to a
  score (see spec §4), so the stored `item1..item10` values are all 0–3 with
  higher = more symptomatic.
- **Output shape:**
  ```ts
  gradeEpds(data: EpdsAssessment): {
    itemScores: [number, number, number, number, number,
                 number, number, number, number, number]; // each 0..3
    totalScore: number;          // 0..30
    band: 'lower' | 'possible' | 'likely';
    selfHarmFlag: boolean;       // item10 > 0
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the ten 0–3 item scores to a total 0–30; the band
  is `>= 13` → `likely`, `>= 10` → `possible`, else `lower`. `selfHarmFlag` is
  `item10 > 0` and is computed independently of the total. See spec §4. Reverse
  scoring for items 3, 5, 6, 7, 8, 9, 10 is applied at option→score mapping
  (`score = 3 - optionIndex`); items 1, 2, 4 use `score = optionIndex`. A missing
  item response contributes 0 to the total and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `epds-rules.ts`, `epds-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `epds-grader.test.ts`, `epds-rules.test.ts` — cover the reverse-score
  mapping for each item, the band boundaries (9/10 and 12/13), the full 0–30
  range, and the item-10 safety flag for every non-zero response.

## Flagged issues

Computed independently of the band (see spec §5): self-harm risk (`item10 > 0`,
urgent — overrides everything), likely depression (`totalScore >= 13`, high),
possible depression (`totalScore >= 10`, medium), elevated anxiety subscale
(items 3, 4, 5 sum high, low/informational), incomplete assessment (any item
response missing, low).

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

- Cox J.L., Holden J.M., Sagovsky R. Detection of postnatal depression: the
  10-item EPDS. *British Journal of Psychiatry* 1987; 150:782–786.
- Cox J.L. *et al.* Validation of the EPDS in non-postnatal women.
  *Journal of Affective Disorders* 1996; 39:185–189.
- NICE CG192. *Antenatal and postnatal mental health.*
- Royal College of Psychiatrists / RCOG perinatal mental-health guidance.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form edinburgh-postnatal-depression-scale
```

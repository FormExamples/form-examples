# Wells Score for Pulmonary Embolism — Agent Instructions

Clinical prediction rule for the pre-test probability of acute pulmonary
embolism (PE) in adults with suspected PE. Collects seven weighted criteria via
a single continuous single-page wizard — DVT signs (+3), PE most likely (+3),
heart rate > 100 (+1.5), immobilization ≥ 3 days or surgery in the previous
4 weeks (+1.5), previous DVT/PE (+1.5), haemoptysis (+1), malignancy (+1) —
sums a total of **0–12.5**, and stratifies into a two-level band: **> 4 → PE
likely → CTPA**; **≤ 4 → PE unlikely → D-dimer** (consider PERC for unlikely,
low-gestalt cases).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Wells, NICE NG158, PERC)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `WellsPeAssessment` TypeScript type — the seven criterion
  inputs plus context, identification, and haemodynamic-status fields.
- **Output shape:**
  ```ts
  gradeWellsPe(data: WellsPeAssessment): {
    dvtSignsPoints: 0 | 3;
    peMostLikelyPoints: 0 | 3;
    heartRatePoints: 0 | 1.5;
    immobilisationSurgeryPoints: 0 | 1.5;
    previousDvtPePoints: 0 | 1.5;
    haemoptysisPoints: 0 | 1;
    malignancyPoints: 0 | 1;
    wellsScore: number;            // 0 .. 12.5
    twoLevelBand: 'unlikely' | 'likely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedPathway: 'd-dimer' | 'ctpa';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted — each present criterion contributes its
  points; the total 0–12.5 determines the bands. See spec §4.
  - `dvtSigns == 'yes'` → 3
  - `peMostLikely == 'yes'` → 3
  - `heartRate > 100` → 1.5
  - `immobilisationSurgery == 'yes'` → 1.5
  - `previousDvtPe == 'yes'` → 1.5
  - `haemoptysis == 'yes'` → 1
  - `malignancy == 'yes'` → 1
  - `twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely'`
  - `recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'`
  - `threeLevelBand = wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high'`
  - A missing numeric heart rate contributes 0 points and raises a
    data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-pe-rules.ts`,
  `wells-pe-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-pe-grader.test.ts`, `wells-pe-rules.test.ts` — cover each
  threshold boundary (heart rate 100/101, two-level 4/4.5, three-level 1.5/2 and
  6/6.5) and the 0 and 12.5 extremes.

## Flagged issues

Computed independently of the total (see spec §5): haemodynamic instability
(`haemodynamicStatus == 'unstable'`, high — bypass scoring, resuscitate and
image immediately), PE likely → arrange CTPA (`twoLevelBand == 'likely'`, high),
PE unlikely → arrange D-dimer (`twoLevelBand == 'unlikely'`, medium — consider
PERC), incomplete assessment (any criterion input missing, low).

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

- Wells P.S. *et al.* *Thromb Haemost* 2000; 83(3):416–420.
- Wells P.S. *et al.* *Ann Intern Med* 2001; 135(2):98–107.
- NICE NG158. *Venous thromboembolic diseases* (2020, updated 2023).
- Kline J.A. *et al.* PERC. *J Thromb Haemost* 2004; 2(8):1247–1255.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form wells-score-for-pulmonary-embolism
```

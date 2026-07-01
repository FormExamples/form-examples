# Bowel Cancer Screening with Faecal Immunochemical Test (FIT) — Agent Instructions

Documentation and result-classification form for the NHS Bowel Cancer Screening
Programme. Records a home FIT kit outcome via a single continuous single-page
wizard — eligibility, kit return and adequacy, and the measured faecal
haemoglobin concentration in µg Hb/g — and classifies the result against the
programme threshold (**≥ 120 µg Hb/g** positive), setting a management action
(routine recall / colonoscopy referral / repeat kit). Red-flag symptoms route to
the urgent suspected-cancer pathway regardless of the numeric result.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (BCSP guidance, NICE DG56 / NG151)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `FitAssessment` TypeScript type — the eligibility, kit
  adequacy, FIT result, and symptom fields plus context and identification.
- **Output shape:**
  ```ts
  gradeFit(data: FitAssessment): {
    resultClass: '' | 'negative' | 'positive' | 'spoilt';
    managementAction: 'routine-recall' | 'refer-colonoscopy' | 'repeat-kit';
    symptomaticPathway: boolean;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** priority-ordered classification (see spec §4) — kit not returned
  or inadequate sample → repeat kit; `faecalHaemoglobin >= thresholdApplied`
  (default 120) → positive → colonoscopy; below threshold → negative → routine
  two-yearly recall. `redFlagSymptoms == 'yes'` sets `symptomaticPathway`
  independently of `resultClass`. A missing Hb on a returned, adequate kit is
  incomplete (not negative) and raises a completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `fit-rules.ts`, `fit-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `fit-grader.test.ts`, `fit-rules.test.ts` — cover the threshold
  boundary (119 / 120 / 121), each result class, non-return, spoilt/inadequate
  kit, and the symptomatic override on a negative result.

## Flagged issues

Computed independently of the result class (see spec §5): positive screen
(`resultClass == 'positive'`, high), symptomatic suspected-cancer
(`redFlagSymptoms == 'yes'`, high), kit not returned / overdue
(`kitReturned == 'no'`, medium), spoilt / inadequate kit
(`sampleAdequacy != 'adequate'`, medium), incomplete result (returned & adequate
but `faecalHaemoglobin` missing, low).

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

- Public Health England / NHS England. *Bowel Cancer Screening Programme:
  guidance and FIT operational standards* (programme threshold ≥ 120 µg Hb/g).
- NICE **DG56**. *Quantitative faecal immunochemical testing to guide colorectal
  cancer pathway referral in primary care* (symptomatic threshold ≥ 10 µg Hb/g).
- NICE **NG151**. *Colorectal cancer.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form bowel-cancer-screening-with-faecal-immunochemical-test
```

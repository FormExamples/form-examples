# Ottawa Knee Rule — Agent Instructions

A validated clinical decision rule that decides whether a knee radiograph
(X-ray) is needed after an acute knee injury. Collects five objective bedside
criteria via a single continuous single-page wizard — age ≥ 55; isolated
patellar tenderness (no other bony tenderness); tenderness at the head of the
fibula; inability to flex the knee to 90°; inability to bear weight (take 4
steps) both immediately and in the ED — and applies **ANY-of** logic: a knee
X-ray is **indicated** when at least one criterion is present.

This is a **classification / decision-rule** form (imaging yes/no), **not** a
numeric score. The criteria are not summed or weighted; presence of any one is
sufficient to indicate imaging.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Stiell et al.; systematic reviews)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Decision engine

- **Input shape:** `OttawaKneeAssessment` TypeScript type — the five criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeOttawaKnee(data: OttawaKneeAssessment): {
    ageCriterion: boolean;
    isolatedPatellarCriterion: boolean;
    fibularHeadCriterion: boolean;
    flexionCriterion: boolean;
    weightBearingCriterion: boolean;
    xrayIndicated: boolean;
    decision: 'xray-indicated' | 'xray-not-indicated';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** ANY-of (logical OR), **not** additive. Each criterion resolves
  to a boolean; `xrayIndicated` is true when any one fires. See spec §4.
  - `ageYears >= 55` → age criterion
  - `patellarTenderness == 'yes' && otherBonyTenderness == 'no'` → isolated
    patellar criterion (isolation is required — patellar tenderness *with* other
    bony tenderness does **not** fire this criterion)
  - `fibularHeadTenderness == 'yes'` → fibular head criterion
  - `unableToFlex90 == 'yes'` → flexion criterion
  - `unableToBearWeight == 'yes'` → weight-bearing criterion
  - A missing input does not fire its criterion and raises a data-completeness
    flag.
- **Engine files:** `types.ts`, `utils.ts`, `ottawa-knee-rules.ts`,
  `ottawa-knee-grader.ts`, `flagged-issues.ts`.
- **Tests:** `ottawa-knee-grader.test.ts`, `ottawa-knee-rules.test.ts` — cover
  the age boundary (54/55), each single-criterion trigger in isolation, the
  isolated-vs-non-isolated patellar distinction, the all-absent negative case,
  and multi-criterion cases.

## Flagged issues

Computed independently of the decision (see spec §5): X-ray indicated
(`xrayIndicated`, high), unable to bear weight (`unableToBearWeight == 'yes'`,
high), other bony tenderness present (`otherBonyTenderness == 'yes'`, medium),
applicability caution (non-acute or missing time-since-injury, medium),
incomplete assessment (any criterion input missing, low).

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

- Stiell I.G. *et al.* Prospective validation of a decision rule for the use of
  radiography in acute knee injuries. *JAMA* 1996; 275(8):611–615.
- Stiell I.G. *et al.* Derivation of a decision rule for the use of radiography
  in acute knee injuries. *Ann Emerg Med* 1995; 26(4):405–413.
- Bachmann L.M. *et al.* The accuracy of the Ottawa knee rule to rule out knee
  fractures: a systematic review. *Ann Intern Med* 2004; 140(2):121–124.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form ottawa-knee-rule
```

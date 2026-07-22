# Patient-Reported Outcome Measures — Agent Instructions

A battery of 4 independent, validated PRO instruments (SF-36v2, NDI,
mJOA, EQ-5D-3L). Each is scored independently — there is no
cross-instrument composite. **The exact scoring algorithm for every
instrument is in [`spec/index.md`](./spec/index.md); implementations
in every stack (HTML, Svelte, Loco) MUST match it precisely** — do not
invent alternate coefficients, thresholds, or recoding rules.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/index.md` — items + exact scoring algorithms (authoritative)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard
- `./back-end-with-loco/` — Rust backend with a JSON API

## Data model

Named typed fields, NOT a generic item map — each instrument has a
small, fixed, well-known item set (unlike the checklist-family forms),
so this follows the same convention as `pre-anaesthesia-assessment`
(clinical scoring-engine forms use named per-item fields).

```ts
export interface VisitDetails {
  subjectId: string;
  visit: string;
  assessmentDate: string;
}

export interface Sf36Response {
  generalHealth: 1|2|3|4|5|null;
  healthChangeVsYearAgo: 1|2|3|4|5|null;
  vigorousActivities: 1|2|3|null; moderateActivities: 1|2|3|null;
  liftingCarryingGroceries: 1|2|3|null; climbingSeveralFlights: 1|2|3|null;
  climbingOneFlight: 1|2|3|null; bendingKneelingStooping: 1|2|3|null;
  walkingMoreThanMile: 1|2|3|null; walkingSeveralHundredYards: 1|2|3|null;
  walkingOneHundredYards: 1|2|3|null; bathingDressing: 1|2|3|null;
  cutDownTimePhysical: 1|2|3|4|5|null; accomplishedLessPhysical: 1|2|3|4|5|null;
  limitedInKindPhysical: 1|2|3|4|5|null; difficultyPerformingPhysical: 1|2|3|4|5|null;
  cutDownTimeEmotional: 1|2|3|4|5|null; accomplishedLessEmotional: 1|2|3|4|5|null;
  lessCarefulThanUsual: 1|2|3|4|5|null;
  socialActivitiesInterference: 1|2|3|4|5|null;
  bodilyPain: 1|2|3|4|5|6|null;
  painInterferenceWithWork: 1|2|3|4|5|null;
  feltFullOfLife: 1|2|3|4|5|null; veryNervous: 1|2|3|4|5|null;
  soDownInDumps: 1|2|3|4|5|null; feltCalmPeaceful: 1|2|3|4|5|null;
  lotOfEnergy: 1|2|3|4|5|null; downheartedDepressed: 1|2|3|4|5|null;
  feltWornOut: 1|2|3|4|5|null; beenHappy: 1|2|3|4|5|null; feltTired: 1|2|3|4|5|null;
  socialActivitiesInterferenceTime: 1|2|3|4|5|null;
  getSickEasier: 1|2|3|4|5|null; asHealthyAsAnybody: 1|2|3|4|5|null;
  expectHealthWorse: 1|2|3|4|5|null; healthExcellent: 1|2|3|4|5|null;
}

export interface NdiResponse {
  painIntensity: 0|1|2|3|4|5|null; personalCare: 0|1|2|3|4|5|null;
  lifting: 0|1|2|3|4|5|null; reading: 0|1|2|3|4|5|null;
  headache: 0|1|2|3|4|5|null; concentration: 0|1|2|3|4|5|null;
  work: 0|1|2|3|4|5|null; driving: 0|1|2|3|4|5|null;
  sleeping: 0|1|2|3|4|5|null; recreation: 0|1|2|3|4|5|null;
}

export interface MjoaResponse {
  motorArms: 0|1|2|3|4|null; motorLegs: 0|1|2|3|4|null;
  sensationArms: 0|1|2|null; sensationLegs: 0|1|2|null;
  sensationTrunk: 0|1|2|null; bladderFunction: 0|1|2|3|null;
}

export interface Eq5dResponse {
  mobility: 1|2|3|null; selfCare: 1|2|3|null; usualActivities: 1|2|3|null;
  painDiscomfort: 1|2|3|null; anxietyDepression: 1|2|3|null;
  vasScore: number|null; // 0-100
}

export interface PatientReportedOutcomeMeasures {
  visitDetails: VisitDetails;
  sf36: Sf36Response;
  ndi: NdiResponse;
  mjoa: MjoaResponse;
  eq5d: Eq5dResponse;
}
```

## Scoring engine

```ts
computeSf36(data: Sf36Response): {
  pf: number|null; rp: number|null; bp: number|null; gh: number|null;
  vt: number|null; sf: number|null; re: number|null; mh: number|null;
  pcsApprox: number|null; mcsApprox: number|null;
}
computeNdi(data: NdiResponse): { rawScore: number; answeredSections: number; percentageScore: number|null; band: 'no-disability'|'mild'|'moderate'|'severe'|'complete'|'' }
computeMjoa(data: MjoaResponse): { totalScore: number|null; band: 'mild'|'moderate'|'severe'|'' }
computeEq5d(data: Eq5dResponse): { healthStateDescriptor: string; ukIndexValue: number|null; vasScore: number|null }
```

All four are pure functions, no side effects. See
[`spec/index.md`](./spec/index.md) for the exact recode tables,
domain-to-item mappings, and band thresholds — **implement exactly as
documented there**, including the explicit note that SF-36
`pcsApprox`/`mcsApprox` are non-licensed simplified approximations,
not the trademarked QualityMetric norm-based PCS/MCS.

- **Engine files:** `types.ts`, `sf36-rules.ts`, `ndi-rules.ts`,
  `mjoa-rules.ts`, `eq5d-rules.ts`, `factory.ts`.
- **Tests:** one test file per instrument, each with at least: an
  all-best-answers case, an all-worst-answers case, and one
  partially-answered case. For EQ-5D specifically, test the "11111"
  state → index exactly 1.0, and at least one state with a level-3
  dimension to confirm the N3 term applies.

## Conventions

- `null` for unanswered items (all SF-36/NDI/mJOA/EQ-5D items are
  nullable numeric enums, not strings).
- `''` for unanswered text fields (subjectId, visit).
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components: `Step1VisitDetails.svelte`,
  `Step2Sf36GeneralHealth.svelte`, `Step3Sf36Activities.svelte`,
  `Step4Sf36RoleLimitations.svelte`, `Step5Sf36Remaining.svelte`,
  `Step6Ndi.svelte`, `Step7Mjoa.svelte`, `Step8Eq5d.svelte`,
  `Step9Summary.svelte` (9 steps, 1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## SQL shape

A single flat table `patient_reported_outcome_measures` (visit header
+ all 36+10+6+6 raw response columns = 58 nullable numeric/text
columns) plus a 1:1 `patient_reported_outcome_measures_score` table
holding the computed outputs (8 SF-36 domains + pcsApprox/mcsApprox,
NDI raw/percentage/band, mJOA total/band, EQ-5D descriptor/index/VAS)
— mirroring the `pre-anaesthesia-assessment` convention of a separate
raw-data table and a computed-grade table, since these are fixed,
well-known instruments (named columns), not an open-ended checklist.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Verify

```sh
bin/test-form patient-reported-outcome-measures
```

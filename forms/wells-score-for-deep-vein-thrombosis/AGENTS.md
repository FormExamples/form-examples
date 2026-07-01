# Wells Score for Deep Vein Thrombosis (DVT) — Agent Instructions

Bedside clinical prediction rule for the pre-test probability of a first
lower-limb DVT in adults. Collects nine clinical criteria via a single
continuous single-page wizard — each **+1** when present — plus a **−2**
adjustment when an alternative diagnosis is at least as likely as DVT, sums a
total of **−2 to 9**, and stratifies the patient: **≥ 2 → DVT likely** (proximal
leg vein ultrasound) versus **≤ 1 → DVT unlikely** (D-dimer). A three-level band
(low / moderate / high) is also computed for continuity with the original rule.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Wells 1997/2003, NICE NG158)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `WellsDvtAssessment` TypeScript type — the nine criterion
  inputs plus the alternative-diagnosis adjustment, context, and identification
  fields.
- **Output shape:**
  ```ts
  gradeWellsDvt(data: WellsDvtAssessment): {
    criterionPoints: Record<string, 0 | 1 | -2>;
    wellsScore: number;                       // -2..9
    twoLevelBand: 'likely' | 'unlikely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedInvestigation: 'proximal-leg-vein-ultrasound' | 'd-dimer';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the nine criteria contributes 0 or 1 when
  its value is `yes`; the alternative-diagnosis input subtracts 2. See spec §4.
  - `wellsScore = (sum of +1 for each 'yes' criterion) − (alternativeDiagnosisAsLikely == 'yes' ? 2 : 0)` → range −2..9
  - `twoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely'`
  - `threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'`
  - `recommendedInvestigation = twoLevelBand == 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer'`
  - A blank criterion contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-dvt-rules.ts`,
  `wells-dvt-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-dvt-grader.test.ts`, `wells-dvt-rules.test.ts` — cover the
  two-level boundary (1 vs 2), three-level boundaries (0/1, 2/3), the `−2`
  adjustment including a negative total, and the −2 / 9 extremes.

## Flagged issues

Computed independently of the total (see spec §5): DVT likely — image
(`wellsScore >= 2`, high), DVT unlikely — D-dimer (`wellsScore <= 1`, medium),
active cancer (`activeCancer == 'yes'`, high), previous DVT
(`previousDvt == 'yes'`, medium), incomplete assessment (any criterion blank,
low).

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

- Wells P.S. *et al.* Value of assessment of pretest probability of deep-vein
  thrombosis in clinical management. *Lancet* 1997; 350(9094):1795–1798.
- Wells P.S. *et al.* Evaluation of D-dimer in the diagnosis of suspected
  deep-vein thrombosis. *NEJM* 2003; 349(13):1227–1235.
- NICE NG158. *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form wells-score-for-deep-vein-thrombosis
```

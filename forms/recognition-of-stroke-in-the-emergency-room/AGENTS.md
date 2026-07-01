# Recognition Of Stroke In the Emergency Room (ROSIER) — Agent Instructions

Bedside stroke-recognition screen for adults presenting acutely to the emergency
department. Collects two mimic-exclusion criteria and five acute-onset
neurological signs via a single continuous single-page wizard — loss of
consciousness / syncope (−1), seizure activity (−1), asymmetric facial weakness
(+1), asymmetric arm weakness (+1), asymmetric leg weakness (+1), speech
disturbance (+1), visual field defect (+1) — sums a signed total of **−2 to +5**,
and flags **ROSIER > 0** as a positive screen (**stroke likely**) that activates
the acute stroke pathway. Blood glucose is measured first to exclude the
hypoglycaemia mimic.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Nor *et al.* 2005, NICE NG128)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `RosierAssessment` TypeScript type — the two mimic criteria,
  five neurological-sign inputs, the blood-glucose precondition, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradeRosier(data: RosierAssessment): {
    rosierScore: number;          // -2..+5
    band: 'stroke-unlikely' | 'stroke-likely';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** signed additive — each mimic contributes 0 or −1, each sign
  contributes 0 or +1; the total −2..+5 determines the band (`> 0` →
  `stroke-likely`). See spec §4. The `> 0` threshold is strict (exactly 0 is
  `stroke-unlikely`).
  - loss of consciousness / syncope = yes → −1
  - seizure activity = yes → −1
  - asymmetric facial weakness = yes → +1
  - asymmetric arm weakness = yes → +1
  - asymmetric leg weakness = yes → +1
  - speech disturbance = yes → +1
  - visual field defect = yes → +1
- **Engine files:** `types.ts`, `utils.ts`, `rosier-rules.ts`,
  `rosier-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rosier-grader.test.ts`, `rosier-rules.test.ts` — cover the `> 0`
  threshold boundary (total 0 vs +1), the extremes (−2 and +5), and the
  hypoglycaemia flag at glucose 3.4 / 3.5.

## Flagged issues

Computed independently of the total (see spec §5): activate stroke pathway
(`rosierScore > 0`, high), hypoglycaemia mimic (`bloodGlucose < 3.5`, high),
seizure / LOC caution (either mimic present, medium), clinical-suspicion
override (`rosierScore <= 0` with any focal sign present, medium), incomplete
assessment (glucose or any criterion missing, low).

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

- Nor A.M. *et al.* The Recognition of Stroke in the Emergency Room (ROSIER)
  scale. *Lancet Neurology* 2005; 4(11):727–734.
- NICE NG128. *Stroke and transient ischaemic attack in over 16s.*
- Royal College of Physicians. *National Clinical Guideline for Stroke* (2023).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form recognition-of-stroke-in-the-emergency-room
```

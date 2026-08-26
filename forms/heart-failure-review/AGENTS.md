# Heart Failure Annual Review — Agent Instructions

UK primary-care structured annual review for adults with established chronic
heart failure. Collects functional status, fluid balance, monitoring bloods, and
medication optimization via a single continuous single-page wizard, then derives
an **NYHA functional status**, a **medication-optimization status** against the
four pillars of guideline-directed medical therapy (ACEi/ARB/ARNI, beta-blocker,
MRA, SGLT2 inhibitor), a **review-completeness grade**, and a set of safety
flags. It is a documentation and status-classification form — it does not
diagnose heart failure.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG106, NYHA, QOF)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `HeartFailureReview` TypeScript type — context,
  identification, diagnosis, functional status, fluid status, investigations,
  four medication pillars, devices, vaccinations, and self-management fields.
- **Output shape:**
  ```ts
  gradeReview(data: HeartFailureReview): {
    functionalStatus: 'stable' | 'symptomatic' | 'advanced' | 'unknown';
    medicationOptimisation: {
      indicatedPillars: number;
      prescribedPillars: number;
      missingPillars: Pillar[];
      status: 'optimised' | 'partial' | 'suboptimal' | 'not-applicable';
    };
    reviewStatus: 'complete' | 'partial' | 'incomplete';
    completenessScore: number;   // 0..100
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm** (see spec §4):
  - `functionalStatus` maps NYHA class I–II → `stable`, III → `symptomatic`,
    IV → `advanced`, null → `unknown`.
  - `medicationOptimisation` counts prescribed vs indicated pillars; the
    indicated pillar set is 4 for HFrEF, 1 (SGLT2i) for HFmrEF/HFpEF, 0 for
    unknown type. A pillar documented `contraindicated` / `not-tolerated` counts
    as addressed.
  - `reviewStatus` / `completenessScore` grade the six required review domains
    (functional status, fluid status, monitoring bloods, medication review,
    vaccinations, self-management).
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover each NYHA
  class, each `heartFailureType`, the optimization-status transitions, the
  potassium (5.5 / 3.5) and eGFR (30) thresholds, and each completeness band.

## Flagged issues

Computed independently of the grades (see spec §5): urgent review
(`nyhaClass >= 3` or decompensation, high), optimization gap (indicated pillar
`not-prescribed` without contraindication; high for HFrEF with ≥ 2 missing),
hyperkalaemia (`potassium > 5.5`, high), hypokalaemia (`potassium < 3.5`,
medium), renal impairment (`egfr < 30`, high), fluid overload (weight gain
≥ 2 kg / oedema / raised JVP / crackles; high if NYHA III–IV), missing
monitoring bloods (on RAAS inhibitor or MRA but no recent potassium/eGFR,
medium), incomplete review (`reviewStatus != 'complete'`, low).

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

- NICE NG106. *Chronic heart failure in adults: diagnosis and management.*
- NICE QS9. *Chronic heart failure in adults.*
- The New York Heart Association (NYHA) Functional Classification.
- McDonagh T.A. *et al.* 2021 ESC Guidelines for heart failure. *Eur Heart J*
  2021; 42(36):3599–3726.
- NHS England *Quality and Outcomes Framework (QOF)* — heart-failure indicators.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form heart-failure-review
```

# Nursing Care Plan — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `nursing-care-plan`

## 1. Purpose

A structured nursing care plan following the nursing process (ADPIE) and the
Roper–Logan–Tierney activities-of-living model. It documents identified nursing
problems / needs, SMART goals, planned interventions, evaluation / review, and
the referenced risk assessments (falls, pressure ulcer, VTE, MUST). It is a
**documentation and completeness** form, not a numeric score: the engine grades
care-plan **completeness** (Complete / Partial / Incomplete) and raises flagged
issues.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, and replacing the
specialist risk-assessment tools it references.

## 3. Data model

A **parent care-plan record** with one-to-many **problem** children; each problem
has one-to-many **goal** and **intervention** children plus an inline evaluation.
Fields default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Parent — care plan.**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK, `gen_random_uuid()` |
| `nurseName` | text | authoring nurse |
| `nurseRole` | enum | registered-nurse / nursing-associate / student |
| `nmcNumber` | text | professional registration |
| `authoredAt` | timestamp | date and time |
| `careSetting` | enum | ward / community / care-home / hospice / other |
| `planType` | enum | admission / ongoing / discharge |
| `patientIdentifier` | text | local identifier |
| `patientName` | text | |
| `dateOfBirth` | date | |
| `sex` | enum | patient sex |
| `wardLocation` | text | ward / location |
| `handoverNote` | text | free-text summary |
| `fallsRisk`, `pressureUlcerRisk`, `vteRisk`, `nutritionRisk` | risk-assessment group | each: `done` (yes/no), `level` (low/medium/high), `assessedOn` (date), `actioned` (yes/no) |

**Child — problem** (`nursing_care_plan_problem`, FK `care_plan_id`).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `problemStatement` | text | the identified need |
| `adlCategory` | enum | RLT activity of living (e.g. breathing, eating-drinking, mobilising, elimination, hygiene, communication) |
| `actualOrPotential` | enum | actual / potential |
| `assessmentData` | text | supporting observation |
| `linkedRisk` | enum | none / falls / pressure-ulcer / vte / nutrition |
| `evaluationNote` | text | E of ADPIE (inline) |
| `goalMet` | enum | met / partially-met / not-met / not-evaluated |
| `nextReviewDate` | date | |

**Child — goal** (`nursing_care_plan_goal`, FK `problem_id`).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `goalText` | text | SMART goal |
| `targetDate` | date | target / review date |
| `met` | enum | met / partially-met / not-met / not-evaluated |

**Child — intervention** (`nursing_care_plan_intervention`, FK `problem_id`).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `interventionText` | text | planned nursing action |
| `carriedOut` | enum | yes / no / partial |

All tables carry `created_at`, `updated_at`, `deleted_at`.

**Derived (never stored as input).** Per problem: `completenessClass`. Per plan:
`status`, `completenessPercent`, `firedRules[]`, `flags[]`.

## 4. Completeness algorithm

Pure function, no I/O. `validate(plan)` grades each problem, then the plan.

**Per problem.** Let `hasGoal = goals.length > 0`, `hasIntervention =
interventions.length > 0`, `hasEvaluation = evaluationNote != '' || goalMet !=
'not-evaluated'`.

```
completenessClass =
  hasGoal && hasIntervention && hasEvaluation ? 'complete'
  : (hasGoal || hasIntervention || hasEvaluation) ? 'partial'
  : 'incomplete'
```

**Per plan.**

```
status =
  problems.length == 0                              ? 'incomplete'
  : every problem 'complete' && no high-priority flag ? 'complete'
  : every problem 'incomplete'                       ? 'incomplete'
  : 'partial'
```

**Completeness percent.** Three required elements per problem (goal,
intervention, evaluation):

```
present  = sum over problems of (hasGoal + hasIntervention + hasEvaluation)
required = problems.length * 3
completenessPercent = required == 0 ? 0 : round(100 * present / required)
```

## 5. Flagged issues

Emitted independently of the status, each with a priority:

- **Risk without intervention** (high) — a risk group with `done == 'yes'` and
  `level == 'high'` that has no problem whose `linkedRisk` matches **and** that
  problem carries an intervention.
- **High-risk assessment not actioned** (high) — a risk group `done == 'yes'`,
  `level == 'high'`, `actioned == 'no'`.
- **Missing evaluation** (medium) — a problem with `hasGoal && hasIntervention`
  but no evaluation.
- **Unmet goal overdue for review** (medium) — a goal `met == 'not-met'` (or
  problem `goalMet == 'not-met'`) whose `targetDate` / `nextReviewDate` is before
  today.
- **No review date** (medium) — a problem with `nextReviewDate == null`.
- **Incomplete problem** (low) — a problem whose `completenessClass ==
  'incomplete'`.

## 6. Inputs and outputs

**Input.** A typed care-plan object whose shape mirrors the SQL schema in `sql/`
(parent plan + arrays of problems, each with arrays of goals and interventions).
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
validate(plan: CarePlan): {
  status: 'complete' | 'partial' | 'incomplete';
  completenessPercent: number;      // 0..100
  problemClasses: Array<{ problemId: string;
                          completenessClass: 'complete' | 'partial' | 'incomplete' }>;
  firedRules: FiredRule[];
  flags: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle (CarePlan +
Goal + Condition/nursing-diagnosis), XML, JSON, CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form nursing-care-plan` exits cleanly.
- The completeness engine is pure (no side effects, no I/O) and unit-tested,
  covering each problem class (complete / partial / incomplete), each plan status,
  the percent calculation (including the empty-plan zero case), and every flag.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. This form is a documentation / completeness aid and
sits at the low-risk end of clinical decision support; form-specific
classification is recorded in [`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md).

## 10. References

- [`index.md`](../index.md) — form description and completeness model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form nursing-care-plan
```

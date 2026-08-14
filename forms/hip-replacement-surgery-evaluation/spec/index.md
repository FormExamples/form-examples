# Hip Replacement Surgery Evaluation — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and
Rust back-end) must satisfy. Treat it as the source of truth for behaviour —
update the spec before changing code.

Slug: `hip-replacement-surgery-evaluation`

## 1. Purpose

A hip-replacement surgery evaluation is the orthopaedic assessment used to
determine whether a patient is a suitable candidate for total hip arthroplasty,
performed by an orthopaedic surgeon or extended-scope physiotherapist in a
joint-replacement clinic. It quantifies hip pain and functional decline with
the Oxford Hip Score (OHS), reviews the physical examination and imaging
findings, audits which conservative measures have been tried, and produces a
surgical-candidacy recommendation together with a set of safety flags.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the scoring engine, the two front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust JSON-API crate listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
theatre scheduling, and implant selection. Paediatric assessment is out of
scope: the Oxford Hip Score is not validated below 16 years, so the engine
raises a `paediatric` flag rather than scoring.

### What this form is not

It is **not** another ASA-grading pre-operative assessment. The monorepo
already has three of those
([`pre-operative-assessment-by-clinician`](../../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../../pre-anaesthesia-assessment)), plus a
dedicated fitness-for-surgery form,
[`perioperative-optimization`](../../perioperative-optimization). This form
does not compute an ASA grade and must not grow one. Its question is *does
this patient's hip disease and functional decline justify replacement
surgery, and have conservative options been exhausted?* — not *how risky is
this patient under anaesthesia?* Step 11 records only a brief general-fitness
screening note; if a change would make this form answer the anaesthetic-risk
question instead, it belongs in one of the siblings above.

## 3. Scoring system

**Primary instrument — Oxford Hip Score (OHS), 0–48.**

The OHS is the validated 12-item patient-reported outcome measure for hip
osteoarthritis (Dawson et al., *J Bone Joint Surg Br* 1996). Each item is
scored 0 (worst) to 4 (best); the total is the sum of the 12 items, 0–48,
where 48 is the best possible outcome.

| # | Item | Concept |
| --- | --- | --- |
| 1 | Pain severity | Usual hip pain severity |
| 2 | Washing and drying | Difficulty washing and drying yourself |
| 3 | Transport | Difficulty getting in/out of a car, or using public transport |
| 4 | Dressing (socks) | Difficulty putting on socks or stockings |
| 5 | Shopping | Ability to do the household shopping alone |
| 6 | Walking pain | Pain experienced walking |
| 7 | Limping | Limping when walking |
| 8 | Kneeling | Difficulty kneeling and getting up again |
| 9 | Night pain | How often hip pain troubles you in bed at night |
| 10 | Work interference | How much hip pain interferes with usual work |
| 11 | Giving way | How often the hip feels like it might give way |
| 12 | Stairs | Ability to walk down a flight of stairs |

OHS category — **this form's operational convention** (a published banding is
attributed to the OHS by secondary sources with minor variation; this repo
uses the following four bands and documents them here rather than inventing an
undocumented threshold):

| Band | OHS total |
| --- | --- |
| `severe` | 0–19 |
| `moderate` | 20–29 |
| `mild-to-moderate` | 30–39 |
| `satisfactory` | 40–48 |

**Radiographic grading — Kellgren and Lawrence (KL), 0–4.** Standard
radiographic osteoarthritis grade (Kellgren & Lawrence, *Ann Rheum Dis* 1957):
0 none, 1 doubtful, 2 minimal, 3 moderate, 4 severe.

**Surgical-candidacy recommendation**, computed from the OHS total, the KL
grade, and whether conservative measures are exhausted:

| Candidacy | Condition |
| --- | --- |
| `strong-candidate` | OHS ≤ 19 **and** KL ≥ 3 **and** conservative measures exhausted |
| `candidate` | OHS ≤ 29 **and** KL ≥ 2 **and** conservative measures exhausted |
| `continue-conservative` | conservative measures **not** exhausted, regardless of OHS or KL |
| `not-indicated` | OHS ≥ 40 **or** KL ≤ 1 |
| `mdt-review` | fallback for a mixed or borderline picture that matches none of the above |

Rule evaluation order: `continue-conservative` is checked first (conservative
measures not exhausted overrides everything else), then `not-indicated`, then
`strong-candidate`, then `candidate`, then `mdt-review` as the fallback.

## 4. Inputs and outputs

**Inputs.** A typed evaluation object whose shape mirrors the SQL schema in
[`../sql/`](../sql/) (7 migration files). Unanswered text and enum fields
default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the OHS total and
category, the computed and final surgical-candidacy recommendation,
`firedRules[]`, `additionalFlags[]`, and a clinical report. Rendered as HTML in
the browser, exported as PDF via the SvelteKit endpoint, and convertible to
FHIR R5 Bundle, XML, JSON, CSV, or TSV.

```ts
calculateHipEvaluation(data: HipReplacementSurgeryEvaluation): {
  ohsTotal: number;                    // 0..48
  ohsCategory: OhsCategory;            // 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory'
  kellgrenLawrenceGrade: number | null; // 0..4
  computedCandidacy: Candidacy;
  finalCandidacy: Candidacy;
  overrideReason: string;
  firedRules: FiredRule[];
  flags: AdditionalFlag[];
}
```

## 5. Artefacts

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
| `examples` | filled-form JSON fixture + FHIR R5 Bundle |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup
script) are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Data model

Seven migrations under [`../sql/`](../sql/):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | demographics + anthropometrics |
| `03_create_table_clinician.sql` | `clinician` | clinician identity + registration |
| `04_create_table_hip_replacement_surgery_evaluation.sql` | `hip_replacement_surgery_evaluation` | the 15-step wizard payload |
| `05_create_table_hip_replacement_surgery_evaluation_grade.sql` | `hip_replacement_surgery_evaluation_grade` | computed + final OHS and candidacy, one per evaluation |
| `06_create_table_hip_replacement_surgery_evaluation_grade_flag.sql` | `hip_replacement_surgery_evaluation_grade_flag` | safety flags with priority and action |

## 7. Wizard steps

Fifteen steps, completed in order on a single continuous single-page wizard.
See [`index.md`](../index.md) for the full field-level table.

| # | Step |
| --- | --- |
| 1 | Clinician identification |
| 2 | Patient identification |
| 3 | Presenting history |
| 4 | Oxford Hip Score (12 items) |
| 5 | Functional limitations |
| 6 | Physical examination — gait and biomechanical |
| 7 | Physical examination — range of motion |
| 8 | Physical examination — stability and muscle strength |
| 9 | Diagnostic imaging |
| 10 | Conservative treatment audit |
| 11 | General health and surgical fitness screen |
| 12 | Pre-operative baseline bloods and tests |
| 13 | Shared decision-making |
| 14 | Management plan and recommendation |
| 15 | Summary and sign-off |

## 8. Safety flags

Computed independently of the candidacy recommendation and never suppressed by
a clinician override. Priority: high / medium / low.

| Category | Priority | Fires when |
| --- | --- | --- |
| `conservative-treatment-not-exhausted` | medium | conservative measures not exhausted |
| `high-bmi-surgical-risk` | medium | patient BMI ≥ 40 |
| `pre-op-bloods-incomplete` | medium | one or more of full blood count, renal function, clotting/INR, ECG, MRSA screen, urinalysis not done |
| `leg-length-discrepancy-significant` | medium | measured leg-length discrepancy > 2cm |
| `trendelenburg-positive` | low | Trendelenburg sign positive (abductor weakness, relevant to surgical planning) |
| `bilateral-symptomatic` | low | affected side recorded as bilateral |
| `paediatric` | standard | age < 16 years — OHS is not validated below 16 |
| `other` | — | free-text clinician-raised concern |

## 9. Acceptance criteria

- `bin/test-form hip-replacement-surgery-evaluation` exits cleanly.
- `bin/test-sql-apply hip-replacement-surgery-evaluation` applies every
  migration in order to a fresh scratch Postgres database.
- `bin/test-examples-conformance hip-replacement-surgery-evaluation` reports
  no drift between `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O) and unit-tested; every
  candidacy-band threshold (OHS 19/20, 29/30, 39/40; KL 1/2, 2/3) has explicit
  boundary tests on both sides.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check hip-replacement-surgery-evaluation` and
  `bin/lily-svelte-refactor --check hip-replacement-surgery-evaluation` report
  no drift.
- The wizard is one continuous single page — no multi-page navigation.
- Safety flags are never filtered by the clinician's candidacy override.
- LocalStorage keys preserve draft state across reloads:
  - `hip-replacement-surgery-evaluation.front-end-with-html.v1` (HTML)
  - `hip-replacement-surgery-evaluation.front-end-with-svelte.<id>.v1` (SvelteKit)

## 10. Clinical grounding and references

- Dawson J, Fitzpatrick R, Carr A, Murray D. *Questionnaire on the perceptions
  of patients about total hip replacement.* J Bone Joint Surg Br.
  1996;78(2):185–190. (Oxford Hip Score.)
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.* Ann
  Rheum Dis. 1957;16(4):494–502.
- NHS Getting It Right First Time (GIRFT). *Orthopaedics: national report
  and elective orthopaedics implementation guide.*
  <https://gettingitrightfirsttime.co.uk/>
- NHS. *Hip replacement: when it's recommended.*
  <https://111.wales.nhs.uk/encyclopaedia/h/article/hipreplacement>
- Oxford University Innovation. *Oxford Hip Score (OHS).*
  <https://innovation.ox.ac.uk/outcome-measures/oxford-hip-score-ohs/>
- National Joint Registry (NJR) annual reports, England, Wales, Northern
  Ireland and the Isle of Man.

## 11. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. This form is decision support: it computes a
validated outcome score and surfaces flags, but does not diagnose and does not
replace the clinical judgement of the orthopaedic surgeon or extended-scope
physiotherapist.

## 12. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`doc/index.md`](../doc/index.md) — clinical reference documentation
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 13. Verify

```sh
bin/test-form hip-replacement-surgery-evaluation
```

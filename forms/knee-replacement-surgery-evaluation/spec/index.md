# Knee Replacement Surgery Evaluation — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and
Rust back-end) must satisfy. Treat it as the source of truth for behaviour —
update the spec before changing code.

Slug: `knee-replacement-surgery-evaluation`

## 1. Purpose

A knee-replacement surgery evaluation is the orthopaedic assessment used to
determine whether a patient is a suitable candidate for total or partial knee
arthroplasty. It is performed by an orthopaedic surgeon or an extended-scope
physiotherapist in a joint-replacement clinic. It records the presenting
history, the Oxford Knee Score (OKS), the physical examination, diagnostic
imaging, and an audit of conservative treatment already tried, then computes an
OKS total and category, a surgical-candidacy recommendation, and a set of
safety flags.

The central question this form answers is: **does this patient's knee disease
and functional decline justify replacement surgery, and have conservative
options been exhausted?**

Full design description: [`../index.md`](../index.md).

## 2. Scope

In scope: the schema, the scoring engine, the two front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust JSON-API crate listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
theatre-list booking, and post-operative follow-up. Paediatric patients are out
of scope: the Oxford Knee Score is not validated below 16 years, so the engine
raises a `paediatric` flag rather than scoring.

### What this form is not

It is **not** another ASA-grading pre-operative assessment. The monorepo
already has three of those
([`pre-operative-assessment-by-clinician`](../../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../../pre-anaesthesia-assessment)). This form
does not compute an ASA grade and must not grow one. Its question is *does
this patient's knee disease justify replacement surgery, and have conservative
options been exhausted?* — not *how risky is this patient under anaesthesia?*.
Step 11 (general health & surgical fitness screen) therefore deliberately stays
high-level: it flags obvious concerns (uncontrolled diabetes, cardiac disease,
bleeding disorder, high BMI, smoking) so the surgical-candidacy recommendation
is not made in ignorance of them, but it does not grade ASA physical status,
does not compute an anaesthesia plan, and does not replace a formal pre-
operative assessment. If a change would make this form answer "how risky is
this patient under anaesthesia?" instead of "is this knee bad enough, and has
conservative treatment failed?", it belongs in one of the ASA-grading siblings,
not here. This form is also distinct from the sibling
[`hip-replacement-surgery-evaluation`](../../hip-replacement-surgery-evaluation),
which asks the identical question for the hip joint using the Oxford Hip Score;
the two forms are twins by design and share structure, not content.

## 3. Scoring system

**Primary instrument — Oxford Knee Score (OKS).**

The Oxford Knee Score (Dawson et al., *J Bone Joint Surg Br* 1998) is a
12-item, patient-reported outcome measure completed for the affected knee.
Each item is scored 0 (worst) to 4 (best) by the clinician from the patient's
answers during the consultation. The total ranges 0–48, where **48 is the
best possible outcome** (least symptomatic) and **0 is the worst**.

| # | Item | SQL column | 0 (worst) | 4 (best) |
| --- | --- | --- | --- | --- |
| 1 | Usual knee pain severity | `oks_pain_severity` | Severe, always | None |
| 2 | Washing and drying difficulty | `oks_washing_and_drying` | Impossible | No difficulty |
| 3 | Getting in/out of a car or public transport | `oks_transport` | Impossible | No difficulty |
| 4 | Walking distance before severe pain | `oks_walking_distance` | < 5 minutes / housebound | No pain, unlimited |
| 5 | Pain sitting or lying | `oks_pain_sitting_or_lying` | Severe, always | None |
| 6 | Limping when walking | `oks_limping` | Severe, most of the time | Never / rarely |
| 7 | Kneeling difficulty | `oks_kneeling` | Impossible | No difficulty |
| 8 | Night pain frequency | `oks_night_pain_frequency` | Every night | Never |
| 9 | Pain interfering with usual work | `oks_pain_interfering_with_work` | All the time | Not at all |
| 10 | Feeling the knee might "give way" | `oks_giving_way` | All the time | Never |
| 11 | Ability to do household shopping alone | `oks_shopping` | Impossible | No difficulty |
| 12 | Ability to walk down a flight of stairs | `oks_stairs` | Impossible | No difficulty |

**OKS category** (this form's operational banding; verify against a source
paper if a stricter published convention is required for a given deployment):

| Band | OKS total |
| --- | --- |
| `severe` | 0–19 |
| `moderate` | 20–29 |
| `mild-to-moderate` | 30–39 |
| `satisfactory` | 40–48 |

**Secondary instrument — Kellgren–Lawrence radiographic grade (0–4)** scored
per compartment (medial, lateral, patellofemoral) from the weight-bearing
X-ray (Kellgren & Lawrence, *Ann Rheum Dis* 1957).

**Computed surgical candidacy**, evaluated in this order (first match wins):

1. `strong-candidate` — OKS total ≤ 19 **and** Kellgren–Lawrence grade ≥ 3 in
   any compartment **and** conservative measures exhausted.
2. `candidate` — OKS total ≤ 29 **and** conservative measures exhausted
   **and** Kellgren–Lawrence grade ≥ 2 in any compartment.
3. `continue-conservative` — conservative measures **not** exhausted,
   regardless of OKS or Kellgren–Lawrence grade.
4. `not-indicated` — OKS total ≥ 40, **or** Kellgren–Lawrence grade ≤ 1 in
   every compartment.
5. `mdt-review` — fallback for a mixed or borderline picture that satisfies
   none of the above (for example a high-severity OKS with a low Kellgren–
   Lawrence grade, or a general-health concern flagged in step 11).

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in
[`../sql/`](../sql/) (7 migration files). Unanswered text and enum fields
default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the 12 OKS item scores,
`oksTotal`, `computedOksCategory`, `finalOksCategory`, `computedCandidacy`,
`finalCandidacy`, `overrideReason`, `firedRules[]`, `flags[]`, and a clinical
report. Rendered as HTML in the browser, exported as PDF via the SvelteKit
endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

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
| `02_create_table_patient.sql` | `patient` | demographics + BMI |
| `03_create_table_clinician.sql` | `clinician` | surgeon / ESP identity + registration |
| `04_create_table_knee_replacement_surgery_evaluation.sql` | `knee_replacement_surgery_evaluation` | the 15-step wizard payload |
| `05_create_table_knee_replacement_surgery_evaluation_grade.sql` | `knee_replacement_surgery_evaluation_grade` | computed + final OKS/candidacy, one per evaluation |
| `06_create_table_knee_replacement_surgery_evaluation_grade_flag.sql` | `knee_replacement_surgery_evaluation_grade_flag` | safety flags with priority and action |

## 7. Wizard steps

Completed in order on a single continuous single-page wizard (see
[`../index.md`](../index.md) for the full field-by-field table).

| # | Step |
| --- | --- |
| 1 | Clinician identification |
| 2 | Patient identification |
| 3 | Presenting history |
| 4 | Oxford Knee Score (12 items) |
| 5 | Functional limitations |
| 6 | Physical examination — range of motion |
| 7 | Physical examination — stability & alignment |
| 8 | Physical examination — muscle strength & effusion |
| 9 | Diagnostic imaging |
| 10 | Conservative treatment audit |
| 11 | General health & surgical fitness screen |
| 12 | Pre-operative baseline bloods/tests |
| 13 | Shared decision-making |
| 14 | Management plan & recommendation |
| 15 | Summary & sign-off |

## 8. Safety flags

Computed independently of the OKS score and the clinician override; never
suppressed. Priority: high / medium / low.

| Category | Priority | Fires when |
| --- | --- | --- |
| `conservative-treatment-not-exhausted` | medium | A surgical recommendation (total or partial knee replacement) is made while `conservative_measures_exhausted` is not `yes`. |
| `high-bmi-surgical-risk` | medium | Patient BMI ≥ 40. |
| `pre-op-bloods-incomplete` | medium | A surgical recommendation is made while any of the step-12 checklist items (FBC, renal function, clotting, ECG, MRSA screen, urinalysis) is not `yes`. |
| `fixed-flexion-deformity` | medium | Fixed flexion deformity > 15°, affecting surgical planning. |
| `bilateral-symptomatic` | low | Both knees are significantly symptomatic (`knee_side` is `bilateral`); a staging decision is needed. |
| `paediatric` | high | Age < 16 years — the Oxford Knee Score is not validated below 16. |

## 9. Acceptance criteria

- `bin/test-form knee-replacement-surgery-evaluation` exits cleanly.
- `bin/test-sql-apply knee-replacement-surgery-evaluation` applies every
  migration in order to a fresh scratch Postgres database.
- `bin/test-examples-conformance knee-replacement-surgery-evaluation` reports
  no drift between `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O) and unit-tested; the
  OKS category boundaries (19/20, 29/30, 39/40) and the candidacy precedence
  order have explicit boundary tests.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check knee-replacement-surgery-evaluation` and
  `bin/lily-svelte-refactor --check knee-replacement-surgery-evaluation`
  report no drift.
- The wizard is one continuous single page — no multi-page navigation.
- Safety flags are never suppressed by the clinician's candidacy override.

## 10. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. This form is decision support: it computes a validated
patient-reported outcome measure and surfaces flags, but does not diagnose and
does not replace the clinical judgement of the orthopaedic surgeon or
extended-scope physiotherapist.

## 11. Clinical grounding and references

- Dawson J, Fitzpatrick R, Murray D, Carr A. *Questionnaire on the perceptions
  of patients about total knee replacement.* Journal of Bone and Joint Surgery
  (Br) 1998;80-B(1):63–9. — the Oxford Knee Score.
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.*
  Annals of the Rheumatic Diseases 1957;16(4):494–502. — radiographic grading.
- NHS. *Knee replacement.*
  <https://www.nhs.uk/tests-and-treatments/knee-replacement/>
- NHS inform (Scotland). *Knee replacement.*
  <https://www.nhsinform.scot/tests-and-treatments/surgical-procedures/knee-replacement/>
- NICE. *Joint replacement (primary): hip, knee and shoulder* (NG157).
  <https://www.nice.org.uk/guidance/ng157>
- Nuffield Health. *Knee replacement.*
  <https://www.nuffieldhealth.com/treatments/knee-replacement>
- Orthoinfo (AAOS). *Preparing for joint replacement surgery.*
  <https://www.orthoinfo.org/treatment/preparing-for-joint-replacement-surgery/>

## 12. References

- [`../index.md`](../index.md) — form description and scoring details
- [`../AGENTS.md`](../AGENTS.md) — agent instructions
- [`../plan.md`](../plan.md) — implementation roadmap
- [`../tasks.md`](../tasks.md) — task tracking
- [`../doc/index.md`](../doc/index.md) — clinical reference documentation
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract
- [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 13. Verify

```sh
bin/test-form knee-replacement-surgery-evaluation
```

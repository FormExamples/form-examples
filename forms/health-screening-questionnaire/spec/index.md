# Health Screening Questionnaire — specification

This file is the **living domain spec** for this form. It captures the
contract each implementation (SQL schema, generated representations,
front-ends, and Rust back-end) must satisfy. Treat it as the source of truth
for behaviour — update the spec before changing code.

Slug: `health-screening-questionnaire`

## 1. Purpose

A generic, purpose-flexible baseline health and lifestyle screen used by
employers, gyms and fitness professionals, and primary-care / preventive-health
services to establish a person's medical history, uncover hidden risk factors,
and flag whether they need further medical review before starting an activity
(an exercise programme, a new job role) or as a routine wellness check.

Unlike the monorepo's condition-specific assessments, this form does not
diagnose a single condition — it screens broadly across cardiac readiness,
alcohol use, and general medical/lifestyle risk, and routes to further review
when indicated. It wraps two real validated instruments — **PAR-Q+** for
physical-activity readiness and **AUDIT-C** for alcohol use — inside a wider
occupational/wellness screening questionnaire.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the scoring engine, the two front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust JSON-API crate listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
diagnosis of any single condition, and automated onward referral booking. The
form is a screen, not an assessment — a positive finding routes the person to
the appropriate condition-specific form or clinical review rather than being
worked up further here.

**Deliberate PAR-Q+ scope simplification.** The real PAR-Q+ instrument
branches: any "yes" on the 7 general health questions unlocks a set of
condition-specific supplementary questionnaires (one page per condition —
cardiovascular, respiratory, musculoskeletal, and so on) that a qualified
exercise professional works through with the person before clearing them for
supervised activity. This form implements the 7-item general health screen
faithfully, but does **not** reproduce the condition-specific supplementary
questionnaires. Instead, any "yes" answer sets a single simplified follow-up
flag — `further-assessment-required` — and the report directs the person to a
qualified exercise professional or their GP for the full PAR-Q+ follow-up
before starting. This keeps the wizard a single generic screen rather than a
branching library of condition-specific sub-forms, which is out of scope for
this monorepo's screening-form family.

### 2.1 Differentiation from `patient-intake`

The monorepo already has [`patient-intake`](../../patient-intake), a general
patient intake form collecting demographics, insurance, medical history,
medications, allergies, and a review of systems, with a simple Low/Medium/High
risk stratification. The two forms are complementary, not duplicates:

| | `patient-intake` | `health-screening-questionnaire` |
| --- | --- | --- |
| Purpose | register a patient and capture administrative + clinical intake | screen a person's baseline health and readiness for activity or role |
| Instrument | none named — a general risk-level stratification | PAR-Q+ (physical-activity readiness) + AUDIT-C (alcohol) |
| Output | risk level (administrative triage) | PAR-Q+ clearance status, AUDIT-C band, composite risk band, referral recommendation |
| Setting | any clinical registration point | employer occupational health, gym/fitness, primary-care preventive-health |
| Users | any registration/clinical staff | assessors — who may not be clinicians at all (gym instructors, HR officers) |

Where `patient-intake` is about *getting someone into the system*, this form
is about *deciding whether it is safe for someone to proceed* with an
activity, role, or routine wellness pathway, using two named, validated
screening instruments.

## 3. Scoring system

### 3.1 PAR-Q+ (Physical Activity Readiness Questionnaire for Everyone)

The 2011 revision (PAR-Q+ Collaboration / CSEP), 7 general health questions,
each yes/no:

| # | Question |
| --- | --- |
| 1 | Has a doctor ever diagnosed you with a heart condition? |
| 2 | Do you feel pain in your chest at rest? |
| 3 | Do you feel pain in your chest during, or caused by, physical activity in the last month? |
| 4 | Do you lose balance because of dizziness, or have you lost consciousness in the last 12 months? |
| 5 | Have you been diagnosed with another chronic medical condition (other than heart disease or high blood pressure)? |
| 6 | Are you currently taking prescribed medication for a chronic medical condition? |
| 7 | Do you have a bone, joint, or soft-tissue problem that could be made worse by becoming more physically active? |

**Clearance rule.** All 7 items "no" → `cleared` for general physical
activity. Any "yes" → `further-assessment-required` (see §2's deliberate
scope simplification — this form raises a single follow-up flag rather than
branching into PAR-Q+'s condition-specific supplementary questionnaires).

### 3.2 AUDIT-C (Alcohol Use Disorders Identification Test — Consumption)

The same 3-item structure and scoring already used elsewhere in this
monorepo — see
[`forms/alcohol-use-disorders-identification-test-consumption/`](../../alcohol-use-disorders-identification-test-consumption)
and the alcohol domain in
[`forms/perioperative-optimization/front-end-with-svelte/src/lib/engine/domain-rules.ts`](../../perioperative-optimization/front-end-with-svelte/src/lib/engine/domain-rules.ts).

| # | Item | Range |
| --- | --- | --- |
| 1 | Frequency of drinking | 0–4 |
| 2 | Typical quantity per drinking day | 0–4 |
| 3 | Frequency of six-or-more (binge) drinking | 0–4 |

`auditCScore` = sum of the three items, 0–12 (`null` if all three are
unanswered).

**Band thresholds** (identical to `perioperative-optimization`):

| Band | Rule |
| --- | --- |
| `low` | below the at-risk threshold |
| `increasing-risk` | score ≥ 5 (men) or ≥ 4 (women) |
| `higher-risk` | score ≥ 8 (either sex) |

### 3.3 Composite risk band

`calculateHealthScreening()` computes a `computedRiskBand` by max-grade — the
worst finding wins:

| Band | Fires when |
| --- | --- |
| `refer-urgently` | unexplained chest pain **or** fainting/loss-of-consciousness reported in the step 7 symptom review — these need same-day medical attention, not a routine screening pathway |
| `high` | any red-flag symptom from step 7 present, **or** AUDIT-C `higher-risk`, **or** family history of a premature cardiac event combined with a current chronic condition |
| `moderate` | PAR-Q+ requires further assessment, **or** AUDIT-C `increasing-risk`, **or** any single chronic condition present without a red-flag symptom |
| `low` | default — PAR-Q+ cleared, no red-flag symptoms, AUDIT-C `low` |

Paediatric respondents (age < 16) are routed to a `paediatric` flag and a
paediatric pathway instead of being scored — PAR-Q+ and AUDIT-C are both adult
instruments.

## 4. Inputs and outputs

**Inputs.** A typed `HealthScreeningQuestionnaire` object whose shape mirrors
the SQL schema in [`../sql/`](../sql/). Unanswered text and enum fields
default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A `GradingResult` emitted by the engine: `parqPlusClearance`,
`auditCScore`, `auditCBand`, `computedRiskBand`, `finalRiskBand`,
`computedRecommendation`, `finalRecommendation`, `overrideReason`,
`firedRules[]`, `flags[]`. Rendered as HTML in the browser, exported as PDF via
the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or
TSV.

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

Six migrations under [`../sql/`](../sql/):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | the screened person's identity and emergency contact |
| `03_create_table_assessor.sql` | `assessor` | the person conducting the screen — see §6.1 |
| `04_create_table_health_screening_questionnaire.sql` | `health_screening_questionnaire` | the 13-step wizard payload |
| `05_create_table_health_screening_questionnaire_grade.sql` | `health_screening_questionnaire_grade` | computed + final risk band, PAR-Q+ clearance, AUDIT-C score/band, one per questionnaire |
| `06_create_table_health_screening_questionnaire_grade_flag.sql` | `health_screening_questionnaire_grade_flag` | safety flags with priority and suggested action |

### 6.1 `assessor`, not `clinician`

Every other form in this monorepo that names the person conducting an
assessment uses a clinical table name (`dietitian`, `clinician`). This form's
whole premise is that the person conducting the screen is often **not** a
clinician — it may be a gym instructor, a personal trainer, an HR officer, or
an occupational-health nurse, alongside GPs and practice nurses in the
routine-public-health setting. `clinician` would misdescribe the majority of
this form's real users, so the table (and TypeScript section) is named
`assessor`, with a `role` enumeration wide enough to cover both clinical and
non-clinical operators.

## 7. Wizard steps

Fourteen steps, completed in order on a single continuous single-page wizard:

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | screening purpose, assessor name/role, site, assessment date, assessment mode |
| 2 | Personal details | name, DOB, sex, NHS-or-employee number, emergency contact |
| 3 | Lifestyle — activity & diet | usual activity level, moderate-exercise days/week, fruit & vegetable portions/day, diet notes |
| 4 | Lifestyle — smoking & alcohol | smoking status, cigarettes/day, AUDIT-C 3 items |
| 5 | Medical history | chronic-conditions checklist, past surgeries, current medications, known drug allergies |
| 6 | Family history | premature cardiac event < 60y in a first-degree relative, other hereditary conditions |
| 7 | Symptom review | chest pain, dizzy spells/fainting, persistent cough > 3 weeks, unexplained weight loss, joint pain, breathlessness on exertion, palpitations |
| 8 | PAR-Q+ general health screen | the 7 items in §3.1 |
| 9 | Vital signs / basic measurements | height, weight, BMI (auto), resting blood pressure, resting heart rate — all optional |
| 10 | Occupational/role-specific factors | shown only when screening purpose is `occupational-pre-placement`: job role, physical demands, exposure risks |
| 11 | Mental health & wellbeing check | stress level 0–4, sleep quality 0–4, current concern y/n + note — light-touch only |
| 12 | Vaccination status | up to date y/n/unsure, notable gaps |
| 13 | Consent & data | consent to screening, information-accurate confirmation, interpreter required |
| 14 | Summary & recommendation | computed risk band, PAR-Q+ clearance, AUDIT-C band, referral recommendation, assessor override + reason, notes, electronic signature |

Step 10 renders conditionally: it is shown only when step 1's
`screeningPurpose` is `occupational-pre-placement`, mirroring the pattern used
by `perioperative-optimization`'s CPET fields (conditional on
`cpetPerformed`).

## 8. Safety flags

Computed independently of the risk band and never suppressed by an assessor
override. Priority: high / medium / low.

| Category | Priority | Fires when |
| --- | --- | --- |
| `urgent-cardiac-symptom` | high | unexplained chest pain or fainting/loss-of-consciousness reported in step 7 |
| `alcohol-higher-risk` | high | AUDIT-C ≥ 8 |
| `parq-positive-medical-clearance-needed` | medium | any PAR-Q+ item is "yes" |
| `family-history-premature-cardiac-event` | medium | family history of a premature cardiac event |
| `unexplained-weight-loss` | medium | unexplained weight loss reported — warrants GP review regardless of other findings |
| `occupational-restriction-indicated` | low | physical demands of the role exceed what current activity level or joint findings suggest is safe |
| `vaccination-gap` | low | vaccination status is not up to date, or gaps are noted |
| `paediatric` | standard | age < 16 — PAR-Q+ and AUDIT-C are both adult instruments; redirect to a paediatric pathway |

## 9. Acceptance criteria

- `bin/test-form health-screening-questionnaire` exits cleanly.
- `bin/test-sql-apply health-screening-questionnaire` applies every migration
  in order to a fresh scratch Postgres database.
- `bin/test-examples-conformance health-screening-questionnaire` reports no
  drift between `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O) and unit-tested; every
  PAR-Q+ item and both AUDIT-C thresholds (5/4 increasing-risk, 8 higher-risk)
  have explicit boundary tests on both sides.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check health-screening-questionnaire` reports no
  drift.
- The wizard is one continuous single page — no multi-page navigation.
- LocalStorage keys preserve draft state across reloads:
  - `health-screening-questionnaire.front-end-with-html.v1` (HTML)
  - `health-screening-questionnaire.front-end-with-svelte.v1` (SvelteKit)

## 10. Clinical grounding

- PAR-Q+ Collaboration. Warburton DER, Jamnik VK, Bredin SSD, Gledhill N.
  *The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and
  Electronic Physical Activity Readiness Medical Examination (ePARmed-X+).*
  Health & Fitness Journal of Canada 2011;4(2):3–17.
  <http://eparmedx.com/>
- Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. *The AUDIT alcohol
  consumption questions (AUDIT-C): an effective brief screening test for
  problem drinking.* Archives of Internal Medicine 1998;158(16):1789–95.
- NHS. *NHS Health Check* programme.
  <https://www.nhs.uk/conditions/nhs-health-check/>
- University Hospital Southampton NHS Foundation Trust. *My Medical Record —
  Perioperative Screening Questionnaire.*
  <https://www.uhs.nhs.uk/departments/perioperative-care/my-medical-record-perioperative-screening-questionnaire>
- See also `forms/alcohol-use-disorders-identification-test-consumption/` and
  `forms/perioperative-optimization/` for the AUDIT-C implementation this form
  reuses.

## 11. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. This form is decision support: it screens using
validated instruments and surfaces flags, but does not diagnose and does not
replace the clinical judgement of a qualified professional.

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
- [`../patient-intake/spec/index.md`](../../patient-intake/spec/index.md) — differentiated sibling form

## 13. Verify

```sh
bin/test-form health-screening-questionnaire
```

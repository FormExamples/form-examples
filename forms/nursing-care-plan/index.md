# Nursing Care Plan

A structured nursing care plan that documents patient care following the
**nursing process** — Assessment, Diagnosis, Planning, Implementation,
Evaluation (**ADPIE**) — and is commonly organised by activities of daily
living using the **Roper–Logan–Tierney** model of nursing. The plan captures the
identified nursing problems / needs, the goals set for each, the planned
interventions, the record of implementation, the evaluation and review, and the
risk assessments referenced (falls, pressure ulcer, venous thromboembolism,
nutrition / MUST).

Unlike a scored clinical instrument, this form is a **documentation and
completeness tool**. There is no numeric score. A completeness engine grades how
fully each identified problem has been worked through the nursing process — every
problem should carry at least one **goal**, at least one **intervention**, and an
**evaluation** — and returns an overall care-plan status of **Complete**,
**Partial**, or **Incomplete**, together with a completeness percentage and a set
of flagged issues (for example, an identified risk with no linked intervention,
or an unmet goal overdue for review). The output is a care-plan record suitable
for the nursing notes and handover.

## Scope and intended users

- **Setting:** hospital wards, community and district nursing, care homes,
  hospices, and any setting where a written nursing care plan is maintained.
- **Users:** registered nurses, nursing associates, and student nurses working
  under supervision; read by the wider multidisciplinary team at handover and
  review.
- **Patients:** any patient or resident under nursing care who requires a
  documented, individualised plan of care.
- **Not for:** medical prescribing, a substitute for the specialist risk-
  assessment tools it references (it records that they were done and their
  outcome, it does not replace them), or numeric clinical scoring.

## Sections and completeness model

The plan is built from a **parent care-plan record** plus one or more **problem
entries**. Each problem is worked through the nursing process, so every problem
row carries its own goals, interventions, and evaluation.

**Nursing process (ADPIE) per problem.**

| Stage | Captured as | Notes |
| --- | --- | --- |
| **A**ssessment | problem / need statement, assessment data, referenced risk assessments | what the nurse observed or the patient reported |
| **D**iagnosis | nursing problem / need (actual or potential), organised by activity of daily living (RLT) | the identified need, not a medical diagnosis |
| **P**lanning | one or more **SMART** goals with a target / review date | Specific, Measurable, Achievable, Relevant, Time-bound |
| **I**mplementation | one or more planned interventions and the record that they were carried out | the nursing actions |
| **E**valuation | evaluation note, goal-met status, and next review date | did the intervention meet the goal |

**Problem completeness classes.** Each problem is graded independently:

| Class | Rule |
| --- | --- |
| **Complete** | has ≥ 1 goal **and** ≥ 1 intervention **and** an evaluation recorded |
| **Partial** | has some but not all of {goal, intervention, evaluation} |
| **Incomplete** | has a problem statement only — no goal, no intervention, no evaluation |

**Care-plan status.** The parent plan is graded from its problems:

| Status | Rule |
| --- | --- |
| **Complete** | every problem is **Complete** and there are no high-priority flags |
| **Partial** | at least one problem is **Complete** or **Partial**, but not all problems are Complete |
| **Incomplete** | no problems recorded, or every recorded problem is **Incomplete** |

**Completeness percent.** The proportion of the required care-process elements
that are present across all problems (goal, intervention, evaluation for each
problem), expressed 0–100 and rounded to the nearest integer.

**Flagged issues.** Raised independently of the status, each with a priority:

- **Risk without intervention** (high) — a referenced high-risk assessment
  (falls / pressure ulcer / VTE / MUST) with no linked intervention.
- **High-risk assessment not actioned** (high) — a risk assessment scored
  high-risk but no goal or intervention created for it.
- **Missing evaluation** (medium) — a problem with a goal and intervention but no
  evaluation recorded.
- **Unmet goal overdue for review** (medium) — a goal marked not met whose review
  date has passed.
- **No review date** (medium) — a problem or goal with no next review date set.
- **Incomplete problem** (low) — a problem with a statement only.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Plan context | authoring nurse name and role (registered nurse / nursing associate / student), registration (NMC) number, date and time, care setting, plan type (admission / ongoing / discharge) |
| 2 | Patient identification | patient identifier, name, date of birth, sex, ward / location |
| 3 | Risk assessments referenced | falls, pressure ulcer (e.g. Waterlow / Braden), VTE, nutrition (MUST) — each: done yes/no, risk level, date, actioned yes/no |
| 4 | Problems and needs | for each problem: problem / need statement, activity of daily living (RLT category), actual or potential, assessment data |
| 5 | Goals | for each problem: one or more SMART goals, each with goal text, target / review date, met status |
| 6 | Interventions | for each problem: one or more planned interventions, each with intervention text and carried-out record |
| 7 | Evaluation and review | for each problem: evaluation note, overall goal-met status, next review date |
| 8 | Summary and completeness | computed care-plan status, completeness percent, per-problem classes, flagged issues, free-text handover note, nurse sign-off |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The completeness engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a
  documentation and completeness aid; it does not diagnose or determine
  treatment, so it sits at the low-risk end of clinical decision support.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Roper N., Logan W., Tierney A. *The Roper–Logan–Tierney Model of Nursing:
  Based on Activities of Living.* Churchill Livingstone, 2000.
- Nursing and Midwifery Council. *The Code: Professional standards of practice
  and behaviour for nurses, midwives and nursing associates* (2018, updated).
- Royal College of Nursing. *Record keeping: guidance for nursing and midwifery
  staff.*
- NICE CG161 *Falls in older people*; NICE CG179 *Pressure ulcers*;
  NICE NG89 *Venous thromboembolism*; BAPEN *Malnutrition Universal Screening
  Tool (MUST).*

## Verify

```sh
bin/test-form nursing-care-plan
```

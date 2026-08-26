# Heart Failure Annual Review

A UK primary-care structured **annual review** for adults with an established
diagnosis of chronic heart failure. It records the objective and self-reported
findings needed to confirm functional status, review fluid balance, verify
monitoring bloods, and check that guideline-directed medical therapy has been
optimized. The engine derives an **NYHA functional status**, a **medication-
optimization status** against the "four pillars" of heart-failure therapy,
grades the **completeness** of the review, and raises safety flags (urgent
review, optimization gaps, deranged renal function or potassium, fluid overload,
missing monitoring bloods).

This is a **documentation and status-classification** form, not a diagnostic
calculator. It does not diagnose heart failure or its subtype; it assumes a
prior diagnosis (confirmed on echocardiography and natriuretic peptides) and
supports the recurring review that NICE recommends for every patient on a
heart-failure register. It is aligned with **NICE NG106** (*Chronic heart
failure in adults: diagnosis and management*) and the NICE quality standard for
heart failure, and supports the Quality and Outcomes Framework (QOF) heart-
failure register review.

## Scope and intended users

- **Setting:** UK general practice, community heart-failure services, and the
  primary–secondary care interface. Suitable for the QOF annual review and for
  structured medication-optimization clinics.
- **Users:** general practitioners, practice nurses, community heart-failure
  specialist nurses, clinical pharmacists, and cardiology teams reviewing a
  shared-care patient.
- **Patients:** adults (≥ 18 years) already on a heart-failure register with a
  confirmed diagnosis of chronic heart failure.
- **Not for:** initial diagnosis of heart failure, acute decompensated heart
  failure requiring admission, paediatric heart failure, or as a substitute for
  clinical judgement. A "complete" review does not certify clinical stability.

## Sections captured

Completed in order on a single continuous single-page wizard. Each step records
either an objective finding or a documented review action.

| # | Section | Key fields |
| --- | --- | --- |
| 1 | Review context | reviewing clinician name and role, review date, care setting, review type (routine annual / post-discharge / medication titration), date of last review |
| 2 | Patient & diagnosis | patient identifier, age band, sex, year of diagnosis, heart-failure type (reduced / mildly-reduced / preserved EF), most recent LVEF %, date of last echocardiogram, aetiology |
| 3 | Functional status | NYHA class (I–IV), exercise tolerance, breathlessness, orthopnoea, paroxysmal nocturnal dyspnoea, fatigue, change since last review |
| 4 | Fluid status & observations | weight, weight change since last review, peripheral oedema, jugular venous pressure, lung crackles, blood pressure, heart rate and rhythm |
| 5 | Investigations | NT-proBNP, sodium, potassium, urea, creatinine, eGFR, haemoglobin, ferritin/transferrin saturation, HbA1c, date of bloods |
| 6 | Medication optimization | for each of the four pillars — ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2 inhibitor — prescribed (yes/no/contraindicated), agent, current dose, at target dose, adherence; loop diuretic dose; other relevant drugs |
| 7 | Devices & procedures | ICD, CRT-P/CRT-D, pacemaker, device check status, revascularization history |
| 8 | Vaccinations & self-management | annual influenza and pneumococcal vaccination, COVID-19 status, smoking, alcohol, fluid/salt advice, daily weights, self-management plan, cardiac rehabilitation |
| 9 | Summary & plan | derived NYHA functional status, medication-optimization status, review-completeness grade, flagged issues, agreed actions, next review interval, free-text clinical note |

## Status-classification & completeness model

The engine derives four independent outputs; none is a diagnosis.

**NYHA functional status** — mapped directly from the recorded NYHA class:

| NYHA class | Description | Functional status |
| --- | --- | --- |
| I | No limitation of ordinary physical activity | `stable` |
| II | Slight limitation; comfortable at rest | `stable` |
| III | Marked limitation; less than ordinary activity causes symptoms | `symptomatic` |
| IV | Symptoms at rest; unable to carry out any activity without discomfort | `advanced` |

**Medication-optimization status** — the "four pillars" of guideline-directed
medical therapy are most strongly indicated in heart failure with **reduced**
ejection fraction (HFrEF):

1. ACE inhibitor, or ARB, or ARNI (renin–angiotensin system inhibitor)
2. Beta-blocker licensed for heart failure
3. Mineralocorticoid receptor antagonist (MRA)
4. SGLT2 inhibitor

For each indicated pillar the review records whether the patient is prescribed
it, contraindicated, or not on it. The engine counts prescribed vs indicated
pillars and grades: `optimised` (all indicated pillars prescribed or documented
contraindicated), `partial` (some prescribed), `suboptimal` (none or almost
none), or `not-applicable` where the pillar set does not apply. For **mildly-
reduced** and **preserved** ejection fraction the SGLT2 inhibitor is the
principal disease-modifying pillar, with the remaining agents used for
comorbidity and symptom control.

**Review-completeness grade** — proportion of the required review domains
documented (functional status, fluid status, monitoring bloods, medication
review, vaccinations, self-management): `complete`, `partial`, or `incomplete`.

**Flagged issues** — raised independently of the grades:

- **Urgent review** (high) — NYHA III–IV or documented decompensation.
- **Optimization gap** (high/medium) — not on all indicated four-pillar
  therapies without a documented contraindication.
- **Renal/electrolyte derangement** (high) — hyperkalaemia (potassium
  > 5.5 mmol/L), significant hypokalaemia, or a fall in eGFR relevant to RAAS-
  inhibitor and MRA safety.
- **Fluid overload** (high/medium) — weight gain, new or worsening oedema,
  raised JVP, or lung crackles.
- **Missing monitoring bloods** (medium) — no recent U&E/eGFR/potassium for a
  patient on a RAAS inhibitor or MRA.
- **Incomplete review** (low) — required review domains not documented.

## Assessment steps

The nine sections above form one continuous single-page wizard. Numeric fields
(LVEF, weight, NT-proBNP, electrolytes, eGFR, doses) are entered as measured
values; the engine derives all statuses and flags from them and from the
recorded NYHA class and medication fields.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — documentation
  and clinical decision-support tool; the output supports review and prompts
  action rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NICE NG106. *Chronic heart failure in adults: diagnosis and management*
  (2018).
- NICE Quality Standard QS9. *Chronic heart failure in adults* (2011, updated
  2016).
- The New York Heart Association (NYHA) Functional Classification.
- McDonagh T.A. *et al.* 2021 ESC Guidelines for the diagnosis and treatment of
  acute and chronic heart failure. *Eur Heart J* 2021; 42(36):3599–3726.
- NHS England. *Quality and Outcomes Framework (QOF)* — heart-failure
  indicators.

## Verify

```sh
bin/test-form heart-failure-review
```

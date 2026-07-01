# Chronic Obstructive Pulmonary Disease Review (COPD Annual Review)

A UK primary-care **annual review** for adults with a confirmed diagnosis of
chronic obstructive pulmonary disease (COPD). It records the objective and
patient-reported findings that a structured COPD review should capture —
spirometry, symptom burden, exacerbation history, smoking status, inhaler
technique and adherence, vaccinations, pulmonary rehabilitation, oxygen,
comorbidities, and the self-management / rescue-pack plan — then derives a **GOLD
airflow-limitation grade (1–4)**, a **combined ABE assessment group**, a **review
completeness grade**, and a set of clinical flags that prompt action.

The review is aligned with NICE NG115 (*Chronic obstructive pulmonary disease in
over 16s: diagnosis and management*) and the GOLD (Global Initiative for Chronic
Obstructive Lung Disease) 2023+ report. It is a **documentation / completeness
and severity-classification** instrument: it grades how complete the review was
and classifies severity and risk, but it does not itself make a diagnosis or
prescribe treatment — its output prompts the clinician to escalate therapy,
offer cessation support, re-check inhaler technique, catch up vaccinations, or
refer for pulmonary rehabilitation.

## Scope and intended users

- **Setting:** UK general practice and primary-care networks — the recall-based
  annual (or post-exacerbation) COPD review, whether face-to-face, telephone, or
  as part of a respiratory clinic.
- **Users:** general practitioners (GPs), practice and respiratory nurses,
  advanced nurse practitioners, and clinical pharmacists running the COPD
  register review.
- **Patients:** adults (≥ 16 years) with a confirmed, spirometry-supported
  diagnosis of COPD.
- **Not for:** initial COPD diagnosis, asthma or asthma–COPD overlap management,
  acute-exacerbation triage, or paediatric respiratory assessment. A review that
  is graded complete does not by itself confirm that the underlying diagnosis is
  correct.

## Sections captured

Completed in order on a single continuous single-page wizard. Each step records
either an objective finding (spirometry, vaccinations) or a validated
patient-reported measure (mMRC, CAT).

| # | Section | Key fields |
| --- | --- | --- |
| 1 | Review context | reviewing clinician name and role, date of review, review type (routine annual / post-exacerbation / opportunistic), NHS number / local identifier, age band, sex |
| 2 | Diagnosis & history | year of COPD diagnosis, diagnosis confirmed on spirometry (yes/no), phenotype notes, occupational / environmental exposures |
| 3 | Spirometry | post-bronchodilator FEV₁ (litres), FEV₁ % predicted, FVC, FEV₁/FVC ratio, date of spirometry → GOLD airflow grade |
| 4 | Symptom burden | MRC dyspnoea grade (1–5), mMRC grade (0–4), COPD Assessment Test (CAT) total (0–40) → symptom axis |
| 5 | Exacerbations | number of moderate exacerbations in past 12 months, number requiring hospital admission, date of last exacerbation, rescue-pack (oral steroids / antibiotics) courses used → exacerbation-risk axis |
| 6 | Smoking status & cessation | current smoking status (current / ex / never), pack-years, cessation support offered, pharmacotherapy / referral to stop-smoking service |
| 7 | Inhaler therapy | current inhaled therapy (SABA / LABA / LAMA / ICS combinations), device type(s), inhaler technique checked and adequate (yes/no), self-reported adherence |
| 8 | Vaccinations | seasonal influenza, pneumococcal, and COVID-19 vaccination status (up-to-date / due / declined) |
| 9 | Pulmonary rehabilitation & oxygen | pulmonary-rehab status (completed / referred / eligible-not-referred / not-indicated), long-term or ambulatory oxygen use, resting SpO₂ on room air |
| 10 | Comorbidities & self-management | recorded comorbidities (cardiovascular, anxiety/depression, osteoporosis, etc.), personalised self-management plan in place, rescue-pack supplied, next review interval |
| 11 | Summary & classification | computed GOLD grade, ABE group, symptom and exacerbation axes, review-completeness grade, flagged issues, and free-text clinician note |

## Severity / risk & completeness model

The engine derives four independent outputs plus flags.

### GOLD airflow-limitation grade (1–4)

Assigned from the **post-bronchodilator FEV₁ % predicted** (in a patient with a
confirmed FEV₁/FVC < 0.70):

| GOLD grade | Severity | FEV₁ % predicted |
| --- | --- | --- |
| 1 | Mild | ≥ 80 % |
| 2 | Moderate | 50 % to < 80 % |
| 3 | Severe | 30 % to < 50 % |
| 4 | Very severe | < 30 % |

`null` when FEV₁ % predicted is not recorded (raises a completeness flag).

### Symptom and exacerbation axes → ABE group

Two axes feed the GOLD 2023+ combined **ABE** assessment group:

- **Symptom burden** — *high* when `mMRC ≥ 2` **or** `CAT ≥ 10`; otherwise *low*.
- **Exacerbation risk** — *high* when `≥ 2` moderate exacerbations **or** `≥ 1`
  exacerbation leading to hospital admission in the past 12 months; otherwise
  *low*.

| ABE group | Definition |
| --- | --- |
| A | Low exacerbation risk **and** low symptom burden |
| B | Low exacerbation risk **and** high symptom burden |
| E | High exacerbation risk (regardless of symptom burden) |

`null` when neither axis can be determined from the data.

### Review-completeness grade

Grades how much of the expected annual-review dataset was captured:

- **Complete** — all core elements present (spirometry, a symptom measure,
  exacerbation history, smoking status, inhaler-technique check, vaccination
  status, pulmonary-rehab status, self-management plan).
- **Partial** — core clinical elements present but one or more supporting items
  missing.
- **Incomplete** — one or more core clinical elements missing (e.g. no spirometry
  or no symptom measure recorded).

### Flags

Computed independently of the grades, each with a priority:

- **High exacerbation risk / frequent exacerbations** (high) — group E → review
  and consider escalating maintenance inhaled therapy.
- **Current smoker** (high) — offer very-brief advice and refer to stop-smoking
  support with pharmacotherapy.
- **Poor / unchecked inhaler technique** (high) — technique not adequate or not
  checked → re-educate and re-assess device.
- **Missing vaccinations** (medium) — any of influenza / pneumococcal / COVID-19
  not up to date → offer / recall.
- **Pulmonary-rehab candidate** (medium) — `MRC ≥ 3` and not completed / referred
  → refer for pulmonary rehabilitation.
- **Incomplete review** (low) — a core review element is missing → complete the
  dataset.

## Assessment steps

The single-page wizard is completed in the section order above (1–11). Each step
records one review domain; the final step renders the computed GOLD grade, ABE
group, completeness grade, fired rules, and flagged issues alongside a free-text
clinician note.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The grading engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support / documentation tool; the output classifies severity and
  prompts action rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NICE NG115. *Chronic obstructive pulmonary disease in over 16s: diagnosis and
  management* (2018, updated 2019).
- Global Initiative for Chronic Obstructive Lung Disease (GOLD). *Global Strategy
  for the Diagnosis, Management, and Prevention of COPD* (2023 report and later).
- Fletcher C.M. Medical Research Council (MRC) dyspnoea scale.
- Jones P.W. *et al.* COPD Assessment Test (CAT). *Eur Respir J* 2009;
  34(3):648–654.
- Bestall J.C. *et al.* mMRC dyspnoea scale and functional impairment in COPD.
  *Thorax* 1999; 54(7):581–586.

## Verify

```sh
bin/test-form chronic-obstructive-pulmonary-disease-review
```

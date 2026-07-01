# Caprini Venous Thromboembolism Risk Assessment

A structured venous thromboembolism (VTE) risk-stratification tool for surgical
and medical inpatients. It records a checklist of **weighted individual risk
factors** — each worth **1, 2, 3, or 5 points** — sums them into a total
**Caprini score**, maps the total to a **risk band** (very low, low, moderate,
high), and recommends a **prophylaxis strategy** (early ambulation, mechanical,
or pharmacological). A high score is a prompt to prescribe thromboprophylaxis
after a bleeding-risk check; it is not a substitute for clinical judgement.

The Caprini Risk Assessment Model was developed by Joseph A. Caprini and refined
across the 2005 and later revisions. It is endorsed for surgical and
hospitalised medical patients and is the model recommended by the American
College of Chest Physicians (ACCP) *Prevention of VTE in Nonorthopedic Surgical
Patients* guidance for individualised risk stratification.

## Scope and intended users

- **Setting:** surgical wards and pre-operative assessment clinics, general and
  acute medical wards — any inpatient setting where VTE prophylaxis decisions are
  made on admission and after any change in clinical status.
- **Users:** doctors, surgeons, anaesthetists, ward nurses, and pharmacists
  performing admission or pre-operative risk assessment.
- **Patients:** adult (≥ 16 years) surgical and medical inpatients.
- **Not for:** obstetric-specific pathways (use a dedicated maternity VTE tool),
  paediatric patients, or definitive diagnosis of VTE. A low score does not
  exclude VTE; re-assess after surgery or any deterioration.

## Scoring system

**Primary instrument:** Caprini Risk Assessment Model — each present risk factor
contributes its fixed point value; the total is the sum. Age contributes through
a single band; every other factor is a yes/no item.

**1-point factors**

| Factor | Notes |
| --- | --- |
| Age 41–60 years | via age band |
| Minor surgery planned | < 45 minutes |
| Recent major surgery | within the last month |
| Varicose veins | |
| Inflammatory bowel disease | history |
| Swollen legs | current oedema |
| Obesity | BMI ≥ 25 |
| Acute myocardial infarction | |
| Congestive heart failure | within the last month |
| Sepsis | within the last month |
| Serious lung disease including pneumonia | within the last month |
| Abnormal pulmonary function | e.g. COPD |
| Medical patient at bed rest | |
| Oral contraceptive or hormone replacement therapy | |
| Pregnancy or postpartum | within the last month |
| History of recurrent pregnancy loss or adverse pregnancy outcome | |

**2-point factors**

| Factor | Notes |
| --- | --- |
| Age 61–74 years | via age band |
| Arthroscopic surgery | |
| Major open surgery | > 45 minutes |
| Laparoscopic surgery | > 45 minutes |
| Malignancy | present or previous |
| Confined to bed | > 72 hours |
| Immobilising plaster cast | |
| Central venous access | central line |

**3-point factors**

| Factor | Notes |
| --- | --- |
| Age ≥ 75 years | via age band |
| History of VTE | prior deep-vein thrombosis or pulmonary embolism |
| Family history of thrombosis | |
| Factor V Leiden | |
| Prothrombin 20210A | |
| Lupus anticoagulant | |
| Anticardiolipin antibodies | |
| Elevated serum homocysteine | |
| Heparin-induced thrombocytopenia | |
| Other congenital or acquired thrombophilia | |

**5-point factors**

| Factor | Notes |
| --- | --- |
| Stroke | within the last month |
| Elective arthroplasty | hip or knee replacement |
| Hip, pelvis, or leg fracture | |
| Acute spinal cord injury with paralysis | within the last month |
| Multiple trauma | within the last month |

**Interpretation.** The total maps to a risk band and prophylaxis
recommendation:

| Total score | Risk band | Recommended prophylaxis |
| --- | --- | --- |
| 0–1 | Very low | Early ambulation; no specific mechanical or pharmacological prophylaxis. |
| 2 | Low | Mechanical prophylaxis (intermittent pneumatic compression and/or graduated compression stockings). |
| 3–4 | Moderate | Pharmacological prophylaxis (low-molecular-weight heparin or low-dose unfractionated heparin) or mechanical prophylaxis; consider combining. |
| ≥ 5 | High | Pharmacological prophylaxis **plus** mechanical prophylaxis; consider extended-duration prophylaxis. Confirm no bleeding contraindication first. |

Where the bleeding risk is high, mechanical prophylaxis substitutes for
pharmacological prophylaxis until the bleeding risk resolves.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, admission type (surgical / medical) |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | 1-point risk factors | each 1-point factor as present / absent |
| 4 | 2-point risk factors | each 2-point factor as present / absent |
| 5 | 3-point risk factors | each 3-point factor as present / absent |
| 6 | 5-point risk factors | each 5-point factor as present / absent |
| 7 | Bleeding risk | active bleeding or high bleeding-risk contraindication to pharmacological prophylaxis |
| 8 | Summary and score | computed Caprini total, risk band, fired factors, recommended prophylaxis, red-flag issues, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support tool; the output recommends prophylaxis rather than
  determining it automatically.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Caprini J.A. Thrombosis risk assessment as a guide to quality patient care.
  *Disease-a-Month* 2005; 51(2–3):70–78.
- Gould M.K. *et al.* Prevention of VTE in Nonorthopedic Surgical Patients:
  Antithrombotic Therapy and Prevention of Thrombosis, 9th ed. ACCP Guidelines.
  *Chest* 2012; 141(2 Suppl):e227S–e277S.
- NICE NG89. *Venous thromboembolism in over 16s: reducing the risk of
  hospital-acquired deep vein thrombosis or pulmonary embolism* (2018, updated).

## Verify

```sh
bin/test-form caprini-venous-thromboembolism-risk-assessment
```

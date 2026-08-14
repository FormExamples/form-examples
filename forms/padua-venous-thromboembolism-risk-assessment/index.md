# Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score)

A bedside risk-stratification tool that estimates the risk of venous
thromboembolism (VTE — deep-vein thrombosis and pulmonary embolism) in
hospitalized **medical** patients. It records **eleven weighted risk factors**,
sums a total of **0–20**, and classifies the patient as **high risk** when the
score is **≥ 4** and **low risk** when the score is **< 4**. A high score is a
prompt to consider **pharmacological thromboprophylaxis** (in the absence of
contraindications such as active bleeding or high bleeding risk); a low score
supports withholding routine anticoagulant prophylaxis and using mechanical
measures and early mobilization.

The Padua Prediction Score was derived and validated by Barbar *et al.*
(*Journal of Thrombosis and Haemostasis*, 2010) in a prospective cohort of
hospitalized medical patients, and is recommended as a VTE risk-assessment model
for medical inpatients by the American College of Chest Physicians (ACCP,
Antithrombotic Therapy for VTE Disease, 9th ed.).

## Scope and intended users

- **Setting:** general and acute medical wards, admissions units, and any
  inpatient setting caring for hospitalized medical patients.
- **Users:** doctors, nurses, pharmacists, and other clinicians performing VTE
  risk assessment on admission and at review.
- **Patients:** adults admitted as **medical** (non-surgical) inpatients.
- **Not for:** surgical, obstetric, or paediatric patients (use a surgical or
  obstetric VTE risk-assessment model), ambulatory / outpatient scoring, or as a
  substitute for a bleeding-risk assessment. A low Padua score does not exclude
  VTE and does not remove the need for clinical judgement.

## Scoring system

**Primary instrument:** Padua Prediction Score — eleven risk factors, each
scoring its weighted points when present and 0 when absent. Total score 0–20.

| # | Risk factor | Scores when present | Points |
| --- | --- | --- | --- |
| 1 | Active cancer | metastatic and/or chemo/radiotherapy in the previous 6 months | 3 |
| 2 | Previous VTE | history of deep-vein thrombosis or pulmonary embolism (excluding superficial vein thrombosis) | 3 |
| 3 | Reduced mobility | bedrest with bathroom privileges for ≥ 3 days | 3 |
| 4 | Known thrombophilia | e.g. antithrombin, protein C or S defect, factor V Leiden, prothrombin G20210A, antiphospholipid syndrome | 3 |
| 5 | Recent trauma or surgery | ≤ 1 month | 2 |
| 6 | Elderly age | ≥ 70 years | 1 |
| 7 | Heart and/or respiratory failure | present | 1 |
| 8 | Acute myocardial infarction or ischaemic stroke | present | 1 |
| 9 | Acute infection and/or rheumatological disorder | present | 1 |
| 10 | Obesity | body mass index ≥ 30 | 1 |
| 11 | Ongoing hormonal treatment | present | 1 |

**Interpretation.**

| Total score | Risk band | Recommended action |
| --- | --- | --- |
| < 4 | Low risk | Routine pharmacological thromboprophylaxis not indicated on risk grounds. Encourage early mobilization; consider mechanical prophylaxis; re-score if the clinical condition changes. |
| ≥ 4 | High risk | Consider pharmacological thromboprophylaxis (e.g. low-molecular-weight heparin, unfractionated heparin, or fondaparinux) **after** assessing bleeding risk and contraindications. Use mechanical prophylaxis where pharmacological prophylaxis is contraindicated. |

The threshold for a high-risk classification is **Padua ≥ 4**, associated in the
derivation cohort with a substantially higher cumulative incidence of VTE among
medical inpatients not receiving prophylaxis.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one or more **risk factors** or the context needed to interpret them.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, admission reason |
| 2 | Patient identification | patient identifier, age (or age ≥ 70 flag), sex |
| 3 | Oncology and thrombosis history | active cancer, previous VTE, known thrombophilia |
| 4 | Mobility and recent events | reduced mobility ≥ 3 days, recent trauma or surgery ≤ 1 month |
| 5 | Cardiorespiratory and acute illness | heart/respiratory failure, acute MI or ischaemic stroke, acute infection or rheumatological disorder |
| 6 | Metabolic and treatment factors | obesity (BMI, or BMI ≥ 30 flag), ongoing hormonal treatment |
| 7 | Bleeding-risk check | active bleeding, high bleeding-risk factors (informational; gates the prophylaxis recommendation) |
| 8 | Summary and score | computed Padua total, risk band, fired factors, red-flag issues, prophylaxis recommendation, free-text clinical note |

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
  decision-support risk-assessment tool; the output prompts a prophylaxis
  decision rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Barbar S. *et al.* A risk assessment model for the identification of
  hospitalized medical patients at risk for venous thromboembolism: the Padua
  Prediction Score. *J Thromb Haemost* 2010; 8(11):2450–2457.
- Kahn S.R. *et al.* Prevention of VTE in Nonsurgical Patients: Antithrombotic
  Therapy and Prevention of Thrombosis, 9th ed. (ACCP). *Chest* 2012;
  141(2 Suppl):e195S–e226S.
- NICE NG89. *Venous thromboembolism in over 16s: reducing the risk of
  hospital-acquired deep vein thrombosis or pulmonary embolism* (2018, updated
  2019).

## Verify

```sh
bin/test-form padua-venous-thromboembolism-risk-assessment
```

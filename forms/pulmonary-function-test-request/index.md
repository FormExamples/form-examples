# Pulmonary Function Test Request

A UK NHS–aligned **lung-function / spirometry test request (referral)** that a
clinician completes to request pulmonary function testing for a patient. It
records the requested test, the clinical indication and specific question,
relevant respiratory symptoms, smoking and inhaler background, and a focused
safety / contraindication screen — then computes a **four-axis grading**
(appropriateness, safety / contraindication, request completeness, and triage
priority) plus a set of safety-critical flags. The output is a vetting report
that supports the lung-function department's triage and booking decision.

This form is the respiratory-diagnostics counterpart to the repository's other
clinician-driven test-request forms. It is completed by a respiratory
physician, GP, hospital doctor, respiratory physiologist, or nurse rather than
by the patient, and is aligned with the ARTP statement on pulmonary function
testing, ERS/ATS spirometry standards, and NICE NG80 (asthma) and NG115 (COPD).

## Scope and intended users

- **Setting:** NHS respiratory clinic, GP practice with direct-access
  diagnostics, hospital ward, pre-operative assessment unit, or lung-function
  department triage / vetting desk.
- **Users:** respiratory physicians, GPs, hospital doctors, respiratory
  physiologists, and nurses who request or vet lung-function tests.
- **Patients:** people of any age requiring spirometry or wider pulmonary
  function testing.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
contraindicated, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG80 (asthma) / NG115 (COPD), ARTP indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Safety / contraindication** | ARTP / ERS-ATS forced-expiration & infection-control contraindications | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency escalation rules | routine / urgent (+ target timeframe) |

A safety contraindication (recent MI, recent thoracic/eye/abdominal surgery,
active respiratory infection, suspected active tuberculosis, haemoptysis)
**downgrades** the safety band and can defer the test regardless of the other
axes.

### Test types and indications

| Test type | Typical indication |
| --- | --- |
| Spirometry | Suspected COPD, baseline obstruction, breathlessness, monitoring |
| Spirometry with reversibility | Suspected asthma, asthma/COPD differentiation |
| Full lung function | Restrictive disease, complex / unexplained breathlessness |
| Gas transfer (DLCO) | Interstitial lung disease, emphysema, pre-chemotherapy |
| Peak flow | Asthma variability, occupational asthma monitoring |
| FeNO | Suspected asthma (eosinophilic airway inflammation) |

NICE NG80 makes spirometry the first-line investigation for suspected asthma
and COPD, with bronchodilator reversibility and FeNO used per the diagnostic
algorithm; NICE NG115 defines spirometry-confirmed airflow obstruction
(post-bronchodilator FEV1/FVC < 0.7) for COPD.

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, height, weight |
| 3 | Requested test | test type, primary indication, specific clinical question, relevant history |
| 4 | Symptoms | breathlessness, cough, wheeze |
| 5 | Background | smoking status, current inhalers |
| 6 | Safety screen | recent respiratory infection, recent MI / eye / abdominal / thoracic surgery, suspected active tuberculosis |
| 7 | Triage & submit | urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
recent-mi-contraindication, active-respiratory-infection,
suspected-tb-infection-control, haemoptysis, missing-indication,
missing-clinical-question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
pulmonary-function-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml/              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-with-html/         # single-page HTML wizard
  front-end-with-svelte/       # SvelteKit single-page wizard
  front-end-with-html/    # vetting dashboard (HTML table)
  front-end-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- ARTP statement on pulmonary function testing (2020).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC7337892/>
- An update on contraindications for lung function testing (Cooper et al.).
  <https://wyh.icst.org.uk/wp-content/uploads/2023/03/714.full_.pdf>
- NICE NG80 *Asthma: diagnosis, monitoring and chronic asthma management*
  (spirometry first-line; bronchodilator reversibility; FeNO).
  <https://www.nice.org.uk/guidance/ng80>
- NICE NG115 *Chronic obstructive pulmonary disease in over 16s* (spirometry
  post-bronchodilator FEV1/FVC < 0.7). <https://www.nice.org.uk/guidance/ng115>
- ERS/ATS *Standardization of spirometry* (2019 update).
  <https://www.ersnet.org/>
- NHS England — Enhancing GP direct access to diagnostic tests for suspected
  COPD, asthma, or heart failure.
  <https://www.england.nhs.uk/long-read/enhancing-gp-direct-access-to-diagnostic-tests-for-patients-with-suspected-chronic-obstructive-pulmonary-disease-asthma-or-heart-failure/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form pulmonary-function-test-request
```

# Cardiology Response

A UK NHS–aligned **cardiology response (consult reply)** that a cardiology
clinician completes in answer to a cardiology referral. It is the
**response/report counterpart** to [`cardiology-request`](../cardiology-request):
where the request captures *why* a patient should be seen and *how urgently*,
this form records *what the cardiology assessment found* and *what should happen
next*. It records the consultation type, the clinical summary and examination,
the investigations performed, the structured findings, the diagnosis, the key
left-ventricular ejection fraction measurement, the management plan and
follow-up, and critical-result communication — then computes a **four-axis
interpretation grade** (response classification, condition severity / structured
findings, response completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured cardiology response letter.

This form is the **response** half of the request/response pair, and mirrors the
repository's other clinician-driven result/response forms. It is completed by a
consultant cardiologist, cardiology registrar, or cardiology specialist nurse
rather than by the patient, and is aligned with NICE chest pain (CG95), chronic
heart failure (NG106), and the NHS e-Referral advice-and-guidance / counter-
referral model.

## Scope and intended users

- **Setting:** cardiology outpatient clinic, advice-and-guidance triage desk,
  inpatient cardiology review, or telephone / virtual consultation.
- **Users:** consultant cardiologists, cardiology registrars, and cardiology
  specialist nurses who assess referred patients and author the reply.
- **Patients:** any patient referred to cardiology for assessment.

## Response semantics (not a referral)

A **request** form is prospective and asks *should this patient be seen, and how
urgently?*. A **response** form is retrospective and records *what did the
assessment find, and what does it mean?*. Accordingly the source-of-truth table
here is `cardiology_response`, the responding clinician is the reply
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each response on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured response can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Response classification** | Overall assessment conclusion | no-abnormality / cardiac-condition / critical / inconclusive |
| **B. Severity & structured findings** | Dominant structured finding | severity (none / minor / moderate / major) + a `severity_category` label |
| **C. Response completeness** | Mandatory-section checklist (summary, examination, diagnosis, management, follow-up) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical result** (e.g. critical arrhythmia, severe symptomatic aortic
stenosis, acute coronary syndrome) **auto-escalates** Axis D to *critical-alert*
and raises the `critical-finding` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`ischaemia_or_cad`, `significant_arrhythmia`, `reduced_ejection_fraction`,
`significant_valve_disease`, `structural_abnormality`,
`uncontrolled_hypertension`, `non_cardiac_cause`.

Key measurement: `lv_ejection_fraction_percent` (left-ventricular ejection
fraction, the key prognostic measurement).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Response identification | responding clinician, originating request reference, response status, consultation type, assessed & responded dates |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Clinical assessment | clinical summary, examination findings, investigations performed |
| 4 | Structured findings | ischaemia/CAD, arrhythmia, reduced EF, valve disease, structural abnormality, uncontrolled hypertension, non-cardiac cause |
| 5 | Diagnosis & measurement | primary diagnosis category, diagnosis narrative, LV ejection fraction |
| 6 | Management & follow-up | management plan, medication changes, recommended follow-up |
| 7 | Sign-off | critical result + communication, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **critical-finding** — a critical or unexpected significant cardiac result;
  auto-escalates follow-up urgency to critical-alert.
- **severe-valve-disease** — significant (moderate–severe) valve disease
  requiring specialist management.
- **significant-arrhythmia** — significant arrhythmia requiring management.
- **reduced-ejection-fraction** — reduced left-ventricular ejection fraction
  (heart failure with reduced EF).
- **incomplete-response** — mandatory response sections missing.
- **missing-diagnosis** — no diagnosis category supplied.
- **other** — any other safety concern.

## Output

- **HTML report preview** and downloadable **PDF** response letter.
- **FHIR R5 Bundle** (DiagnosticReport / Communication + supporting resources)
  exportable for integration with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Clinical references

- NICE CG95 — Chest pain of recent onset: assessment and diagnosis.
  <https://www.nice.org.uk/guidance/cg95>
- NICE NG106 — Chronic heart failure in adults: diagnosis and management.
  <https://www.nice.org.uk/guidance/ng106>
- 2024 ESC Guidelines for the management of chronic coronary syndromes.
  <https://academic.oup.com/eurheartj/article/45/36/3415/7743115>
- 2021 ESC/EACTS Guidelines for the management of valvular heart disease.
  <https://academic.oup.com/eurheartj/article/43/7/561/6358470>
- NHS e-Referral Service — advice and guidance.
  <https://digital.nhs.uk/services/e-referral-service>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives follow-up urgency / action.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form cardiology-response
```

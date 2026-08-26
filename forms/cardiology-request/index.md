# Cardiology Request

A UK NHS–aligned **cardiology referral / consult request** that a clinician
completes to refer a patient *into* a cardiology service. It records the
requested cardiology service and the primary reason for referral, the specific
clinical question, presenting symptoms and functional class, acute red flags,
investigations already performed (resting ECG, troponin, BNP), the patient's
cardiac history and risk factors, and triage details — then computes a
**four-axis vetting grade** (referral appropriateness, safety / red-flag,
request completeness, and triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the cardiology department's triage
and booking decision.

This form is the **request** half of the request/response pair: where this form
captures *why* a patient should be seen by cardiology and *how urgently*, the
sibling [`cardiology-response`](../cardiology-response) form records the
cardiology team's reply. It is completed by a GP, hospital doctor, cardiologist,
or specialist nurse rather than by the patient, and is aligned with NICE chest
pain (CG95), chronic heart failure (NG106), transient loss of consciousness
(CG109), and the NHS e-Referral advice-and-guidance / referral-vetting model.

## Scope and intended users

- **Setting:** GP surgery, emergency department, acute medical unit, hospital
  ward, or cardiology triage / vetting desk.
- **Users:** GPs, hospital doctors, cardiologists, and specialist nurses who
  refer patients to, or vet referrals into, a cardiology service.
- **Patients:** adults with suspected or known cardiac disease who require
  cardiology assessment.

## Scoring system

The engine grades each referral on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate referral can still be
unsafe to manage as a routine referral, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Right-service / right-reason check against NICE referral criteria | usually-appropriate / may-be-appropriate / usually-not-appropriate |
| **B. Safety / red-flag** | Acute red-flag escalation rules | ok / caution / red-flag |
| **C. Request completeness** | Mandatory-field checklist, reason + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag and acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A red flag (suspected acute coronary syndrome, exertional syncope, new-onset
heart failure) drives the safety axis and **auto-escalates** the triage tier
regardless of the other axes. Choose the least-urgent band only when no rule
fires.

### Reason and service map

| Referral reason | Typical service | Notes |
| --- | --- | --- |
| Chest pain (suspected angina) | Rapid-access chest-pain clinic | NICE CG95; typicality drives urgency |
| Breathlessness / suspected heart failure | Heart-failure clinic | BNP / NT-proBNP gates urgency (NG106) |
| Palpitations / arrhythmia | Arrhythmia / EP clinic | Exertional syncope is a red flag |
| Syncope | General cardiology / arrhythmia | Exertional syncope warrants urgent review |
| Murmur / valve disease | Valve clinic | Echocardiography assessment |
| Abnormal ECG | General cardiology | Context-dependent |
| Pre-operative assessment | Pre-operative cardiac | Risk stratification before surgery |

## Wizard steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Referring clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Referral reason | requested service, primary reason, specific clinical question, relevant history |
| 4 | Symptoms | chest pain + character, breathlessness + NYHA class, palpitations, syncope, oedema |
| 5 | Red flags & investigations | suspected ACS, exertional syncope, new-onset heart failure, ECG done + findings, troponin, BNP |
| 6 | Cardiac history | known CAD, previous MI, heart failure, valve disease, arrhythmia, hypertension, diabetes, medications |
| 7 | Triage | requested urgency, requested-by date, setting |
| 8 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **suspected-acs** — suspected acute coronary syndrome; divert to the emergency
  ACS pathway rather than a routine clinic.
- **exertional-syncope** — syncope on exertion; possible structural or arrhythmic
  cause requiring urgent assessment.
- **new-onset-heart-failure** — new-onset heart failure; warrants urgent
  assessment (NICE NG106).
- **red-flag-chest-pain** — typical-angina chest pain at rest / crescendo; vet
  for urgent rather than routine review.
- **missing-reason** — no primary reason for referral supplied.
- **missing-clinical-question** — no specific clinical question supplied.
- **other** — any other safety concern.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** (ServiceRequest + supporting resources) exportable for
  integration with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Clinical references

- NICE CG95 — Chest pain of recent onset: assessment and diagnosis.
  <https://www.nice.org.uk/guidance/cg95>
- NICE NG106 — Chronic heart failure in adults: diagnosis and management.
  <https://www.nice.org.uk/guidance/ng106>
- NICE CG109 — Transient loss of consciousness ('blackouts') in over 16s.
  <https://www.nice.org.uk/guidance/cg109>
- 2024 ESC Guidelines for the management of chronic coronary syndromes.
  <https://academic.oup.com/eurheartj/article/45/36/3415/7743115>
- NHS e-Referral Service — advice and guidance / referral vetting.
  <https://digital.nhs.uk/services/e-referral-service>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / service selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form cardiology-request
```

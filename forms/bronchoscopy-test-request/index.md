# Bronchoscopy Test Request

A UK NHS–aligned **airway endoscopy request (referral)** that a clinician
completes to request a bronchoscopy for a patient. It records the requested
procedure, the clinical indication and specific question, relevant history,
respiratory symptoms, imaging findings, bleeding / anticoagulation risk, and
procedural risk — then computes a **four-axis grading** (appropriateness,
cancer-pathway urgency, request completeness, and pre-procedure risk) plus a set
of safety-critical flags. The output is a vetting report that supports the
bronchoscopy service's triage and booking decision.

This form is the airway-endoscopy counterpart to the repository's other
clinician-driven request forms. It is completed by a respiratory physician,
thoracic surgeon, GP, or oncologist rather than by the patient, and is aligned
with the British Thoracic Society (BTS) guideline for diagnostic flexible
bronchoscopy and NICE NG12 (suspected cancer recognition and referral).

## Scope and intended users

- **Setting:** NHS respiratory clinic, thoracic surgery, oncology, rapid-access
  lung-cancer clinic, or bronchoscopy-suite triage / vetting desk.
- **Users:** respiratory physicians, thoracic surgeons, GPs, oncologists, and
  the bronchoscopists who vet incoming requests.
- **Patients:** adults requiring airway endoscopy for diagnosis or sampling.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or high-risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | BTS flexible bronchoscopy + indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 two-week-wait suspected-cancer rules | triage tier (routine / urgent / two-week-wait / emergency) + target timeframe + two-week-wait eligibility |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Pre-procedure risk** | Anticoagulant / antiplatelet, platelet count, hypoxia, ASA grade | low / moderate / high (+ anticoagulant action) |

A massive-haemoptysis or haemodynamic emergency **auto-escalates** the triage
tier regardless of the other axes.

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested procedure | procedure, primary indication, specific clinical question, relevant history |
| 4 | Symptoms & imaging | haemoptysis, cough, breathlessness, weight loss, imaging findings |
| 5 | Bleeding risk | anticoagulant + agent, antiplatelet + agent, platelet count |
| 6 | Procedural risk | oxygen dependence, ASA grade, planned sedation |
| 7 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, massive-haemoptysis-emergency, high-bleeding-risk-anticoag,
hypoxia, asa-iv, missing-indication, missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
bronchoscopy-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
```

## Clinical references

- British Thoracic Society guideline for diagnostic flexible bronchoscopy in
  adults (Du Rand et al., *Thorax* 2013; NICE-accredited).
  <https://pubmed.ncbi.nlm.nih.gov/23860341/>
- British Thoracic Society guideline for advanced diagnostic and therapeutic
  flexible bronchoscopy in adults (2011).
  <https://pubmed.ncbi.nlm.nih.gov/21987439/>
- BTS Quality Standards for Flexible Bronchoscopy in Adults.
  <https://www.brit-thoracic.org.uk/quality-improvement/quality-standards/flexible-bronchoscopy/>
- NICE NG12 *Suspected cancer: recognition and referral* (lung cancer
  two-week-wait; unexplained haemoptysis in people aged 40+).
  <https://www.nice.org.uk/guidance/ng12>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / procedure selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form bronchoscopy-test-request
```

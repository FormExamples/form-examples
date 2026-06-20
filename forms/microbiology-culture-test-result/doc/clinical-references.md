# Microbiology Culture Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
microbiology specimen culture (MC&S) examinations. These sources anchor the
four-axis interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting and communication standards

### RCPath — The communication of critical and unexpected pathology results

The Royal College of Pathologists (RCPath) best-practice recommendation on the
communication of critical and unexpected results sets out which microbiology
results must be actively (usually telephonically) communicated to the clinical
team rather than left to routine report delivery. Life-threatening infection
warrants **immediate** communication: positive blood cultures with a likely
significant pathogen, positive CSF results, and other unexpected significant
findings should be telephoned to the requesting team as soon as possible.

Key principles relevant to this form:

- **Critical-result communication** — the report must record that a critical or
  unexpected significant result was communicated and to whom; this drives the
  `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.
- **Actionable reporting** — the impression and recommended follow-up should
  guide further management (antimicrobial advice, escalation, infection-control
  action). This maps to `impression` and `recommended_follow_up` and the
  follow-up-urgency axis.

Sources:

- The communication of critical and unexpected pathology results (best-practice
  recommendation), RCPath.
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/The-communication-of-critical-and-unexpected-pathology-results.pdf>

### UKHSA / RCPath — UK Standards for Microbiology Investigations (UK SMIs)

The UK SMIs describe specimen processing, microscopy, culture, identification,
and antimicrobial susceptibility testing, and define the result interpretation
that this form records.

- **B 37 — Investigation of blood cultures** underpins the
  positive-blood-culture critical pathway and the Gram-stain-first reporting
  step (`gram_stain_result`, `culture_result`, `organism_isolated`).
- **S 12 — Sepsis and systemic or disseminated infection** frames blood-culture
  significance and the urgency of communicating a positive result.

Sources:

- UK Standards for Microbiology Investigations (UK SMIs), UKHSA / RCPath.
  <https://www.rcpath.org/profession/publications/standards-for-microbiology-investigations.html>
- UK SMI S 12 — Sepsis and systemic or disseminated infection.
  <https://www.rcpath.org/static/3f51b8e5-1ebe-469d-a79f3a3323bfaec9/uk-smi-s-12i1-1-sepsis-and-systemic-or-disseminated-infection-april-2025-pdf.pdf>

## Resistance and alert-organism categories

Key resistance markers and alert organisms drive the severity axis and the
critical-result alert:

- **MRSA** (meticillin-resistant *Staphylococcus aureus*) — `resistance_mrsa`.
- **ESBL** (extended-spectrum beta-lactamase producer) — `resistance_esbl`.
- **CPE** (carbapenemase-producing Enterobacterales) — `resistance_cpe`. CPE is a
  high-consequence alert organism with infection-control and antimicrobial
  implications; UKHSA tracks CPE through its surveillance systems and a positive
  result is treated as a critical / alert result regardless of specimen type.

Source:

- Commercial assays for the detection of acquired carbapenemases, UKHSA.
  <https://assets.publishing.service.gov.uk/media/637befee8fa8f53f41348974/commercial-assays-for-the-detection-of-acquired-carbapenemases.pdf>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCPath critical-result communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| RCPath actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCPath mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| UK SMI B 37 blood cultures / S 12 sepsis | `critical_organism`, positive `culture_result`, blood-culture critical pathway |
| UKHSA CPE alert organism | `resistance_cpe`, `critical_organism`, critical-result alert |
| Resistance markers (MRSA / ESBL / CPE) | `resistance_mrsa`, `resistance_esbl`, `resistance_cpe`, severity axis |
| Structured infection-significance category | `reporting_category` (Axis B) |

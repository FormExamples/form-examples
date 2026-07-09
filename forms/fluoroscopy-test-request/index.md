# Fluoroscopy Test Request

A UK NHS–aligned **fluoroscopy / contrast-study request (referral)** that a
clinician completes to request a fluoroscopic examination — barium studies
(swallow, meal, follow-through, enema), water-soluble contrast studies,
defecating proctogram, hysterosalpingogram, micturating cystourethrogram,
arthrogram, or a fluoroscopy-guided procedure. It records the requested study,
the clinical indication and specific question, relevant history, pregnancy and
radiation-safety context, and the requested urgency — then computes a
**four-axis grading** (appropriateness, safety + radiation dose, request
completeness, and triage priority) plus a set of safety-critical flags. The
output is a vetting report that supports the imaging department's triage and
booking decision.

This form is the contrast-fluoroscopy counterpart to the repository's other
clinician-driven imaging request forms. It is completed by a radiologist, GP,
hospital doctor, surgeon, gastroenterologist, or radiographer rather than by
the patient, and is aligned with the ACR Appropriateness Criteria, RCR iRefer
referral guidelines, and the Ionising Radiation (Medical Exposure) Regulations
(IR(ME)R).

## Scope and intended users

- **Setting:** NHS radiology / fluoroscopy department, outpatient clinic,
  inpatient ward, community service, or imaging-department triage / vetting desk.
- **Users:** radiologists, GPs, hospital doctors, surgeons, gastroenterologists,
  and radiographers who request or vet incoming fluoroscopy studies.
- **Patients:** people of any age requiring a fluoroscopic contrast examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
unsafe, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR iRefer (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Safety + radiation dose** | IR(ME)R justification; pregnancy, contrast allergy, aspiration risk, contrast-choice for suspected perforation | safety: ok / caution / contraindicated · dose: low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity-escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety contraindication (pregnancy with an ionising study, or barium chosen
when perforation is suspected) drives the **safety band** to `contraindicated`
and typically forces a `query-referrer` / `redirect` recommendation regardless
of the other axes.

### Study-type radiation-dose bands

| Study type | Dose band (typical) |
| --- | --- |
| Barium swallow / water-soluble contrast swallow | low |
| Barium meal | moderate |
| Barium follow-through | moderate |
| Barium enema | high |
| Defecating proctogram | moderate |
| Hysterosalpingogram | moderate |
| Micturating cystourethrogram | moderate |
| Arthrogram | low |
| Fluoroscopy-guided procedure | variable (screening-time dependent) |

### Contrast-choice safety (suspected perforation)

When **suspected perforation** is the indication, barium is contraindicated
(free barium causes mediastinitis / barium peritonitis); a **water-soluble
contrast** study is the safe choice. The engine flags a barium request in this
context and recommends redirecting to a water-soluble study.

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | study type, primary indication, specific clinical question, relevant history |
| 4 | Safety & radiation | pregnancy status, contrast allergy, aspiration risk, diabetes, IR(ME)R justification |
| 5 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
pregnancy, contrast-allergy, aspiration-risk,
suspected-perforation-contrast-choice, high-radiation-dose, missing-indication,
missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
fluoroscopy-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; Dysphagia and other
  gastrointestinal / fluoroscopy variants).
  <https://acsearch.acr.org/list>
- ACR Appropriateness Criteria® *Dysphagia* — fluoroscopy biphasic
  esophagram / modified barium swallow.
  <https://www.jacr.org/article/S1546-1440(19)30147-4/fulltext>
- RCR iRefer *Making the best use of clinical radiology* referral guidelines.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- IR(ME)R — Ionising Radiation (Medical Exposure) Regulations 2017
  (justification of every exposure; pregnancy considerations).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents>
- Suspected perforation: water-soluble contrast preferred over barium
  (barium peritonitis / mediastinitis risk).
  <https://www.merckmanuals.com/professional/gastrointestinal-disorders/diagnostic-and-therapeutic-gastrointestinal-procedures/radiographs-and-other-imaging-contrast-studies-of-the-gastrointestinal-tract>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / study-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form fluoroscopy-test-request
```

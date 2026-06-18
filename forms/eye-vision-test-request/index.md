# Eye Vision Test Request

A UK NHS–aligned **ophthalmic / optometric eye examination request (referral)**
that a clinician completes to request an eye vision test for a patient. It
records the requested test, the eye(s) to be examined, the clinical indication
and specific question, relevant history, symptoms and red flags, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
urgency / triage priority, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
eye-care service's triage and booking decision.

This form is the ophthalmic-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by an ophthalmologist,
optometrist, GP, orthoptist, or nurse rather than by the patient, and is aligned
with Royal College of Ophthalmologists (RCOphth) referral and acute-eye
guidance, NICE NG81 glaucoma, and the NHS Diabetic Eye Screening Programme.

## Scope and intended users

- **Setting:** NHS hospital eye service, community optometry, GP surgery,
  emergency eye clinic, or eye-care triage / vetting desk.
- **Users:** ophthalmologists, optometrists, GPs, orthoptists, and nurses who
  complete or vet incoming requests.
- **Patients:** people of any age requiring an ophthalmic eye vision test.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | RCOphth / NICE indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | RCOphth acute-eye escalation rules | triage tier: routine / urgent / emergency (+ target timeframe) |
| **C. Completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Combined acuity + risk-factor weighting | priority band: low / moderate / high |

A red-flag (sudden visual loss, retinal-detachment symptoms, acute painful red
eye, suspected giant cell arteritis) **auto-escalates** the triage tier to
emergency regardless of the other axes.

### Test types and indications

| Test type | Typical indication |
| --- | --- |
| Visual acuity | Reduced vision, baseline assessment |
| Visual fields | Suspected glaucoma, visual-field defect, neurological symptoms |
| Refraction | Reduced vision, childhood squint |
| Fundus examination | Diabetic retinopathy screening, flashes / floaters |
| Optical coherence tomography (OCT) | Suspected glaucoma, macular assessment |
| Fluorescein angiography | Diabetic retinopathy, retinal vascular disease |
| Tonometry | Suspected glaucoma, known glaucoma monitoring |
| Slit-lamp examination | Red eye, anterior-segment assessment |
| Orthoptic assessment | Childhood squint, diplopia |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | test type, laterality, primary indication, specific clinical question |
| 4 | History | relevant ocular / medical / family history |
| 5 | Symptoms & red flags | reduced vision, sudden loss, flashes / floaters, eye pain, red eye |
| 6 | Risk factors | diabetes, known glaucoma |
| 7 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
sudden-visual-loss-emergency, retinal-detachment-symptoms, acute-painful-red-eye,
suspected-giant-cell-arteritis, missing-indication, missing-clinical-question,
and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
eye-vision-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql-migrations/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- Royal College of Ophthalmologists (RCOphth) — clinical guidelines, acute eye
  and emergency referral guidance, sudden visual loss and giant cell arteritis
  as ophthalmic emergencies. <https://www.rcophth.ac.uk/>
- NICE NG81 *Glaucoma: diagnosis and management* (testing, referral filtering).
  <https://www.nice.org.uk/guidance/ng81>
- NICE QS180 *Serious eye disorders* (referral for chronic open-angle glaucoma).
  <https://www.nice.org.uk/guidance/qs180>
- NHS Diabetic Eye Screening Programme (annual / 2-yearly screening intervals).
  <https://www.gov.uk/guidance/diabetic-eye-screening-programme-overview>
- College of Optometrists — clinical management guidelines and referral
  pathways. <https://www.college-optometrists.org/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form eye-vision-test-request
```

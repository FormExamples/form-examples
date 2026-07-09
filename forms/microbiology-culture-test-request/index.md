# Microbiology Culture Test Request

A UK NHS–aligned **microbiology specimen culture / MC&S request (referral)** that
a clinician completes to order microscopy, culture, and antibiotic-sensitivity
testing (and related molecular / screening tests) on a clinical specimen. It
records the specimen and site, the requested tests, the clinical indication and
details, pre-analytical specimen handling, patient-safety factors, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
pre-analytical specimen safety, request completeness, and triage priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
laboratory's triage and acceptance decision.

This form is the microbiology-laboratory counterpart to the repository's other
clinician-driven test-request forms. It is completed by a GP, hospital doctor,
nurse, microbiologist, or other clinician rather than by the patient, and is
aligned with the UKHSA / RCPath **Standards for Microbiology Investigations
(SMI)** and **NICE NG51** (suspected sepsis).

## Scope and intended users

- **Setting:** NHS general practice, hospital ward, emergency department,
  community clinic, or microbiology-laboratory triage / vetting desk.
- **Users:** GPs, hospital doctors, nurses, microbiologists, and laboratory
  staff who vet incoming requests.
- **Patients:** any patient requiring a microbiology specimen culture.

## Scoring system

The engine grades each request on **four independent axes**. Axes are
orthogonal: a highly appropriate request can still be pre-analytically unsafe,
incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | UKHSA SMI specimen / indication match (1–9 ordinal anchor) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen safety** | SMI specimen type / timing / transport; sampling before antibiotics | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG51 sepsis escalation rules | routine / urgent / stat (+ target timeframe) |

There is **no single published 1–9 microbiology appropriateness score**, so
Axis A is anchored on **specimen-and-indication appropriateness** (analogous to
the ACR ordinal scale) using the UKHSA SMI specimen-selection guidance. Suspected
sepsis **auto-escalates** triage to *stat* regardless of the other axes.

### Specimen, test, and indication options

| Specimen types | Requestable tests | Primary indications |
| --- | --- | --- |
| blood-culture, urine, wound-swab, sputum, throat-swab, stool, csf, tissue, catheter-tip, genital-swab, other | culture-and-sensitivity (MC&S), gram-stain, acid-fast-bacilli (TB), fungal-culture, pcr-molecular, c-difficile-toxin, mrsa-screen | suspected-sepsis, urinary-tract-infection, wound-infection, respiratory-infection, gastroenteritis, meningitis, sti-screen, pyrexia-unknown-origin, infection-screening, other |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Specimen | specimen type, specimen site detail, collected?, collection date/time |
| 4 | Requested tests | culture & sensitivity, Gram stain, AFB/TB, fungal, PCR/molecular, C. difficile toxin, MRSA screen |
| 5 | Clinical context | primary indication, clinical details, fever, current antibiotics + name, recent travel, immunocompromised |
| 6 | Triage & submit | urgency, requested-by date, setting, site, notes |
| 7 | Grade & report | computed four-axis grade, safety flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **suspected-sepsis-stat** — suspected sepsis: process as stat (NICE NG51).
- **blood-culture-before-antibiotics** — blood culture requested while/after
  antibiotics started: cultures should be taken before the first dose.
- **specimen-not-collected** — request submitted but no specimen collected.
- **missing-clinical-details** — clinical details absent (highest-value field).
- **missing-indication** — no primary indication selected.
- **no-test-selected** — no test boolean is set.
- **other**.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
microbiology-culture-test-request/
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

- UKHSA / RCPath *UK Standards for Microbiology Investigations (UK SMIs)* —
  specimen selection, collection, transport, and processing; S 12 *Sepsis and
  systemic or disseminated infection*; B 37 *Investigation of blood cultures*.
  <https://www.rcpath.org/profession/publications/standards-for-microbiology-investigations.html>
- NICE NG51 *Suspected sepsis: recognition, diagnosis and early management*
  (blood cultures before antibiotics; broad-spectrum antimicrobial within 1 hour
  for high-risk criteria). <https://www.nice.org.uk/guidance/ng51>
- NHS England *Improving the blood culture pathway* (pre-analytical transport
  time; ideally onto an analyser within ~4 hours of collection).
  <https://www.england.nhs.uk/publication/improving-the-blood-culture-pathway/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / acceptance.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form microbiology-culture-test-request
```

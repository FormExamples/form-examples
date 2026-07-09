# Genetic Test Request

A UK NHS–aligned **clinical genetics / genomic test request (referral)** that a
clinician completes to request a genomic test for a patient or family. It records
the requested test type, the clinical indication and specific question, the
clinical details and phenotype, the family history, and the consent and pre-test
counselling status — then computes a **four-axis grading** (appropriateness,
consent & counselling, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the Genomic
Laboratory Hub's triage and test-selection decision.

This form is the clinical-genomics counterpart to the repository's other
clinician-driven request forms. It is completed by a clinical geneticist, genetic
counsellor, GP, oncologist, or paediatrician rather than by the patient, and is
aligned with the NHS National Genomic Test Directory eligibility criteria and
ACGS / consent-for-genomic-testing guidance.

## Scope and intended users

- **Setting:** NHS clinical genetics service, genomic laboratory hub, oncology /
  cancer genetics clinic, paediatric clinic, or community / primary care
  mainstreaming referral.
- **Users:** clinical geneticists, genetic counsellors, GPs, oncologists,
  paediatricians, and other clinicians who request genomic testing.
- **Patients:** probands and at-risk relatives of any age requiring a genomic
  test.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: an eligible request can still be incomplete
or lack documented consent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NHS National Genomic Test Directory eligibility match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Consent & counselling** | Informed-consent (Record of Discussion) + pre-test counselling check | ok / caution / not-met (mandatory-blocking for predictive / presymptomatic) |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical details, and family history weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency rules (prenatal → time-critical) | routine / urgent (+ target timeframe) |

> **Note on the 1–9 scale.** There is no single published 1–9 numerical
> genetic-ordering score. The appropriateness axis here **anchors 1–9 on the NHS
> National Genomic Test Directory eligibility criteria**: a request whose
> indication and patient clearly meet a Test Directory clinical indication (CI)
> scores 7–9; partial / borderline eligibility scores 4–6; a request with no
> matching eligible indication scores 1–3.

Consent and counselling are **mandatory** for predictive / presymptomatic
testing: if `test_type = predictive-presymptomatic` and either consent or
pre-test counselling is absent, the consent axis is **not-met** and a blocking
flag fires regardless of the other axes.

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, address |
| 3 | Requested test | test type, primary indication, specific clinical question, requested-by date |
| 4 | Clinical details | clinical details / phenotype, suspected condition, family history, affected relative tested |
| 5 | Consent & counselling | consent obtained, genetic counselling offered |
| 6 | Specimen & triage | specimen type, urgency, setting, notes; computed four-axis grade, flags, recommendation |

## Test types

diagnostic-single-gene, gene-panel, whole-exome, whole-genome,
chromosomal-microarray, karyotype, predictive-presymptomatic, carrier-testing,
pharmacogenomic, prenatal, other.

## Primary indications

suspected-genetic-disorder, familial-cancer, developmental-delay,
congenital-anomaly, cardiomyopathy-arrhythmia, neuromuscular,
predictive-family-history, carrier-screening, prenatal-diagnosis,
pharmacogenomics, other.

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
predictive-test-counselling-required, consent-not-obtained,
prenatal-time-critical, missing-family-history, missing-indication,
missing-clinical-details, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
genetic-test-request/
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
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NHS England — The National Genomic Test Directory (clinical indications and
  testing criteria for rare and inherited disease, and for cancer).
  <https://www.england.nhs.uk/genomics/the-national-genomic-test-directory/>
- NHS England — National Genomic Test Directory: testing criteria for rare and
  inherited disease (eligibility criteria PDF).
  <https://www.england.nhs.uk/wp-content/uploads/2024/07/national-genomic-test-directory-rare-and-inherited-disease-eligibility-criteria-v7.pdf>
- NHS Genomics Education Programme — The National Genomic Test Directory
  (knowledge hub). <https://www.genomicseducation.hee.nhs.uk/genotes/knowledge-hub/the-national-genomic-test-directory/>
- ACGS / mainstreaming genomic testing — pre-test counselling and informed
  consent. <https://pubmed.ncbi.nlm.nih.gov/38479398/>
- Quality in genetic counselling for presymptomatic testing — clinical
  guidelines for practice. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3573206/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form genetic-test-request
```

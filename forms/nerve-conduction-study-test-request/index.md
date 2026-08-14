# Nerve Conduction Study Test Request

A UK NHS–aligned **nerve conduction study / EMG (electrodiagnostic) request
(referral)** that a clinician completes to request a neurophysiology
examination. It records the requested study (nerve conduction, needle EMG,
or both), the anatomical region and laterality, the clinical indication and
specific question, symptoms and their duration, and the safety factors that
matter for needle EMG and electrical stimulation — then computes a **four-axis
grading** (appropriateness, procedural risk, request completeness, and triage
priority) plus a set of safety-critical flags. The output is a vetting report
that supports the neurophysiology department's triage and booking decision.

This form is the electrodiagnostic / neurophysiology counterpart to the
repository's other clinician-driven request forms. It is completed by a
neurologist, neurophysiologist, GP, hospital doctor, or rheumatologist rather
than by the patient, and is aligned with AANEM and AAN evidence-based
electrodiagnostic practice parameters (carpal tunnel syndrome, distal symmetric
polyneuropathy) and ACR Appropriateness Criteria.

## Scope and intended users

- **Setting:** NHS neurology / neurophysiology clinic, rheumatology clinic,
  general practice, hospital ward, or neurophysiology-department triage /
  vetting desk.
- **Users:** neurologists, neurophysiologists, GPs, hospital doctors,
  rheumatologists, and the clinical neurophysiology team who vet incoming
  requests.
- **Patients:** adults presenting with numbness, weakness, pain, or tingling
  suggestive of a peripheral nerve, root, plexus, neuromuscular-junction, or
  muscle disorder.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, procedurally risky, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | AANEM / AAN electrodiagnostic practice parameters (1–9 ordinal, indication match) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Procedural risk** | Needle EMG against anticoagulation / cardiac device | low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist; indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent (+ target timeframe) |

A suspected **motor neurone disease** indication **auto-escalates** the triage
tier to urgent regardless of the other axes, because early electrodiagnostic
confirmation changes management and access to disease-modifying therapy.

### Study type and indication mapping

| Indication | Typical study | Region | AANEM / AAN basis |
| --- | --- | --- | --- |
| Carpal tunnel | Nerve conduction (± confirmatory EMG) | Upper limb | Practice parameter: electrodiagnostic studies in CTS |
| Peripheral neuropathy | Nerve conduction + EMG | Lower limb / all-limbs | Practice parameter: distal symmetric polyneuropathy |
| Radiculopathy | EMG (± nerve conduction) | Upper / lower limb | Needle EMG most specific for root level |
| Suspected motor neurone disease | Nerve conduction + EMG | Generalized | EMG for diffuse denervation; expedite |
| Myopathy | EMG | Generalized / limb | Needle EMG myopathic units |
| Plexopathy | Nerve conduction + EMG | Upper / lower limb | Localize plexus vs root vs nerve |
| Suspected myasthenia | Repetitive stimulation | Cranial / upper limb | Decrement on repetitive stimulation |
| Nerve injury | Nerve conduction + EMG | Affected limb | Localize and grade axonal loss |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested study | study type, region, laterality, requested-by date |
| 4 | Indication & question | primary indication, specific clinical question, relevant history |
| 5 | Symptoms | numbness, weakness, pain, tingling, symptom duration |
| 6 | Safety | diabetes, anticoagulant, pacemaker / ICD |
| 7 | Triage & submit | requested urgency, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **suspected-mnd-urgent** — suspected motor neurone disease; expedite.
- **anticoag-emg-bleeding-risk** — needle EMG requested while anticoagulated.
- **pacemaker-stimulation-caution** — pacemaker / ICD present; stimulation
  technique caution.
- **missing-indication** — no primary indication recorded.
- **missing-clinical-question** — no specific clinical question recorded.
- **other** — any other free-text safety concern.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
nerve-conduction-study-test-request/
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

- AANEM / AAN / AAPM&R Practice Parameter: *Electrodiagnostic studies in carpal
  tunnel syndrome* (summary statement; reaffirmed). <https://pubmed.ncbi.nlm.nih.gov/12115985/>
  and <https://www.aanem.org/docs/default-source/documents/cts_reaffirmed.pdf>
- AAN / AANEM / AAPM&R Practice Parameter: *Evaluation of distal symmetric
  polyneuropathy* (an evidence-based review).
  <https://www.neurology.org/doi/10.1212/01.wnl.0000336370.51010.a1> and
  <https://pubmed.ncbi.nlm.nih.gov/19056666/>
- AANEM professional practice and quality measures (carpal tunnel quality
  measure set). <https://www.aanem.org/>
- ACR Appropriateness Criteria (1–9 rating scale).
  <https://acsearch.acr.org/list>
- NICE / NHS England neurophysiology referral and electrodiagnostic guidance.
  <https://www.nice.org.uk/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / study-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form nerve-conduction-study-test-request
```

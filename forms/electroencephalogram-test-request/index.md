# Electroencephalogram Test Request

A UK NHS–aligned **electroencephalogram (EEG) request (referral)** that a
clinician completes to request a recording of the brain's electrical activity,
most often to support the diagnosis and classification of epilepsy and
seizures. It records the requested EEG type, the clinical indication and
specific question, the seizure / epilepsy context, current antiepileptic
therapy, and the requested urgency — then computes a **four-axis grading**
(appropriateness, urgency, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
neurophysiology department's triage and booking decision.

This form is the neurophysiology counterpart to the repository's other
clinician-driven request forms. It is completed by a neurologist, GP, hospital
doctor, paediatrician, or clinical physiologist rather than by the patient, and
is aligned with NICE NG217 (*Epilepsies in children, young people and adults*)
and ILAE practice for the role and limitations of EEG.

## Scope and intended users

- **Setting:** NHS neurology clinic, first-seizure clinic, paediatric
  neurology, acute medical / inpatient ward, community neurology, or clinical
  neurophysiology triage / vetting desk.
- **Users:** neurologists, GPs, hospital doctors, paediatricians, and clinical
  physiologists who vet incoming requests.
- **Patients:** people of any age presenting with seizures, suspected epilepsy,
  encephalopathy, or other indications for EEG.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG217 epilepsy / ILAE EEG role (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | Red-flag escalation rules | triage tier: routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Acuity weighting of indication + context | priority band: low / moderate / high |

**Key NICE NG217 principle:** an EEG *supports* a diagnosis of epilepsy and
helps classify seizure type / syndrome, but it must **not** be used to *exclude*
a diagnosis of epilepsy, nor be used in isolation. Suspected **status
epilepticus** auto-escalates urgency to emergency regardless of the other axes.

### EEG types and indications

| EEG type | Typical use |
| --- | --- |
| Routine awake | First-line study to support diagnosis and classify seizure type / syndrome |
| Sleep-deprived | Increases yield of interictal epileptiform discharges when routine EEG non-diagnostic |
| Ambulatory 24-hour | Outpatient capture of events / interictal discharges over a longer window |
| Video-telemetry | Inpatient long-term video-EEG to characterise events and classify the syndrome |

| Indication | Notes |
| --- | --- |
| Suspected epilepsy | Support diagnosis after a clinically suspected epileptic seizure |
| Seizure classification | Classify seizure type / epilepsy syndrome |
| Status epilepticus | Suspected / ongoing status — emergency |
| Encephalopathy | Diffuse cerebral dysfunction, including non-convulsive status |
| First seizure | First unprovoked seizure work-up |
| Funny turns | Differentiate epileptic from non-epileptic events |
| Dementia | Selected cognitive / encephalopathic presentations |
| Pre-surgical evaluation | Localisation for epilepsy surgery work-up |
| Medication review | Antiepileptic drug withdrawal / treatment decisions |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | EEG type, primary indication, specific clinical question |
| 4 | Seizure / epilepsy context | seizure frequency, first seizure, known epilepsy, current antiepileptics, relevant history |
| 5 | Red flags | recent seizure, suspected status epilepticus |
| 6 | Triage | requested urgency, requested-by date, setting, site |
| 7 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-status-epilepticus, recent-first-seizure, encephalopathy,
eeg-not-to-exclude-epilepsy (fires when the clinical question implies the EEG
is being used to rule out epilepsy), missing-indication,
missing-clinical-question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
electroencephalogram-test-request/
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

- NICE NG217 *Epilepsies in children, young people and adults* — routine EEG to
  support diagnosis and classify seizure type / syndrome; **do not use EEG to
  exclude a diagnosis of epilepsy**, nor in isolation.
  <https://www.nice.org.uk/guidance/ng217>
- ILAE — *Minimum standards for long-term video-EEG monitoring* (joint ILAE /
  IFCN clinical practice guideline); classification of the epilepsy syndrome.
  <https://www.ilae.org/guidelines/guidelines-and-reports/proposed-guideline-minimum-standards-for-long-term-video-eeg-monitoring>
- ILAE classification and definition of epilepsy syndromes (Task Force on
  Nosology and Definitions).
  <https://onlinelibrary.wiley.com/doi/10.1111/epi.17241>
- Ambulatory EEG to classify the epilepsy syndrome / first single unprovoked
  seizure. <https://pubmed.ncbi.nlm.nih.gov/33661784/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / EEG-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form electroencephalogram-test-request
```

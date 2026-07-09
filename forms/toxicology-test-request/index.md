# Toxicology Test Request

A UK NHS–aligned **toxicology / poisons / therapeutic-drug-level blood-test
request (referral)** that a clinician completes to request one or more
toxicology assays — paracetamol, salicylate, alcohol, drugs-of-abuse screen,
lithium, digoxin, antiepileptic drug levels, carboxyhaemoglobin, heavy metals,
or a named specific drug level. It records the requested assays, the clinical
indication, the suspected agent and ingestion timing, whether the exposure is a
deliberate overdose, and the requested urgency — then computes a **four-axis
grading** (appropriateness, ingestion-timing validity, request completeness,
and triage priority) plus a set of safety-critical flags. The output is a
vetting report that supports the laboratory's and toxicology team's triage
decision.

This form is the clinical-toxicology counterpart to the repository's other
clinician-driven request forms (it shares the multi-test-as-booleans pattern
with **blood test request**). It is completed by a GP, hospital doctor,
emergency physician, toxicologist, or nurse rather than by the patient, and is
aligned with TOXBASE / NPIS guidance, MHRA paracetamol-overdose management
(treatment nomogram interpretable only at ≥ 4 h post-ingestion), and RCEM
toxicology best-practice guidance.

## Scope and intended users

- **Setting:** emergency department, acute medical unit, inpatient ward, GP
  surgery, occupational-health clinic, or laboratory / toxicology vetting desk.
- **Users:** GPs, hospital doctors, emergency physicians, clinical
  toxicologists, and nurses who request or vet toxicology assays.
- **Patients:** people with a suspected or confirmed overdose, poisoning,
  therapeutic-drug-monitoring need, or substance / occupational screen.

## Requested assays

Modelled as **BOOLEAN** columns on the main request (at least one should be
selected; none selected fires the *no-test-selected* flag):

| Assay | Notes |
| --- | --- |
| Paracetamol level | Interpretable on the treatment nomogram only at **≥ 4 h** post-ingestion |
| Salicylate level | Aspirin; serial levels in significant ingestion |
| Alcohol level | Blood ethanol |
| Drugs-of-abuse screen | Opiates, benzodiazepines, cocaine, amphetamines, etc. |
| Lithium level | Therapeutic monitoring and toxicity |
| Digoxin level | Therapeutic monitoring and toxicity |
| Antiepileptic drug level | Phenytoin, carbamazepine, valproate, etc. |
| Carboxyhaemoglobin | Carbon-monoxide exposure |
| Heavy metals | Lead, mercury, arsenic, etc. |
| Specific drug level | Named agent given in *suspected agent* |

## Scoring system

The engine grades each request on **four independent axes**. Axes are
orthogonal: a highly appropriate request can still be mistimed, incomplete, or
require stat handling.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | TOXBASE / NPIS indication-to-assay match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Timing** | Ingestion-time validity (e.g. paracetamol nomogram ≥ 4 h) | ok / caution / invalid |
| **C. Completeness** | Mandatory-field checklist, clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage** | Acuity-escalation rules | routine / urgent / stat (+ target timeframe) |

A deliberate overdose or a symptomatic patient **auto-escalates** the triage
tier to `stat` regardless of the other axes.

> **Note on the 1–9 scale.** There is no single published toxicology-ordering
> appropriateness score. The 1–9 axis here is anchored on TOXBASE / NPIS
> indication-to-assay match and ingestion-timing validity, and is treated as
> clinical decision support, not a validated instrument.

### Timing validity (Axis B)

| Band | Meaning |
| --- | --- |
| ok | Assay can be interpreted at the stated ingestion time |
| caution | Borderline or serial sampling advisable (e.g. staggered ingestion) |
| invalid | Cannot be interpreted — e.g. paracetamol level taken < 4 h post-ingestion (UK nomogram starts at 4 h / 100 mg/L) |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested assays | paracetamol, salicylate, alcohol, drugs-of-abuse, lithium, digoxin, antiepileptic, carboxyhaemoglobin, heavy metals, specific drug |
| 4 | Clinical context | primary indication, clinical details, suspected agent, time since ingestion, deliberate overdose, symptomatic |
| 5 | Specimen | specimen collected, collection date-time |
| 6 | Triage & submit | urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **suspected-overdose-stat** — overdose context requiring stat handling.
- **paracetamol-timing-critical** — paracetamol level requested but sampling
  time invalid (< 4 h post-ingestion) for nomogram interpretation.
- **deliberate-self-harm-safeguarding** — deliberate overdose / self-harm;
  requires psychosocial / safeguarding assessment.
- **specimen-not-collected** — request submitted with no specimen collected.
- **missing-clinical-details** — clinical details absent.
- **no-test-selected** — no assay boolean is set.
- **other**

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
toxicology-test-request/
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

- **TOXBASE** — the National Poisons Information Service (NPIS) clinical
  toxicology database; primary UK decision-support resource (NPIS 0344 892 0111).
  <https://www.toxbase.org/>
- **MHRA / NPIS paracetamol-overdose management** — UK treatment nomogram lowered
  to start at 100 mg/L (660 µmol/L) at 4 h; levels are **not interpretable
  before 4 h** post-ingestion. RCEM paracetamol-overdose guidance:
  <https://rcem.ac.uk/wp-content/uploads/2021/10/Paracetamol_Overdose_Jan2013.pdf>
- **RCEM** — *Management of Patients with Suspected but Unidentified Poisoning in
  the Emergency Department* (2025) and the Toxicology Special Interest Group
  guidance. <https://rcem.ac.uk/>
- **RCEMLearning** — Pharmacology and Poisoning.
  <https://www.rcemlearning.co.uk/pharmacology-and-poisoning/>
- Deliberate self-poisoning patients require a psychosocial assessment by a
  specialist mental health professional while in hospital.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / assay selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form toxicology-test-request
```

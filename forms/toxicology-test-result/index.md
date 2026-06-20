# Toxicology Test Result

A UK NHS–aligned **toxicology / poisons / therapeutic-drug-level test result
(report)** that a reporting clinician completes after a toxicology assay has been
performed. It is the **result/report counterpart** to *Toxicology Test Request*
(a referral / vetting form): where the request captures which assays should be
done and whether they are appropriate and well timed, this form records what the
assays **found** — the measured **result values** — and a structured
**interpretation**. It records the specimen condition, the clinical history and
suspected agent, the assay levels (paracetamol, salicylate, ethanol, lithium,
digoxin, carboxyhaemoglobin, a drugs-of-abuse screen, and a named specific drug),
the paracetamol-nomogram interpretation, the overall result status, the narrative
findings and impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured toxicology report.

This form is the clinical-toxicology result counterpart to the repository's other
clinician-driven result forms, and mirrors the `ct-scan-test-result` gold
template. It is completed by a clinical biochemist, toxicologist, emergency
physician, or other reporting clinician rather than by the patient, and is
aligned with TOXBASE / NPIS guidance, the MHRA paracetamol-overdose treatment
nomogram (interpretable only at ≥ 4 h post-ingestion; a single 100 mg/L treatment
line), and RCEM toxicology best-practice guidance.

## Scope and intended users

- **Setting:** clinical-biochemistry / toxicology laboratory, emergency
  department, acute medical unit, or poisons-information reporting workflow.
- **Users:** clinical biochemists, clinical toxicologists, emergency physicians,
  and other reporting clinicians who interpret and sign toxicology reports.
- **Patients:** any patient who has undergone a toxicology, poisons, or
  therapeutic-drug-level assay.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this assay, is it
appropriate, and is the timing valid?*. A **result** form is retrospective and
records *what did the assay measure, and what does it mean?*. Accordingly the
source-of-truth table here is `toxicology_test_result`, the reporting clinician
is the report **author/signer** (not a requester), and the grade engine
interprets result values rather than vetting a request.

## Result values

Captured as numeric assay levels on the main result, alongside narrative and
screen fields:

| Result value | Column | Note |
| --- | --- | --- |
| Paracetamol level | `paracetamol_level_mg_l` | mg/L; plot on the UK treatment nomogram only at ≥ 4 h |
| Salicylate level | `salicylate_level_mg_l` | mg/L; aspirin |
| Ethanol level | `ethanol_level` | blood alcohol, laboratory units |
| Lithium level | `lithium_level_mmol_l` | mmol/L; narrow therapeutic range |
| Digoxin level | `digoxin_level` | laboratory units (e.g. ng/mL) |
| Carboxyhaemoglobin | `carboxyhaemoglobin_percent` | % saturation; carbon monoxide |
| Drugs-of-abuse screen | `drugs_of_abuse_screen` | narrative screen result |
| Specific drug level | `specific_drug_level` | named agent narrative |

## Interpretation grading

The engine grades each result on **four independent axes**. Axes are orthogonal:
a complete, well-structured report can still describe a toxic, critical result.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Toxic-threshold + structured descriptor (e.g. paracetamol-nomogram band, therapeutic / toxic range) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, specimen condition, result values, interpretation, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **toxic result** — paracetamol level **above the treatment line**, or any
`toxic_level_present` — **auto-escalates** Axis D to *critical-alert*, sets an
urgent antidote action (start **N-acetylcysteine / NAC** for paracetamol), and
raises the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Interpretation fields

`paracetamol_nomogram` (above-treatment-line / below-treatment-line /
not-applicable), `overall_result_status` (normal / abnormal / critical), and the
boolean `toxic_level_present` drive classification, severity, and the
critical-result alert. `time_since_ingestion_hours` is required to interpret the
paracetamol nomogram.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen & history | specimen condition, clinical history, suspected agent, time since ingestion |
| 3 | Result values | paracetamol, salicylate, ethanol, lithium, digoxin, carboxyhaemoglobin, drugs-of-abuse screen, specific drug |
| 4 | Interpretation | paracetamol nomogram, overall result status, toxic level present, findings narrative |
| 5 | Impression | impression, reporting category, recommended follow-up |
| 6 | Critical communication | critical result communicated, reported to |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** toxicology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
toxicology-test-result/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  spec/                             # living spec
  doc/                              # clinical reference documentation
  sql/                              # PostgreSQL migrations (source of truth)
  xml/                              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  typespec/                         # TypeSpec API definitions (generated)
  front-end-with-svelte/            # SvelteKit single-page wizard
  back-end-with-loco/               # Rust axum + Loco JSON API
```

## Clinical references

- **TOXBASE** — the National Poisons Information Service (NPIS) clinical
  toxicology database; primary UK decision-support resource (NPIS 0344 892 0111).
  <https://www.toxbase.org/>
- **MHRA / NPIS paracetamol-overdose management** — the UK treatment nomogram was
  lowered (MHRA directive, 2012) to a single line starting at 100 mg/L
  (660 µmol/L) at 4 h; levels are **not interpretable before 4 h** post-ingestion.
  N-acetylcysteine (NAC) is the antidote of choice, near-100 % effective within
  8 h.
  <https://www.cem.scot.nhs.uk/adult/paracetamoltreat.pdf>
- **RCEM** — *Management of Patients with Suspected but Unidentified Poisoning in
  the Emergency Department* and Toxicology Special Interest Group guidance.
  <https://rcem.ac.uk/>
- Therapeutic / toxic thresholds: lithium toxicity from ≈ 1.5 mmol/L; digoxin
  toxicity above the therapeutic range; carboxyhaemoglobin poisoning generally
  > 10 %.

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management (e.g. antidote administration).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form toxicology-test-result
```

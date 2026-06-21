# Lumbar Puncture Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
lumbar puncture (LP) / cerebrospinal-fluid (CSF) analysis. These sources anchor
the four-axis interpretation grade, the CSF pattern classification, and the
critical-result alerting rules used by this form.

## CSF interpretation patterns

CSF analysis is interpreted as a profile across the measured parameters —
opening pressure, appearance, white and red cell counts (and the differential),
protein, glucose (against paired serum glucose), and lactate — rather than from
any single value. The classic reference patterns are:

| Pattern | Appearance | WCC predominance | Protein | Glucose ratio | Lactate |
| --- | --- | --- | --- | --- | --- |
| Normal | clear | < 5/µL | 0.15–0.45 g/L | ≈ 0.6 | < 2.1 mmol/L |
| Bacterial meningitis | cloudy / turbid | neutrophils | raised | low (< 0.4) | raised (> 3.5) |
| Viral / aseptic meningitis | clear | lymphocytes | normal / mildly raised | normal | normal |
| Subarachnoid haemorrhage | blood-stained / xanthochromic | mildly raised | raised | normal | normal |
| Inflammatory / demyelinating | clear | mild lymphocytes | normal / mildly raised | normal | normal (oligoclonal bands may be positive) |

The form stores the raw measurements plus structured interpretive booleans
(`raised_protein`, `pleocytosis`, `low_glucose`, `bacterial_meningitis_pattern`,
`viral_pattern`, `subarachnoid_haemorrhage_suggested`, `normal_csf`) that the
grade engine uses to derive the classification, severity, and `reporting_category`.

- Cerebrospinal fluid (CSF) interpretation — reference patterns.
  <https://geekymedics.com/cerebrospinal-fluid-csf-interpretation/>

## Bacterial meningitis

### NICE NG240

NICE NG240 covers recognition, diagnosis and management of bacterial meningitis
and meningococcal disease. CSF analysis (cell count and differential, protein,
glucose with paired serum glucose, Gram stain, culture, and meningococcal /
pneumococcal PCR) is central to confirming the diagnosis and distinguishing
bacterial from viral aetiology. Antibiotics and blood cultures must **not** be
delayed for the lumbar puncture or its results. A **bacterial meningitis
pattern** (neutrophil pleocytosis, raised protein, low CSF:serum glucose ratio,
raised lactate) and a **positive CSF culture** are critical results that must be
communicated to the responsible clinician — driving the
`critical_result_communicated` / `reported_to` fields and the
`critical-result-alert` safety flag.

- NICE NG240 *Meningitis (bacterial) and meningococcal disease: recognition,
  diagnosis and management*. <https://www.nice.org.uk/guidance/ng240>

## Subarachnoid haemorrhage and xanthochromia

### UK NEQAS national CSF bilirubin guidelines

In a patient with a negative CT brain, CSF xanthochromia is the second-line test
of choice to exclude subarachnoid haemorrhage when performed **≥ 12 h after
headache onset**, allowing time for oxyhaemoglobin to be converted to bilirubin
in vivo. The UK NEQAS revised national guidelines specify that
**spectrophotometry** must always be used in preference to visual inspection,
and define how net bilirubin absorbance is interpreted. A **positive
xanthochromia** result (and/or a red-cell pattern suggesting SAH) is a critical
result that auto-escalates the follow-up urgency and raises the
`critical-result-alert` flag. This underpins the `xanthochromia`,
`subarachnoid_haemorrhage_suggested`, and `csf_red_cell_count` fields.

- UK NEQAS — *Revised national guidelines for analysis of cerebrospinal fluid
  for bilirubin in suspected subarachnoid haemorrhage*.
  <https://pubmed.ncbi.nlm.nih.gov/18482910/>
- Evaluation of the revised UK-NEQAS CSF-xanthochromia method for subarachnoid
  haemorrhage. <https://pubmed.ncbi.nlm.nih.gov/39467816/>
- CSF spectrophotometric scanning for suspected subarachnoid haemorrhage — a
  narrative review. <https://jlpm.amegroups.org/article/view/6745/html>

## Specialist tests

- **Oligoclonal bands** — CSF-restricted oligoclonal bands support an
  inflammatory / demyelinating process (e.g. multiple sclerosis); stored in
  `oligoclonal_bands`.
- **PCR / molecular** — meningococcal, pneumococcal, herpes simplex, and
  enterovirus PCR refine the aetiology; stored in `pcr_result`.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| CSF interpretation patterns | `csf_appearance`, `csf_white_cell_count`, `csf_protein_g_l`, `csf_glucose_mmol_l`, `csf_serum_glucose_ratio`, `csf_lactate_mmol_l`, structured booleans, `reporting_category` (Axis B) |
| NICE NG240 bacterial meningitis | `bacterial_meningitis_pattern`, `gram_stain_result`, `culture_result`, `pcr_result`, `critical-result-alert` flag |
| UK NEQAS xanthochromia / SAH | `xanthochromia`, `subarachnoid_haemorrhage_suggested`, `csf_red_cell_count`, `critical-result-alert` flag |
| Critical-result communication | `critical_result_communicated`, `reported_to`, follow-up-urgency axis |
| Oligoclonal bands (demyelination) | `oligoclonal_bands` |

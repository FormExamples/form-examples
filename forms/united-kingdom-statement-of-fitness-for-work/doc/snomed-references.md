# SNOMED CT References

The fit note records a diagnosis as free text plus an optional SNOMED CT
concept code. The clinical terminology service is out of scope for this
implementation; the front-end collects the SNOMED code as a 6–18-digit
string and validates with a checksum.

## Subset

NHS Digital publishes a *Fit Note SNOMED CT subset* for primary care.
The most common concept families used in fit notes are listed below.
These are illustrative; the implementation does not bundle the subset.

| Concept group | Example SNOMED code | Example display |
| --- | --- | --- |
| Mental and behavioural | `35489007` | Depressive disorder |
| Musculoskeletal | `161891005` | Backache |
| Respiratory | `13645005` | Chronic obstructive lung disease |
| Cardiovascular | `194828000` | Angina |
| Neoplasms | `363346000` | Malignant neoplastic disease |
| Infections | `840539006` | Disease caused by 2019-nCoV (COVID-19) |
| Injury | `283371007` | Sprain of ankle |
| Pregnancy and postpartum | `289908002` | Antenatal depression |
| Long-term limiting illness | `161469003` | History of chronic illness |

## Implementation note

The grader's `mental_health_condition` and `automatic_disability` flags rely
on coarse category matching rather than precise SNOMED traversal. A future
enhancement (see `plan.md`) is to integrate the NHS Digital terminology
service so that diagnoses are mapped to canonical SNOMED concepts and
disability status is derived from the SNOMED hierarchy.

## Further reading

- NHS Digital. *SNOMED CT UK Primary Care Refset for Fit Notes*.
- NHS Digital. *UK SNOMED CT Browser*.
- DWP. *Fit Note: SNOMED CT code adoption — primary care*.

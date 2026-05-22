# Diagnosis Coding — SNOMED CT and ICD-10

The Return to Work form records the primary reason for absence in
three parallel forms:

1. Clinician free-text (`return_to_work.primary_diagnosis_text`).
2. SNOMED CT concept ID
   (`return_to_work.primary_diagnosis_snomed`).
3. ICD-10 code (`return_to_work.primary_diagnosis_icd10`).

The free-text field is mandatory and is what appears on the printed
fit note. The coded fields are optional but recommended for FHIR
interoperability with hospital EHRs and for downstream
occupational-health audit.

## Common SNOMED CT concepts for fit notes

| Mechanism | SNOMED CT | Concept |
| --- | --- | --- |
| Acute upper respiratory infection | 54150009 | Acute upper respiratory infection |
| Influenza | 6142004 | Influenza |
| COVID-19 | 840539006 | Disease caused by SARS-CoV-2 |
| Anxiety | 48694002 | Anxiety |
| Depressive disorder | 35489007 | Depressive disorder |
| Mixed anxiety and depressive disorder | 231504006 | Mixed anxiety and depressive disorder |
| Lower back pain | 279039007 | Low back pain |
| Sciatica | 23056005 | Sciatica |
| Migraine | 37796009 | Migraine |
| Post-surgical recovery | 269742008 | Recovery from surgery |
| Concussion | 110030002 | Concussion injury of brain |
| Fracture (long bone) | 125605004 | Fracture of bone |
| Pregnancy-related illness | 77386006 | Pregnant |
| Cancer treatment recovery | 363346000 | Malignant neoplastic disease |
| Cardiovascular event recovery | 22298006 | Myocardial infarction |

## ICD-10 mapping (UK 5th edition)

| Mechanism | ICD-10 |
| --- | --- |
| Acute upper respiratory infection | J06.9 |
| Influenza | J11.1 |
| COVID-19 | U07.1 |
| Anxiety | F41.9 |
| Depressive disorder | F32.9 |
| Mixed anxiety and depressive disorder | F41.2 |
| Lower back pain | M54.5 |
| Sciatica | M54.3 |
| Migraine | G43.9 |
| Post-surgical recovery | Z48.8 |
| Concussion | S06.0 |
| Fracture of bone | T14.2 |
| Pregnancy-related illness | O26.9 |
| Cancer treatment recovery | Z51.1 |
| Myocardial infarction | I21.9 |

## Mental-health subset

The following SNOMED CT codes trigger the *mental-health diagnosis
without follow-up* flag if no review date is recorded:

- 35489007 — Depressive disorder
- 48694002 — Anxiety
- 231504006 — Mixed anxiety and depressive disorder
- 47505003 — Post-traumatic stress disorder
- 197480006 — Anxiety state
- 13746004 — Bipolar disorder
- 191736004 — Obsessive-compulsive disorder

## Pregnancy-related subset

SNOMED CT 77386006 (Pregnant) or any concept descended from
118185001 (Finding related to pregnancy) triggers the
*pregnancy-related absence with no maternity flag* flag if the
patient has no MAT B1 reference on file.

## See also

- NHS Digital. *SNOMED CT UK Edition release notes.*
- World Health Organisation. *International Statistical
  Classification of Diseases and Related Health Problems, 10th
  Revision.*

# UK Statement of Fitness for Work (Med 3) — Cross-walk

The UK DWP *Statement of Fitness for Work* — commonly called the
**fit note** and historically the **Med 3** — is the statutory
medical certificate issued to a patient who has been absent from
work for more than seven calendar days. Since July 2022 it can be
issued by any of the following registered professionals who have
assessed the patient:

- general practitioner (GP)
- hospital doctor
- registered nurse
- occupational therapist
- pharmacist
- physiotherapist

## Form anatomy

The official Med 3 has three sections. The Return to Work form
captures the same data in a structured, machine-readable form:

| Med 3 section | Med 3 field | Return to Work step | SQL column |
| --- | --- | --- | --- |
| Patient particulars | Name | Step 2 | `patient.name` |
| | Date of birth | Step 2 | `patient.birth_date` |
| Healthcare professional opinion | Reason | Step 5 | `return_to_work.primary_diagnosis_text`, `return_to_work.primary_diagnosis_snomed`, `return_to_work.primary_diagnosis_icd10` |
| | Assessment date | Step 1 | `return_to_work.assessment_date` |
| | Case-by-case adjustments | Step 10 | `return_to_work_restriction` rows |
| Fitness statement | "Not fit for work" tick-box | Step 8 | `return_to_work.fitness_statement = 'not-fit'` |
| | "May be fit for work" tick-box | Step 8 | `return_to_work.fitness_statement = 'may-be-fit'` |
| | Phased return | Step 9 | `return_to_work.phased_return_applicable = 'yes'` |
| | Amended duties | Step 10 | `return_to_work_restriction.kind = 'amended-duties'` |
| | Altered hours | Step 10 | `return_to_work_restriction.kind = 'altered-hours'` |
| | Workplace adaptations | Step 10 | `return_to_work_restriction.kind = 'workplace-adaptations'` |
| | Period of validity | Step 8 | `return_to_work.valid_from`, `return_to_work.valid_until` |
| | Reassessment required | Step 8 | `return_to_work.reassessment_required` |
| Sign-off | Profession | Step 1 | `clinician.role` |
| | Signature | Step 12 | `return_to_work.signature_svg`, `return_to_work.signed_at` |
| | Practice address | Step 1 | `clinician.postal_address_as_full_text` |

There is **no** "fit for work" tick-box on the official Med 3 — an
employee returning to full duties does so without the certificate
being re-issued. The Return to Work form supports a "fit" outcome
explicitly because some employers require a positive medical
clearance letter before allowing the employee back; in that case
the output is rendered as a *medical clearance letter* rather than
as a Med 3.

## Period of validity rules

| Length of incapacity | Max period of a single certificate |
| --- | --- |
| First 6 months of the period of incapacity | 3 months |
| After 6 months of incapacity | Indefinite ("until further notice") |

A *case-by-case* certificate (i.e. one issued where reasonable
adjustments are likely to allow a return to work with adjustments)
should typically be reviewed in 1-4 weeks.

## See also

- UK gov.uk. *Fit note: guidance for healthcare professionals.*
  <https://www.gov.uk/government/publications/fit-note-guidance-for-healthcare-professionals>
- UK DWP. *Fit note: changes from 1 July 2022.*
- DHSC. *Digital fit notes (eMed 3) on the GP IT system.*

# UK GOS3 Form Mapping

The **NHS General Ophthalmic Services (GOS) form 3** ("GOS3") is the
voucher issued to a patient eligible for NHS-funded spectacles in
England. This document maps the eye-prescription form's structured data
to the legacy GOS3 paper layout for backwards compatibility.

> **Status:** mapping documented; automated GOS3 PDF generation is a
> deferred feature (see `tasks.md`).

## GOS3 fields

| GOS3 field | This form's source |
| --- | --- |
| Patient name | `patient.name` |
| Patient address | `patient.postal_address_as_full_text` + `patient.postcode` |
| Date of birth | `patient.birth_date` |
| NHS number | `patient.united_kingdom_nhs_number` |
| Date of sight test | `eye_prescription.examination_date` |
| Reason for entitlement | not captured (would need a `gos_entitlement_reason` enum on `eye_prescription`) |
| Prescription valid until | `eye_prescription.expiry_date` |
| Right eye SPH | `eye_prescription_eye.sphere_diopters` (eye = right) |
| Right eye CYL | `eye_prescription_eye.cylinder_diopters` (eye = right) |
| Right eye Axis | `eye_prescription_eye.axis_degrees` (eye = right) |
| Right eye Prism | `eye_prescription_eye.prism_*` (eye = right) |
| Right eye Base | `eye_prescription_eye.base_*` (eye = right) |
| Right eye Add | `eye_prescription_eye.addition_diopters` (eye = right) |
| Left eye SPH / CYL / Axis / Prism / Base / Add | same fields, eye = left |
| Interpupillary distance | `eye_prescription_pupillary_distance.distance_total_mm` |
| Prescriber signature | `eye_prescription_grade.signed_at` (electronic) |
| Prescriber GOC number | `prescriber.goc_registration_number` |
| Practice name + address | `prescriber.practice_name` + `prescriber.practice_address` |
| Practice ODS code | not captured (would need an `ods_code` column on `prescriber`) |

## Eligibility categories (GOS3 entitlement)

If GOS3 generation is implemented, the form would need to capture one of
the following reasons:

- Under 16
- 16–18 in full-time education
- Income-based benefit recipient (Income Support, JSA, ESA, Universal
  Credit with low income, Pension Credit Guarantee)
- HC2 / HC3 certificate holder
- Diagnosis of glaucoma or considered at risk by an ophthalmologist
- Aged 40+ and a close relative of a person with glaucoma
- Diagnosis of diabetes
- War pension / armed forces compensation

The mapping would store this as a `gos_entitlement_reason` enum on
`eye_prescription` with the values above plus `not-eligible` and `none-
recorded`.

## Related NHS forms (out of scope)

- **GOS1** — sight test claim form (claimed by the prescriber).
- **GOS2** — patient declaration of entitlement.
- **GOS4** — eligibility for a sight test from home / care home.
- **GOS5** — repair-only voucher.
- **GOS6** — second pair / split prescription voucher.

## Compliance

NHS England *General Ophthalmic Services contractual obligations*
(2023):
<https://www.england.nhs.uk/primary-care/eye-health/general-ophthalmic-services/>

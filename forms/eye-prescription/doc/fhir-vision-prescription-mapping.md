# FHIR R5 VisionPrescription Mapping

The canonical FHIR resource for a spectacle prescription is
[`VisionPrescription`](https://hl7.org/fhir/R5/visionprescription.html)
(R5). This form maps its SQL schema to a FHIR Bundle containing one
`VisionPrescription` plus referenced `Patient`, `Practitioner`, and
`Encounter` resources.

## Bundle structure

```
Bundle
├── Patient                ← from patient
├── Practitioner           ← from prescriber
├── Encounter              ← from eye_prescription (issue date, sight test)
└── VisionPrescription
    ├── lensSpecification (1..*)
    │   ├── product = "lens"
    │   ├── eye = "right" / "left"
    │   ├── sphere, cylinder, axis, add, prism (0..*)
    │   ├── color, brand, note
    │   └── duration (validity period)
    └── status, created, patient, prescriber, encounter, dateWritten
```

## Field map: SQL → FHIR

### `patient` → `Patient`

| SQL column | FHIR path |
| --- | --- |
| `patient.id` | `Patient.id` (UUID) |
| `patient.name` | `Patient.name[0].text` |
| `patient.birth_date` | `Patient.birthDate` |
| `patient.united_kingdom_nhs_number` | `Patient.identifier` (system `https://fhir.nhs.uk/Id/nhs-number`) |
| `patient.postal_address_as_full_text` | `Patient.address[0].text` |
| `patient.postcode` | `Patient.address[0].postalCode` |
| `patient.country_as_iso_3166_1_alpha_2` | `Patient.address[0].country` |
| `patient.email` | `Patient.telecom[?(system='email')].value` |
| `patient.phone` | `Patient.telecom[?(system='phone')].value` |

### `prescriber` → `Practitioner`

| SQL column | FHIR path |
| --- | --- |
| `prescriber.id` | `Practitioner.id` |
| `prescriber.name` | `Practitioner.name[0].text` |
| `prescriber.goc_registration_number` | `Practitioner.identifier` (system `https://fhir.optical.org.uk/Id/goc-number`) |
| `prescriber.role` | `Practitioner.qualification[0].code` (`OPT` for optometrist, `DO` for dispensing optician) |
| `prescriber.practice_name` | `Practitioner.extension[role-organization].valueString` |
| `prescriber.practice_address` | `Practitioner.address[0].text` |
| `prescriber.email` | `Practitioner.telecom[?(system='email')].value` |
| `prescriber.phone` | `Practitioner.telecom[?(system='phone')].value` |

### `eye_prescription` → `Encounter` + `VisionPrescription` header

| SQL column | FHIR path |
| --- | --- |
| `eye_prescription.id` | `VisionPrescription.id` |
| `eye_prescription.patient_id` | `VisionPrescription.patient` (reference) |
| `eye_prescription.prescriber_id` | `VisionPrescription.prescriber` (reference) |
| `eye_prescription.issue_date` | `VisionPrescription.dateWritten` |
| `eye_prescription.expiry_date` | `VisionPrescription.lensSpecification[*].duration.end` |
| `eye_prescription.status` | `VisionPrescription.status` (`active` / `cancelled` / `draft` / `entered-in-error`) |
| `eye_prescription.examination_date` | `Encounter.period.start` |
| `eye_prescription.reason_for_sight_test` | `Encounter.reasonCode[0].text` |

### `eye_prescription_eye` → `VisionPrescription.lensSpecification`

One `lensSpecification` per eye (right and left).

| SQL column | FHIR path |
| --- | --- |
| `eye_prescription_eye.eye` | `lensSpecification.eye` (`right` / `left`) |
| `eye_prescription_eye.sphere_diopters` | `lensSpecification.sphere` |
| `eye_prescription_eye.cylinder_diopters` | `lensSpecification.cylinder` |
| `eye_prescription_eye.axis_degrees` | `lensSpecification.axis` |
| `eye_prescription_eye.prism_horizontal_diopters` | `lensSpecification.prism[0].amount` |
| `eye_prescription_eye.base_horizontal` | `lensSpecification.prism[0].base` (`in` / `out`) |
| `eye_prescription_eye.prism_vertical_diopters` | `lensSpecification.prism[1].amount` |
| `eye_prescription_eye.base_vertical` | `lensSpecification.prism[1].base` (`up` / `down`) |
| `eye_prescription_eye.addition_diopters` | `lensSpecification.add` |
| `eye_prescription_eye.power_diopters` | `lensSpecification.power` |
| `eye_prescription_eye.back_curve_mm` | `lensSpecification.backCurve` |
| `eye_prescription_eye.diameter_mm` | `lensSpecification.diameter` |

### `eye_prescription_lens_recommendation` → `lensSpecification` annotations

| SQL column | FHIR path |
| --- | --- |
| `lens_recommendation.material` | `lensSpecification.product` (use the SCT or local code) |
| `lens_recommendation.coating_*` | `lensSpecification.note[*].text` |
| `lens_recommendation.tint_description` | `lensSpecification.color` |
| `lens_recommendation.dispenser_notes` | `lensSpecification.note[*].text` |

## Units

FHIR `VisionPrescription` uses dioptres (decimal numbers) and degrees
(integer 0–180). The SQL `NUMERIC(5,2)` columns round-trip cleanly.

## Status mapping

| SQL `status` | FHIR `status` |
| --- | --- |
| `active` | `active` |
| `cancelled` | `cancelled` |
| `superseded` | `cancelled` (with `note`) |
| `expired` | `active` (FHIR has no expired state; use duration.end < today) |

## Example

A minimal valid `VisionPrescription` for a -2.00 / -0.50 × 90 right eye:

```json
{
  "resourceType": "VisionPrescription",
  "status": "active",
  "created": "2026-05-18T10:00:00+01:00",
  "patient": { "reference": "Patient/abc" },
  "encounter": { "reference": "Encounter/def" },
  "dateWritten": "2026-05-18",
  "prescriber": { "reference": "Practitioner/ghi" },
  "lensSpecification": [
    {
      "product": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/ex-visionprescriptionproduct", "code": "lens" } ] },
      "eye": "right",
      "sphere": -2.00,
      "cylinder": -0.50,
      "axis": 90
    }
  ]
}
```

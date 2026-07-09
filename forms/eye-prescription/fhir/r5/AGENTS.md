# Eye Prescription — FHIR R5 Representations

Generated HL7 FHIR R5 JSON resources per SQL table in
[`../sql/`](../sql/). See
[`../doc/fhir-vision-prescription-mapping.md`](../doc/fhir-vision-prescription-mapping.md)
for the canonical SQL → FHIR mapping.

## Regenerate

```sh
bin/fhir-r5/generate-fhir-r5-representations.py
```

## Output

The generator emits one JSON file per SQL table. The canonical clinical
resource for a spectacle prescription is
[`VisionPrescription`](https://hl7.org/fhir/R5/visionprescription.html).
The other tables export as `Patient`, `Practitioner`, `Encounter`, and
`Observation` resources following the mapping documented in
`../doc/fhir-vision-prescription-mapping.md`.

## Files

- `patient.json` — `Patient` resource
- `prescriber.json` — `Practitioner` resource
- `eye_prescription.json` — `VisionPrescription` header (+ embedded `Encounter`)
- `eye_prescription_eye.json` — `VisionPrescription.lensSpecification[*]`
- `eye_prescription_visual_acuity.json` — `Observation` (LOINC visual acuity)
- `eye_prescription_pupillary_distance.json` — `Observation`
- `eye_prescription_lens_recommendation.json` — annotations on
  `VisionPrescription.lensSpecification[*]`
- `eye_prescription_ocular_health_finding.json` — `Observation` (slit-lamp,
  fundus, IOP, OCT, fields)
- `eye_prescription_grade.json` — `Observation` (computed classification)
- `eye_prescription_grade_rule.json` — `Observation` (audit trail)
- `eye_prescription_grade_flag.json` — `Observation` (safety flag)

## Validation

The output should validate against the HL7 FHIR R5 schema. The most
reliable validator is the official
[HL7 FHIR Validator](https://confluence.hl7.org/display/FHIR/Using+the+FHIR+Validator):

```sh
java -jar validator_cli.jar fhir/r5/eye_prescription.json -version 5.0.0
```

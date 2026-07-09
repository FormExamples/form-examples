# Medical Information Form for Air Travel — FHIR HL7 R5

FHIR HL7 R5 JSON resources, one file per SQL table in `../sql/`.
The MEDIF maps onto a small set of FHIR R5 resource types:

| SQL table | FHIR R5 resource | Profile |
| --- | --- | --- |
| `patient` | `Patient` | `http://hl7.org/fhir/StructureDefinition/Patient` |
| `clinician` | `Practitioner` | `http://hl7.org/fhir/StructureDefinition/Practitioner` |
| `medical_information_form_for_air_travel` | `Encounter` (with section `Observation` components) | `http://hl7.org/fhir/StructureDefinition/Encounter` |
| `medical_information_form_for_air_travel_grade` | `ClinicalImpression` | `http://hl7.org/fhir/StructureDefinition/ClinicalImpression` |
| `medical_information_form_for_air_travel_grade_rule` | `DetectedIssue` | `http://hl7.org/fhir/StructureDefinition/DetectedIssue` |
| `medical_information_form_for_air_travel_grade_flag` | `DetectedIssue` | `http://hl7.org/fhir/StructureDefinition/DetectedIssue` |

## Bundling

A complete MEDIF submission is exported as a FHIR R5 `Bundle` of type
`document` whose first entry is the `Encounter` and whose subsequent entries
are the `Patient`, `Practitioner`, `ClinicalImpression`, and one
`DetectedIssue` per fired rule and safety flag. The individual resource
files in this directory are the per-entity templates the export composer
fills in.

## Conventions

- `resourceType` and `meta.profile` on every file.
- Placeholder UUIDs reused across files so cross-references resolve:
  - Patient: `550e8400-e29b-41d4-a716-446655440000`
  - Practitioner (clinician): `660e8400-e29b-41d4-a716-446655440001`
  - Encounter (MEDIF): `770e8400-e29b-41d4-a716-446655440002`
  - ClinicalImpression (grade): `880e8400-e29b-41d4-a716-446655440003`
  - DetectedIssue (rule): `990e8400-e29b-41d4-a716-446655440004`
  - DetectedIssue (flag): `aa0e8400-e29b-41d4-a716-446655440005`
- ISO 8601 timestamps with `+00:00` offset.
- Example values consistent with the seed scenario: passenger on
  supplemental oxygen flying Emirates (EK) on a long-haul sector.
- Snake_case is preserved on internal coding `system` URIs to match the
  source SQL column names.
- Per-section clinical detail (cardiovascular, respiratory, etc.) is encoded
  as `Observation.component` entries inside the `Encounter` payload's
  contained observations.

## Files

```
patient.json
clinician.json
medical_information_form_for_air_travel.json
medical_information_form_for_air_travel_grade.json
medical_information_form_for_air_travel_grade_rule.json
medical_information_form_for_air_travel_grade_flag.json
```

See the canonical reference form
[`../../pre-operative-assessment-by-clinician/fhir-r5/`](../../pre-operative-assessment-by-clinician/fhir-r5/)
for the wider one-file-per-SQL-entity pattern used across this monorepo.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```

# Return to Work — FHIR HL7 R5

Generated FHIR HL7 R5 JSON resources for the Return to Work form.
Each SQL entity maps to a FHIR resource and is emitted as a single
JSON file by `bin/fhir-r5/generate-fhir-r5-representations.py`.

## SQL → FHIR resource map

| SQL table | FHIR resource | File |
| --- | --- | --- |
| `patient` | `Patient` | `patient.json` |
| `clinician` | `Practitioner` | `clinician.json` |
| `employer` | `Organization` | `employer.json` |
| `return_to_work` | `DocumentReference` + linked `Encounter` + `Condition` + `CarePlan` | `return_to_work.json` |
| `return_to_work_restriction` | `CarePlan.activity` repeating element | `return_to_work_restriction.json` |
| `return_to_work_grade` | `Observation` (composite) | `return_to_work_grade.json` |
| `return_to_work_grade_rule` | `Observation.component` | `return_to_work_grade_rule.json` |
| `return_to_work_grade_flag` | `Flag` | `return_to_work_grade_flag.json` |

## Bundle profile

The canonical exchange unit is a FHIR R5 `Bundle` of type
`document` containing, in order:

1. `Composition` — the *Statement of Fitness for Work* itself.
2. `Patient` — the employee.
3. `Practitioner` — the issuing clinician.
4. `Organization` — the employer (recipient).
5. `Encounter` — the assessment encounter.
6. `Condition` — primary diagnosis (and any comorbid conditions).
7. `Observation` — functional assessment findings.
8. `CarePlan` — the return-to-work plan, with phased-return and
   workplace adjustments as `CarePlan.activity` entries.
9. `Flag` — one resource per fired safety flag.
10. `DocumentReference` — the printable fit-note PDF.

## Code systems

- SNOMED CT (`http://snomed.info/sct`) — primary diagnosis,
  comorbid conditions, functional findings.
- ICD-10 UK 5th edition (`http://hl7.org/fhir/sid/icd-10`) — primary
  diagnosis cross-walk.
- LOINC (`http://loinc.org`) — fit-note section codes where
  available.
- Local code system
  (`https://form-examples.example/fhir/CodeSystem/return-to-work-restriction`)
  — restriction `kind` enum values.

## Profiles

- `http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips`
  for the `Patient` resource (International Patient Summary).
- `http://hl7.org/fhir/StructureDefinition/Practitioner` (base).
- `http://hl7.org/fhir/StructureDefinition/CarePlan` (base).
- A local profile
  `https://form-examples.example/fhir/StructureDefinition/return-to-work-composition`
  constrains `Composition` to the fit-note layout.

## Verify

```sh
bin/fhir-r5/generate-fhir-r5-representations.py return-to-work
```

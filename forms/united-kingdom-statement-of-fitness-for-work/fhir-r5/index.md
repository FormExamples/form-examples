# FHIR HL7 R5 — UK Statement of Fitness for Work

FHIR R5 JSON resources representing each SQL entity, plus a `Bundle`
representing a complete fit note.

## Resource mapping

| SQL entity | FHIR resource(s) |
| --- | --- |
| patient | `Patient` |
| clinician | `Practitioner` + `PractitionerRole` |
| medical_practice | `Organization` |
| fit_note | `DocumentReference` + `Observation` (fitness-for-work) + `Condition` |
| grade | `Observation` (graded result) |
| grade_rule | `Provenance` entries |
| grade_flag | `Flag` resources |

## Identifiers and codes

- Patient identifier system: `https://fhir.nhs.uk/Id/nhs-number`.
- Practitioner identifier systems: GMC, NMC, HCPC, GPhC.
- Condition coding: SNOMED CT, system `http://snomed.info/sct`.
- Fit-note category coding: a local CodeSystem
  `https://example.org/fhir/CodeSystem/fitness-for-work` with codes
  `not_fit` and `may_be_fit`.

## Regeneration

```sh
bin/fhir-r5/generate-fhir-r5-representations.py united-kingdom-statement-of-fitness-for-work
```

Do not edit JSON files by hand — they are generated from the SQL migrations.

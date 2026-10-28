# Medical Device Assessment — agent instructions

Regulatory risk-class assessment of a medical device (EU MDR Annex VIII / UK
MDR 2002). Read [`index.md`](index.md) and [`spec/index.md`](spec/index.md)
first; update the spec before code.

## Scoring engine

Pure function: assessment state in, `{ computedClass, classSuffix,
conformityRoute, firedRules, flags, readiness }` out. Highest class over all
fired rules wins. Rule table is in `index.md`. Never hand-edit generated
artefacts (`xml/`, `fhir/`, `protobuf/`, `openapi/`, `back-end-with-loco-setup`).

## Entities

`manufacturer`, `assessor`, `medical_device_assessment`, and the grade triad
`medical_device_assessment_grade` / `_grade_rule` / `_grade_flag`. There is no
patient table: the subject is a device, not a person.

## Verify

```sh
bin/test-form medical-device-assessment
bin/test-sql-apply medical-device-assessment
bin/test-examples-conformance medical-device-assessment
```

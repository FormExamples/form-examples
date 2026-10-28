# Medical Fit Note — agent instructions

Clinician signs and approves a fit note for an employee on sick leave. Read
[`index.md`](index.md) and [`spec/index.md`](spec/index.md) first; update the
spec before code.

## Engine

Pure approval function over rules R-01 to R-09; worst effect wins. Never
hand-edit generated artefacts (`xml/`, `fhir/`, `protobuf/`, `openapi/`,
`back-end-with-loco-setup`).

## Entities

`employee`, `clinician`, `medical_fit_note`, and the grade triad
`medical_fit_note_grade` / `_grade_rule` / `_grade_flag`.

## Verify

```sh
bin/test-form medical-fit-note
bin/test-sql-apply medical-fit-note
bin/test-examples-conformance medical-fit-note
```

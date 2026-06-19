# Eye Prescription — XML Representations

Generated XML + DTD per SQL table in
[`../sql-migrations/`](../sql-migrations/). See [`index.md`](./index.md) for
the file map.

## Regenerate

```sh
bin/xml-representations/generate-xml-representations.py
```

After regeneration, update `bin/test-form` outputs and check the diff for
unintended changes.

## File pattern

For every `NN_create_table_<name>.sql` migration, the generator emits:

- `<name>.dtd` — DTD describing the element structure.
- `<name>.xml` — example XML instance.

## Eye prescription tables

- `patient.{dtd,xml}` — patient demographic record
- `prescriber.{dtd,xml}` — GOC-registered prescriber
- `eye_prescription.{dtd,xml}` — prescription header
- `eye_prescription_eye.{dtd,xml}` — per-eye refraction
- `eye_prescription_visual_acuity.{dtd,xml}` — visual acuity
- `eye_prescription_pupillary_distance.{dtd,xml}` — PD measurements
- `eye_prescription_lens_recommendation.{dtd,xml}` — lens design
- `eye_prescription_ocular_health_finding.{dtd,xml}` — ocular findings
- `eye_prescription_grade.{dtd,xml}` — computed grade
- `eye_prescription_grade_rule.{dtd,xml}` — fired rules
- `eye_prescription_grade_flag.{dtd,xml}` — safety flags

## Sign-convention discipline

XML cylinder values are minus-cylinder (matching the SQL storage layer).
See [`../doc/sign-convention-notes.md`](../doc/sign-convention-notes.md).

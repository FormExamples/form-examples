# Eye Prescription — Protocol Buffers Representations

Generated `.proto` schemas per SQL table in
[`../sql-migrations/`](../sql-migrations/). Useful for gRPC services, Kafka /
Pulsar event payloads, or any cross-language integration that prefers
binary-stable, schema-evolving messages.

## Regenerate

```sh
bin/protobuf/generate-protobuf-representations.py
```

## Files

- `patient.proto`
- `prescriber.proto`
- `eye_prescription.proto`
- `eye_prescription_eye.proto`
- `eye_prescription_visual_acuity.proto`
- `eye_prescription_pupillary_distance.proto`
- `eye_prescription_lens_recommendation.proto`
- `eye_prescription_ocular_health_finding.proto`
- `eye_prescription_grade.proto`
- `eye_prescription_grade_rule.proto`
- `eye_prescription_grade_flag.proto`

## Conventions

- `proto3` syntax.
- Field numbers stable across regenerations (re-using the SQL column order).
- Optional fields use the `optional` keyword (proto3.15+).
- Enum-style strings map to `enum` definitions.
- Timestamps use `google.protobuf.Timestamp`.
- `NUMERIC(5,2)` columns map to `double` (the lossy round-trip is acceptable
  for refractive values that are pre-quantised to 0.25 D steps).

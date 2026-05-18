# FHIR HL7 R5 — agent instructions

Generated artifacts: do not edit by hand. Regenerate via
`bin/fhir-r5/generate-fhir-r5-representations.py <form-slug>`.

See root [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for conventions and
the SQL→FHIR R5 mapping rules.

ICVP-specific R5 mapping:

- `patient.json` — `Patient` resource for the vaccinee.
- `clinician.json` — `Practitioner` resource for the supervising clinician.
- `center.json` — `Organization` resource for the administering centre.
- `international_certificate_of_vaccination_or_prophylaxis.json` —
  `DocumentReference` resource that ties together the patient, clinician,
  organization, and the per-entry `Immunization` resources.
- `international_certificate_of_vaccination_or_prophylaxis_entry.json` —
  `Immunization` resource per vaccination entry.

A complete exported certificate is a `Bundle` resource of type
`document` containing one `DocumentReference`, one `Patient`, one
`Practitioner`, one `Organization`, and N `Immunization` resources.

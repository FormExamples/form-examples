# UK LPA for Health and Care Decisions — FHIR HL7 R5 JSON

Generated artifacts: do not edit by hand. Regenerate via
`bin/fhir-r5/generate-fhir-r5-representations.py <form-slug>`.

The LPA is exchanged as a FHIR R5 `Bundle` of type `document` with:

- `Consent` — the LPA instrument, category `adv-directive`, status `active`
  once registered, with `provision` blocks for life-sustaining-treatment
  authority, preferences, and instructions
- `Patient` — donor
- `RelatedPerson` — attorneys and replacement attorneys
- `Practitioner` + `PractitionerRole` — certificate provider (when
  skill-based route)
- `Provenance` — each signing event with `recorded` datetime, enforcing
  statutory sign-order (donor → certificate provider → attorneys)

See root [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for the SQL →
FHIR mapping conventions.

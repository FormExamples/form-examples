# UK LPA for Health and Care Decisions — FHIR HL7 R5 JSON

Generated FHIR R5 JSON resources representing the statutory LPA instrument.

The canonical resource is a **`Consent`** with `category` = *adv-directive*
referenced by a **`Bundle`** that also includes:

- one **`Patient`** for the donor
- one **`RelatedPerson`** per attorney and replacement attorney
- one **`Practitioner`** for the certificate provider (with profession
  qualification where skill-based)
- one **`Provenance`** for each signing event (donor, certificate provider,
  attorneys), enforcing the statutory sign-order

Generated artifacts: do not edit by hand. Regenerate via
`bin/fhir-r5/generate-fhir-r5-representations.py <form-slug>`.

See root [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for FHIR R5
mapping conventions.

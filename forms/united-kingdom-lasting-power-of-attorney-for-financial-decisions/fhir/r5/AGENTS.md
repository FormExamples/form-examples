# UK Lasting Power of Attorney for Financial Decisions — FHIR HL7 R5 JSON

Generated artifacts: do not edit by hand. Regenerate via
`bin/fhir-r5/generate-fhir-r5-representations.py <form-slug>`.

## Conventions

- One `<table>.json` per SQL table in `../sql/`.
- Each file is a single valid FHIR R5 resource (no Bundle wrapper).
- Resource `id` is a UUIDv4 echoing the SQL row `id`.
- camelCase property names (FHIR convention).
- Cross-resource references use the canonical FHIR `{"reference":
  "Person/<uuid>"}` form.
- TIMESTAMPTZ values are ISO 8601 with `+00:00` offset; DATE values are
  ISO 8601 date strings.
- `meta.profile` cites the official HL7 FHIR R5 StructureDefinition URL.
- Custom coding systems use the URN
  `urn:form-examples:united-kingdom-lasting-power-of-attorney-for-financial-decisions`.
- LPA-specific category code is `lpa-finance` under that system.

## Resource-type mapping

| Concept | FHIR resource |
| --- | --- |
| Donor / attorney / witness / generic individual | `Person` |
| The LPA deed itself | `Consent` with category `lpa-finance` |
| Attorney role for a given LPA | `RelatedPerson` |
| Replacement-attorney role | `RelatedPerson` |
| Person to notify | `RelatedPerson` |
| Registration recipient | `RelatedPerson` |
| Certificate provider with professional skill | `Practitioner` |
| Preferences and instructions overflow | `Consent` |
| Continuation sheet | `Consent` |
| Signing event | `Provenance` |
| Witness of a signing event | `Provenance` |
| OPG registration application | `Task` |
| Validation result / rule / flag | `OperationOutcome` |

See root [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for the full
SQL→FHIR mapping rules and the canonical reference shape.

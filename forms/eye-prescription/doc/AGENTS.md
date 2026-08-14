# Eye Prescription — Documentation Agent Instructions

This directory contains clinical reference material that grounds the
design and the classification engine of the eye-prescription form.

When adding new reference material:

- Keep documents one-topic-each and link them from [`index.md`](./index.md).
- Cite primary sources: GOC standards, Opticians Act, College of
  Optometrists Clinical Management Guidelines, HL7 FHIR R5
  `VisionPrescription` spec, WHO ICD-11 chapter 09.
- When citing a UK legal instrument, include the SI number.
- When citing a FHIR resource, link to the R5 page on `hl7.org/fhir/R5/`.
- When introducing a numeric threshold (e.g. anisometropia 2.00 D), cite
  the source and the rationale.
- Use British English spelling (colour, optimize, paediatric) throughout.

## File map

- `index.md` — this directory's overview (linked from agent instructions).
- `goc-standards.md` — UK GOC Standards of Practice mapping.
- `refractive-classification-rules.md` — band tables.
- `lens-recommendation-matrix.md` — material × prescription decision table.
- `sign-convention-notes.md` — minus- vs. plus-cylinder convention.
- `fhir-vision-prescription-mapping.md` — SQL → FHIR R5 field map.
- `safety-case-notes.md` — clinical safety case placeholders.
- `uk-gos3-form-mapping.md` — NHS GOS3 voucher mapping.

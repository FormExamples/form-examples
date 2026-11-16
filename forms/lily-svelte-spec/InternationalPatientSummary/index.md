# InternationalPatientSummary

An International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician: the patient banner, a contents navigation, the sections and the document's details. Structure only: Lily parses no FHIR.

A Svelte 5 component that renders `<article>`.

See `components/international-patient-summary/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `label`: string (required) — the article's accessible name
- `sections`: `{ key, heading, status?, id? }[]` (default `[]`) — the sections the consumer renders, in document order
- `requiredHeadings`: `{ medications, allergies, problems }` (required) — headings for a missing required section
- `omittedLabel`: string (required) — the words an added, missing required section shows
- `contentsLabel`: string (optional) — names the contents navigation; without it there is none
- `headingLevel`: 2 to 6 (default 2) — for the added sections
- `idPrefix`: string (default `"international-patient-summary"`) — section ids are `{prefix}-{key}`; give each summary on a page its own
- `banner`, `details`: snippets (optional) — the patient banner and the document's details
- `children`: snippet (optional) — `InternationalPatientSummarySection` elements

---

Lily™ and Lily Design System™ are trademarks.

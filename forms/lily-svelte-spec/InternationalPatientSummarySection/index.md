# InternationalPatientSummarySection

One section of an International Patient Summary: a `<section>` named by its heading, carrying its key, LOINC code, status and required flag as data.

A Svelte 5 component that renders `<section>`.

See `components/international-patient-summary-section/index.md` for the canonical documentation.

## Props

- `section`: string (required) — the IPS section key, such as `allergies`; `data-section`
- `heading`: string (required) — the heading, the consumer's words
- `headingLevel`: 2 to 6 (default 2)
- `status`: `"known" | "none-known" | "not-recorded" | "unavailable" | "omitted"` (default `"known"`); `data-status`
- `statusLabel`: string — the status in words; required for any status but `known`
- `code`: string (optional) — the LOINC code; default the IPS code for the key; `data-code`
- `required`: boolean (optional) — default whether the IPS requires the section; `data-required`
- `id`: string (optional) — default `international-patient-summary-{section}`
- `idPrefix`: string (default `"international-patient-summary"`) — the same as its summary's
- `narrative`: snippet (optional) and `narrativeLabel`, `narrativeOpen` — the author's narrative in a `<details>`
- `children`: snippet (optional) — the section's entries

---

Lily™ and Lily Design System™ are trademarks.

# ImmunizationRecordListItem

One immunization in an immunization record list, with vaccine, date, dose and status.

A Svelte 5 component that renders `<li>`.

See `components/immunization-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `vaccine`: string (required) — the vaccine given; never truncated
- `occurrence`: string (optional) — when it was given, for <time datetime>
- `occurrenceLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `doseNumberLabel`: string (optional) — the dose in words ("Dose 2 of 2")
- `status`: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `lotNumber`: string (optional) — the vaccine's lot number
- `children`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.

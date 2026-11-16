# MedicationRecordListItem

One medicine in a medication record list, with its status and when it applies.

A Svelte 5 component that renders `<li>`.

See `components/medication-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `children`: slot — the medicine, usually a MedicationView
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" | "unknown" | "not-taken" (optional) — FHIR MedicationStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `effective`: string (optional) — when the medicine applies, for <time datetime>
- `effectiveLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set

---

Lily™ and Lily Design System™ are trademarks.

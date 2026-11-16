# MedicationRecordList

A list of a patient's medicines, whose status is never blank.

A Svelte 5 component that renders `<ul>`.

See `components/medication-record-list/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `medication-record-list-item` items

---

Lily™ and Lily Design System™ are trademarks.

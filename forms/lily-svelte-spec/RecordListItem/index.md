# RecordListItem

One record in a record list, with its status and last update around the consumer's content.

A Svelte 5 component that renders `<li>`.

See `components/record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `children`: slot — the record itself, written by the consumer
- `status`: string (optional) — the record's status, as the consumer's code; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `updated`: string (optional) — when the record was last updated
- `updatedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set

---

Lily™ and Lily Design System™ are trademarks.

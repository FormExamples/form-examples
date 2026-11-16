# ProcedureRecordListItem

One procedure in a procedure record list, with its status and when it was performed.

A Svelte 5 component that renders `<li>`.

See `components/procedure-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `procedure`: string (required) — the procedure; never truncated
- `status`: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown" (optional) — FHIR Procedure status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `performed`: string (optional) — when it was performed, for <time datetime>
- `performedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.

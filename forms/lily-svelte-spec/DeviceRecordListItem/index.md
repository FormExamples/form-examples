# DeviceRecordListItem

One medical device in a device record list, with its status and when it was used.

A Svelte 5 component that renders `<li>`.

See `components/device-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `device`: string (required) — the device; never truncated
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" (optional) — FHIR DeviceUseStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `timing`: string (optional) — when it was used, for <time datetime>
- `timingLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.

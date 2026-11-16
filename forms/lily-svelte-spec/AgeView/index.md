# AgeView

A read-only display of a person's age, in the units suited to it.

A Svelte 5 component that renders `<span>`.

See `components/age-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `value`: string (required) — the age as the consumer writes it
- `duration`: string (optional) — the same age as an ISO 8601 duration, rendered as `data-duration`
- `label`: string (optional) — hidden text naming the value

---

Lily™ and Lily Design System™ are trademarks.

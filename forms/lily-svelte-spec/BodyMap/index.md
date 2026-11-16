# BodyMap

A picker for marking regions of the body on a consumer-supplied drawing, with a checkbox for each region.

A Svelte 5 component that renders `<fieldset>`.

See `components/body-map/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `regions`: { id, label }[] (required) — the regions, in the order the list shows them
- `selected`: string[] (optional) — the chosen region ids (bindable or controlled)
- `name`: string (optional) — the checkboxes' form name
- `children`: slot (optional) — the drawing; mark each clickable shape with `data-region`

---

Lily™ and Lily Design System™ are trademarks.

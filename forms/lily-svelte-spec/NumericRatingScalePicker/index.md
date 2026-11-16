# NumericRatingScalePicker

A picker for a 0 to 10 rating, such as pain, with the consumer's words at each end.

A Svelte 5 component that renders `<fieldset>`.

See `components/numeric-rating-scale-picker/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `min`: number (optional) — the lowest value, default 0
- `max`: number (optional) — the highest value, default 10
- `minLabel`: string (optional) — the words for the lowest value
- `maxLabel`: string (optional) — the words for the highest value
- `value`: string (optional) — the chosen value (bindable or controlled)
- `name`: string (optional) — the radios' form name, default `rating`
- `required`: boolean (optional) — the form needs an answer

---

Lily™ and Lily Design System™ are trademarks.

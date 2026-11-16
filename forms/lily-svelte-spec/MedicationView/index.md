# MedicationView

A read-only display of a medicine, with its name, strength, form, route and frequency.

A Svelte 5 component that renders `<span>`.

See `components/medication-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `name`: string (optional) — the name as plain text
- `nameSegments`: { text, tallMan? }[] (optional) — the name in parts, with tall man letters marked; used instead of `name`
- `strength`: string (optional) — the strength, formatted by the consumer
- `form`: string (optional) — the dose form
- `route`: string (optional) — the route
- `frequency`: string (optional) — how often
- `dosageText`: string (optional) — the dose as free text (FHIR `Dosage.text`), when the record has no structured parts; rendered as `-dosage`
- `label`: string (optional) — hidden text naming the value

---

Lily™ and Lily Design System™ are trademarks.

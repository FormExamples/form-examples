# ObservationView

A read-only display of a clinical observation or test result, with its unit, reference range and interpretation flag.

A Svelte 5 component that renders `<span>`.

See `components/observation-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `value`: string (optional) — the value, formatted by the consumer
- `unit`: string (optional) — the unit, such as `mmol/L`
- `interpretation`: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as `data-interpretation`
- `flagLabel`: string (optional) — the flag in words ("High"); required when the flag is not normal
- `range`: string (optional) — the reference range as text
- `status`: "final" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "masked" | "not-recorded" | "unavailable" (optional) — default `final`, rendered as `data-status`
- `statusLabel`: string (optional) — the words for a status that is not final; replaces the value when it is missing
- `label`: string (optional) — hidden text naming the observation, when no visible caption does

---

Lily™ and Lily Design System™ are trademarks.

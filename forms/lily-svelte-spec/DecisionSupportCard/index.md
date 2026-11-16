# DecisionSupportCard

A clinical decision support card with a summary, urgency indicator, source, suggestions and override reasons.

A Svelte 5 component that renders `<div>`.

See `components/decision-support-card/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `summary`: string (required) — the one-sentence summary (CDS Hooks: under 140 characters); names the card
- `indicator`: "info" | "warning" | "critical" (required) — rendered as `data-indicator`
- `indicatorLabel`: string (required) — the indicator in words
- `sourceLabel`: string (required) — where the guidance comes from
- `sourceHref`: string (optional) — a link to the source
- `suggestions`: { id, label, isRecommended? }[] (optional) — each a button
- `links`: { label, href }[] (optional) — links to more information
- `dismissLabel`: string (optional) — the dismiss button's text; no button without it
- `overrideReasons`: { code, display }[] (optional) — when given, dismissing asks for one
- `overrideReasonLabel`: string (optional) — the reason select's label
- `overrideReasonPlaceholder`: string (optional) — the text of the select's empty first option
- `label`: string (optional) — the accessible name, when it should differ from the summary
- `children`: slot (optional) — the detail
- `onSuggestion`: callback (optional) — called with the chosen suggestion's id
- `onDismiss`: callback (optional) — called with the chosen reason's code, or none when no reasons are offered

---

Lily™ and Lily Design System™ are trademarks.

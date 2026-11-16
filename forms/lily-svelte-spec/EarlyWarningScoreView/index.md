# EarlyWarningScoreView

A read-only display of an early warning score, with its band and escalation text.

A Svelte 5 component that renders `<span>`.

See `components/early-warning-score-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `score`: string | number (required) — the score the consumer computed
- `system`: string (optional) — the scoring system's name, such as NEWS2
- `band`: string (optional) — the consumer's band key, rendered as `data-band`
- `bandLabel`: string (optional) — the band in words; required with `band`
- `escalation`: string (optional) — what to do
- `label`: string (optional) — hidden text naming the value

---

Lily™ and Lily Design System™ are trademarks.

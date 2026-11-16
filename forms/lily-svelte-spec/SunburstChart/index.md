# SunburstChart

A radial chart showing a hierarchy as concentric rings of arcs.

## Canonical documentation

See [components/sunburst-chart/index.md](../../../components/sunburst-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import SunburstChart from "./SunburstChart.svelte";
</script>

<SunburstChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</SunburstChart>
```

## Files

- `SunburstChart.svelte` — Svelte 5 implementation using runes
- `SunburstChart.test.ts` — vitest + @testing-library/svelte tests
- `SunburstChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

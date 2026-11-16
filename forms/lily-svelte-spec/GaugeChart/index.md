# GaugeChart

A dial chart showing one value within a range, with optional thresholds.

## Canonical documentation

See [components/gauge-chart/index.md](../../../components/gauge-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import GaugeChart from "./GaugeChart.svelte";
</script>

<GaugeChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</GaugeChart>
```

## Files

- `GaugeChart.svelte` — Svelte 5 implementation using runes
- `GaugeChart.test.ts` — vitest + @testing-library/svelte tests
- `GaugeChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

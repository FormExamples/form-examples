# HeatmapChart

A grid chart where cell colour encodes the value at each row and column.

## Canonical documentation

See [components/heatmap-chart/index.md](../../../components/heatmap-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import HeatmapChart from "./HeatmapChart.svelte";
</script>

<HeatmapChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</HeatmapChart>
```

## Files

- `HeatmapChart.svelte` — Svelte 5 implementation using runes
- `HeatmapChart.test.ts` — vitest + @testing-library/svelte tests
- `HeatmapChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

# ChoroplethChart

A map chart that shades regions by the value of a measure.

## Canonical documentation

See [components/choropleth-chart/index.md](../../../components/choropleth-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import ChoroplethChart from "./ChoroplethChart.svelte";
</script>

<ChoroplethChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</ChoroplethChart>
```

## Files

- `ChoroplethChart.svelte` — Svelte 5 implementation using runes
- `ChoroplethChart.test.ts` — vitest + @testing-library/svelte tests
- `ChoroplethChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

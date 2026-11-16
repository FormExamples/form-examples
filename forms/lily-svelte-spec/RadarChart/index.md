# RadarChart

A chart plotting several axes from a shared centre as a polygon.

## Canonical documentation

See [components/radar-chart/index.md](../../../components/radar-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import RadarChart from "./RadarChart.svelte";
</script>

<RadarChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</RadarChart>
```

## Files

- `RadarChart.svelte` — Svelte 5 implementation using runes
- `RadarChart.test.ts` — vitest + @testing-library/svelte tests
- `RadarChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

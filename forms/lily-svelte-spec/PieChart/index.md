# PieChart

A circular chart divided into slices that show each part of a whole.

## Canonical documentation

See [components/pie-chart/index.md](../../../components/pie-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import PieChart from "./PieChart.svelte";
</script>

<PieChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</PieChart>
```

## Files

- `PieChart.svelte` — Svelte 5 implementation using runes
- `PieChart.test.ts` — vitest + @testing-library/svelte tests
- `PieChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

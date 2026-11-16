# ComposedChart

A chart that combines several chart types, such as bars and a line, on shared axes.

## Canonical documentation

See [components/composed-chart/index.md](../../../components/composed-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import ComposedChart from "./ComposedChart.svelte";
</script>

<ComposedChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</ComposedChart>
```

## Files

- `ComposedChart.svelte` — Svelte 5 implementation using runes
- `ComposedChart.test.ts` — vitest + @testing-library/svelte tests
- `ComposedChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

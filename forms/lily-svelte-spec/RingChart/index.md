# RingChart

A pie chart with a hollow centre, often used to show progress or a share of a total.

## Canonical documentation

See [components/ring-chart/index.md](../../../components/ring-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import RingChart from "./RingChart.svelte";
</script>

<RingChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</RingChart>
```

## Files

- `RingChart.svelte` — Svelte 5 implementation using runes
- `RingChart.test.ts` — vitest + @testing-library/svelte tests
- `RingChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

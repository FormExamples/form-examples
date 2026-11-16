# FunnelChart

A chart of stages narrowing from top to bottom, showing how a quantity drops at each step.

## Canonical documentation

See [components/funnel-chart/index.md](../../../components/funnel-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import FunnelChart from "./FunnelChart.svelte";
</script>

<FunnelChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</FunnelChart>
```

## Files

- `FunnelChart.svelte` — Svelte 5 implementation using runes
- `FunnelChart.test.ts` — vitest + @testing-library/svelte tests
- `FunnelChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

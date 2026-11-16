# SankeyChart

A flow chart where link width encodes the quantity moving between nodes.

## Canonical documentation

See [components/sankey-chart/index.md](../../../components/sankey-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import SankeyChart from "./SankeyChart.svelte";
</script>

<SankeyChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</SankeyChart>
```

## Files

- `SankeyChart.svelte` — Svelte 5 implementation using runes
- `SankeyChart.test.ts` — vitest + @testing-library/svelte tests
- `SankeyChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

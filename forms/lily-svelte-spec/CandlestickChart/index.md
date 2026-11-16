# CandlestickChart

A financial chart showing open, high, low and close values for each period as candles.

## Canonical documentation

See [components/candlestick-chart/index.md](../../../components/candlestick-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import CandlestickChart from "./CandlestickChart.svelte";
</script>

<CandlestickChart label="Describe the chart">
  <svg viewBox="0 0 10 10">…</svg>
</CandlestickChart>
```

## Files

- `CandlestickChart.svelte` — Svelte 5 implementation using runes
- `CandlestickChart.test.ts` — vitest + @testing-library/svelte tests
- `CandlestickChart.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

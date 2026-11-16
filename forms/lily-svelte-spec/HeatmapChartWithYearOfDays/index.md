# HeatmapChartWithYearOfDays

A year-of-days heatmap: one cell per day of one year, in week columns and weekday rows. It specialises `HeatmapChart` and adds `year` and `weekStart`; layout contract in [components/heatmap-chart-with-year-of-days](../../../components/heatmap-chart-with-year-of-days/index.md).

## Canonical documentation

See [components/heatmap-chart-with-year-of-days/index.md](../../../components/heatmap-chart-with-year-of-days/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import HeatmapChartWithYearOfDays from "./HeatmapChartWithYearOfDays.svelte";
</script>

<HeatmapChartWithYearOfDays
  label="Activity per day in 2026"
  year={2026}
  weekStart={1}
>
  <svg viewBox="0 0 10 10">…</svg>
</HeatmapChartWithYearOfDays>
```

## Files

- `HeatmapChartWithYearOfDays.svelte` — Svelte 5 implementation using runes
- `HeatmapChartWithYearOfDays.test.ts` — vitest + @testing-library/svelte tests
- `HeatmapChartWithYearOfDays.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.

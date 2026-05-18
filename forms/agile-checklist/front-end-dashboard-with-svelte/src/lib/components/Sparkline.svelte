<script lang="ts">
  import { sparklineGeometry, type TrendPoint } from '$lib/aggregate.js';
  import type { Maturity } from '$lib/data/sample.js';

  let {
    trend,
    maturity,
    width = 100,
    height = 28,
  }: { trend: TrendPoint[]; maturity: Maturity; width?: number; height?: number } = $props();

  const geom = $derived(sparklineGeometry(trend, width, height));

  function strokeFor(m: Maturity): string {
    const map: Record<Maturity, string> = {
      optimising: '#15803d',
      mature: '#16a34a',
      developing: '#ca8a04',
      initial: '#ea580c',
      'ad-hoc': '#dc2626',
      'insufficient-data': '#94a3b8',
    };
    return map[m] ?? '#94a3b8';
  }

  const tooltip = $derived(
    trend.map((p) => `${p.date}: ${p.overallPercent.toFixed(0)}%`).join('\n') || 'No data',
  );
</script>

{#if geom}
  <svg
    {width}
    {height}
    viewBox="0 0 {width} {height}"
    aria-label="Trend of overall percent over time"
    role="img"
  >
    <title>{tooltip}</title>
    <path d={geom.pathD} fill="none" stroke={strokeFor(maturity)} stroke-width="1.5" />
    <circle cx={geom.lastX} cy={geom.lastY} r="2" fill={strokeFor(maturity)} />
  </svg>
{:else}
  <span class="text-xs text-slate-400">—</span>
{/if}

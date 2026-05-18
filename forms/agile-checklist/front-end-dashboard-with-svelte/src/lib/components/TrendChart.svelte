<script lang="ts">
  import type { ChecklistRow } from '$lib/data/sample.js';
  import { multiTeamChart } from '$lib/aggregate.js';

  let {
    rows,
    width = 720,
    height = 240,
  }: { rows: ChecklistRow[]; width?: number; height?: number } = $props();

  const chart = $derived(multiTeamChart(rows, { width, height }));
</script>

{#if !chart}
  <p class="text-sm text-slate-500">
    No scored submissions to chart yet. Import data or wait for the API.
  </p>
{:else}
  <div class="flex flex-wrap gap-4 items-start">
    <svg
      width={chart.width}
      height={chart.height}
      viewBox="0 0 {chart.width} {chart.height}"
      role="img"
      aria-label="Overall percent over time, one line per team"
      class="bg-white border border-slate-200 rounded"
    >
      <!-- y grid + ticks -->
      {#each chart.yTicks as t (t.label)}
        <line
          x1={chart.innerLeft}
          x2={chart.innerRight}
          y1={t.y}
          y2={t.y}
          stroke="#e2e8f0"
          stroke-dasharray={t.label === '0%' || t.label === '100%' ? 'none' : '2,2'}
        />
        <text
          x={chart.innerLeft - 6}
          y={t.y + 3}
          text-anchor="end"
          font-size="10"
          fill="#475569"
        >{t.label}</text>
      {/each}

      <!-- x ticks -->
      {#each chart.xTicks as t, i (i + ':' + t.label)}
        <line
          x1={t.x}
          x2={t.x}
          y1={chart.innerBottom}
          y2={chart.innerBottom + 4}
          stroke="#94a3b8"
        />
        <text
          x={t.x}
          y={chart.innerBottom + 16}
          text-anchor="middle"
          font-size="10"
          fill="#475569"
        >{t.label}</text>
      {/each}

      <!-- series -->
      {#each chart.series as s (s.team + '\x00' + s.organisation)}
        <path
          d={s.pathD}
          fill="none"
          stroke={s.color}
          stroke-width="1.75"
        />
        {#each s.points as p, i (i + ':' + p.date)}
          <circle cx={p.x} cy={p.y} r="2.5" fill={s.color} />
        {/each}
        <text
          x={s.endLabelX}
          y={s.endLabelY + 3}
          font-size="10"
          fill={s.color}
          font-weight="600"
        >{s.team}</text>
      {/each}
    </svg>

    <div class="text-xs text-slate-600 space-y-1 max-w-xs">
      <p class="font-medium text-slate-700 mb-1">Legend</p>
      {#each chart.series as s (s.team + '\x00' + s.organisation + ':legend')}
        <div class="flex items-center gap-2">
          <span
            class="inline-block w-3 h-3 rounded-sm"
            style="background:{s.color}"
            aria-hidden="true"
          ></span>
          <span>{s.team}</span>
          <span class="text-slate-400">·</span>
          <span class="uppercase tracking-wide">{s.maturity}</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

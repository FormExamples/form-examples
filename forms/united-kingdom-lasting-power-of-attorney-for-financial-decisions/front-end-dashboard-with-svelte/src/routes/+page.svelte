<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLpas } from '$lib/api.js';
  import { lpaToRow, type Lpa, type LpaRow } from '$lib/types.js';

  let lpas = $state<Lpa[]>([]);
  let searchTerm = $state('');
  let loading = $state(true);

  onMount(async () => {
    lpas = await fetchLpas();
    loading = false;
  });

  const allRows = $derived(lpas.map(lpaToRow));

  const filteredRows = $derived(
    searchTerm.trim().length === 0
      ? allRows
      : allRows.filter((r: LpaRow) =>
          r.donorName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        ),
  );

  function riskBadgeClass(risk: string): string {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  }

  function summaryCounts(rows: LpaRow[]): Record<string, number> {
    const out: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
    for (const r of rows) out[r.compositeRisk] = (out[r.compositeRisk] ?? 0) + 1;
    return out;
  }

  const counts = $derived(summaryCounts(filteredRows));
</script>

<section class="flex flex-wrap items-end gap-3 mb-4">
  <label class="flex flex-col text-sm">
    <span class="text-slate-700 mb-1">Search by donor name</span>
    <input
      type="search"
      placeholder="e.g. Pemberton"
      class="border rounded px-3 py-1 w-64"
      bind:value={searchTerm}
    />
  </label>

  <div class="flex gap-2 ml-auto text-xs">
    {#each ['low', 'moderate', 'high', 'critical'] as risk (risk)}
      <span class="px-2 py-1 rounded border {riskBadgeClass(risk)}">
        {risk}: {counts[risk] ?? 0}
      </span>
    {/each}
  </div>
</section>

{#if loading}
  <p class="text-sm text-slate-500">Loading…</p>
{:else if filteredRows.length === 0}
  <p class="text-sm text-slate-500">
    No LPAs match the current search.
  </p>
{:else}
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-100 text-left text-xs uppercase tracking-wide">
        <tr>
          <th class="p-2">Donor</th>
          <th class="p-2">Risk</th>
          <th class="p-2">Validity</th>
          <th class="p-2">OPG status</th>
          <th class="p-2">Open</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredRows as r (r.id)}
          <tr class="border-b border-slate-200">
            <td class="p-2 font-medium">{r.donorName}</td>
            <td class="p-2">
              <span class="px-2 py-0.5 text-xs rounded border {riskBadgeClass(r.compositeRisk)}">
                {r.compositeRisk}
              </span>
            </td>
            <td class="p-2">{r.validityBand.replace(/_/g, ' ')}</td>
            <td class="p-2">{(r.opgStatus || '').replace(/_/g, ' ') || '—'}</td>
            <td class="p-2">
              <a class="text-brand-600 underline" href={`/lpa/${r.id}`}>open</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<p class="text-xs text-slate-500 mt-4">
  Falls back to local sample data when <code>/api/lpa</code> is unreachable.
  In production, rows come from the Rust backend.
</p>

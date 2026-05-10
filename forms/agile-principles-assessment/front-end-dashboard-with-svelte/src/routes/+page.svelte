<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchAssessments } from '$lib/api/assessments.js';
  import type { AssessmentRow, Maturity } from '$lib/data/sample.js';
  import { aggregateByTeam, rowsToCsv, downloadCsv } from '$lib/aggregate.js';
  import Sparkline from '$lib/components/Sparkline.svelte';

  type SortableKey = 'date' | 'respondent' | 'role' | 'team' | 'meanScore' | 'maturity';
  type View = 'individuals' | 'teams';

  let rows = $state<AssessmentRow[]>([]);
  let filterMaturity = $state<Maturity | ''>('');
  let filterRole = $state<string>('');
  let sortKey = $state<SortableKey>('date');
  let sortDir = $state<'asc' | 'desc'>('desc');
  let view = $state<View>('individuals');

  onMount(async () => {
    rows = await fetchAssessments();
  });

  const filtered = $derived(
    rows
      .filter((r) => !filterMaturity || r.maturity === filterMaturity)
      .filter((r) => !filterRole || r.role === filterRole)
      .slice()
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      }),
  );

  const totals = $derived.by(() => {
    const t: Record<Maturity, number> = {
      optimising: 0,
      mature: 0,
      developing: 0,
      initial: 0,
      'ad-hoc': 0,
      'insufficient-data': 0,
    };
    for (const r of rows) t[r.maturity] = (t[r.maturity] ?? 0) + 1;
    return t;
  });

  function setSort(k: SortableKey) {
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else {
      sortKey = k;
      sortDir = 'asc';
    }
  }

  function rowClass(m: Maturity): string {
    const map: Record<Maturity, string> = {
      optimising: 'bg-emerald-50',
      mature: 'bg-green-50',
      developing: 'bg-yellow-50',
      initial: 'bg-orange-50',
      'ad-hoc': 'bg-red-50',
      'insufficient-data': 'bg-slate-50',
    };
    return map[m] ?? '';
  }

  const ROLES = [
    'individual-contributor',
    'team-lead',
    'scrum-master',
    'product-owner',
    'engineering-manager',
    'agile-coach',
    'executive-sponsor',
    'other',
  ] as const;

  const teams = $derived(aggregateByTeam(filtered));

  function exportCsv() {
    downloadCsv('agile-principles-assessments.csv', rowsToCsv(filtered));
  }
</script>

<div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
  {#each Object.entries(totals) as [m, n] (m)}
    <div class="bg-white border border-slate-200 rounded p-3">
      <p class="text-xs uppercase text-slate-500">{m}</p>
      <p class="text-2xl font-semibold">{n}</p>
    </div>
  {/each}
</div>

<div class="flex flex-wrap gap-3 mb-4 items-end">
  <label class="block">
    <span class="text-sm block">Maturity</span>
    <select class="border border-slate-300 rounded px-2 py-1" bind:value={filterMaturity}>
      <option value="">All</option>
      <option value="optimising">Optimising</option>
      <option value="mature">Mature</option>
      <option value="developing">Developing</option>
      <option value="initial">Initial</option>
      <option value="ad-hoc">Ad-hoc</option>
      <option value="insufficient-data">Insufficient data</option>
    </select>
  </label>
  <label class="block">
    <span class="text-sm block">Role</span>
    <select class="border border-slate-300 rounded px-2 py-1" bind:value={filterRole}>
      <option value="">All</option>
      {#each ROLES as r (r)}
        <option value={r}>{r}</option>
      {/each}
    </select>
  </label>
  <div class="ml-auto flex items-center gap-3">
    <div role="tablist" class="inline-flex border border-slate-300 rounded overflow-hidden text-sm">
      <button
        type="button"
        role="tab"
        aria-selected={view === 'individuals'}
        class="px-3 py-1 {view === 'individuals' ? 'bg-brand-600 text-white' : 'bg-white text-slate-700'}"
        onclick={() => (view = 'individuals')}
      >
        Individuals
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === 'teams'}
        class="px-3 py-1 {view === 'teams' ? 'bg-brand-600 text-white' : 'bg-white text-slate-700'}"
        onclick={() => (view = 'teams')}
      >
        Teams
      </button>
    </div>
    <button
      type="button"
      class="px-3 py-1 text-sm border border-slate-300 rounded bg-white hover:bg-slate-100"
      onclick={exportCsv}
    >
      Export CSV
    </button>
    <p class="text-sm text-slate-500">{filtered.length} results</p>
  </div>
</div>

{#if view === 'individuals'}
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-100 text-left">
        <tr>
          <th class="p-2 cursor-pointer" onclick={() => setSort('date')}>Date</th>
          <th class="p-2 cursor-pointer" onclick={() => setSort('respondent')}>Respondent</th>
          <th class="p-2 cursor-pointer" onclick={() => setSort('role')}>Role</th>
          <th class="p-2 cursor-pointer" onclick={() => setSort('team')}>Team</th>
          <th class="p-2">Org</th>
          <th class="p-2">Answered</th>
          <th class="p-2 cursor-pointer" onclick={() => setSort('meanScore')}>Mean</th>
          <th class="p-2 cursor-pointer" onclick={() => setSort('maturity')}>Maturity</th>
          <th class="p-2">Weak principles</th>
          <th class="p-2">Flags</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as r (r.id)}
          <tr class="{rowClass(r.maturity)} border-b border-slate-200">
            <td class="p-2">{r.date}</td>
            <td class="p-2 font-medium">
              {r.isAnonymous ? 'Anonymous' : r.respondent}
              {#if r.isAnonymous}<span class="ml-1 text-xs text-slate-500" title="Anonymous submission">🔒</span>{/if}
            </td>
            <td class="p-2 text-slate-600">{r.isAnonymous ? '—' : r.role}</td>
            <td class="p-2">{r.team}</td>
            <td class="p-2">{r.organisation}</td>
            <td class="p-2 text-center">{r.answered}/12</td>
            <td class="p-2">{r.meanScore !== null ? r.meanScore.toFixed(2) : '—'}</td>
            <td class="p-2 uppercase">{r.maturity}</td>
            <td class="p-2 text-xs">{r.weakPrinciples.join(', ') || '—'}</td>
            <td class="p-2 text-xs">{r.flags.join(', ') || '—'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-100 text-left">
        <tr>
          <th class="p-2">Team</th>
          <th class="p-2">Organisation</th>
          <th class="p-2">Submissions</th>
          <th class="p-2">Mean of means</th>
          <th class="p-2">Maturity</th>
          <th class="p-2">Trend (1–5)</th>
          <th class="p-2">Top flags</th>
        </tr>
      </thead>
      <tbody>
        {#each teams as t (t.team + '\x00' + t.organisation)}
          <tr class="{rowClass(t.maturity)} border-b border-slate-200">
            <td class="p-2 font-medium">{t.team}</td>
            <td class="p-2">{t.organisation}</td>
            <td class="p-2 text-center">{t.count}</td>
            <td class="p-2">{t.meanOfMeans !== null ? t.meanOfMeans.toFixed(2) : '—'}</td>
            <td class="p-2 uppercase">{t.maturity}</td>
            <td class="p-2"><Sparkline trend={t.trend} maturity={t.maturity} /></td>
            <td class="p-2 text-xs">{t.topFlags.join(', ') || '—'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<p class="text-xs text-slate-500 mt-4">
  Falls back to sample data when no backend is reachable. In production rows
  come from the Rust backend's <code>/api/assessments</code> endpoint.
</p>

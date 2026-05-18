<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fetchAdrs, resolveMarkdownUrl } from '$lib/api/adrs.js';
  import type { AdrRow, Status, Group } from '$lib/data/sample.js';

  let rows = $state<AdrRow[]>([]);
  let filterStatus = $state<Status | ''>('');
  let filterGroup = $state<Group | ''>('');
  let search = $state('');
  let sortKey = $state<keyof AdrRow>('number');
  let sortDir = $state<'asc' | 'desc'>('asc');

  onMount(async () => {
    rows = await fetchAdrs();
  });

  const STATUS_ORDER: Status[] = ['pending', 'decided', 'approved', 'superseded', 'deprecated'];

  const filtered = $derived(
    rows
      .filter((r) => {
        if (filterStatus && r.status !== filterStatus) return false;
        if (filterGroup && r.decisionGroup !== filterGroup) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const hay = `${r.title} ${r.slug} ${r.authorName}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .slice()
      .sort((a, b) => {
        let av: string | number | null = a[sortKey] as string | number | null;
        let bv: string | number | null = b[sortKey] as string | number | null;
        if (sortKey === 'status') {
          av = STATUS_ORDER.indexOf(a.status);
          bv = STATUS_ORDER.indexOf(b.status);
        }
        if (av === null || av === undefined || av === '') return 1;
        if (bv === null || bv === undefined || bv === '') return -1;
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
  );

  function setSort(k: keyof AdrRow) {
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else {
      sortKey = k;
      sortDir = 'asc';
    }
  }

  function statusClass(s: Status): string {
    const map: Record<Status, string> = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      decided: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      superseded: 'bg-slate-100 text-slate-700 border-slate-300',
      deprecated: 'bg-red-100 text-red-800 border-red-200'
    };
    return map[s] ?? '';
  }

  function pad4(n: number | null): string {
    if (n === null || n === undefined) return '';
    return String(n).padStart(4, '0');
  }

  function sortIndicator(k: keyof AdrRow): string {
    if (sortKey !== k) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end">
  <label class="block">
    <span class="text-sm block text-slate-600">Status</span>
    <select class="w-full border rounded px-2 py-1" bind:value={filterStatus}>
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="decided">Decided</option>
      <option value="approved">Approved</option>
      <option value="superseded">Superseded</option>
      <option value="deprecated">Deprecated</option>
    </select>
  </label>
  <label class="block">
    <span class="text-sm block text-slate-600">Group</span>
    <select class="w-full border rounded px-2 py-1" bind:value={filterGroup}>
      <option value="">All</option>
      <option value="business">Business</option>
      <option value="data">Data</option>
      <option value="integration">Integration</option>
      <option value="presentation">Presentation</option>
      <option value="security">Security</option>
      <option value="infrastructure">Infrastructure</option>
      <option value="operations">Operations</option>
      <option value="governance">Governance</option>
      <option value="other">Other</option>
    </select>
  </label>
  <label class="block">
    <span class="text-sm block text-slate-600">Search</span>
    <input
      type="search"
      class="w-full border rounded px-2 py-1"
      placeholder="title, slug, or author…"
      bind:value={search}
    />
  </label>
  <p class="text-sm text-slate-500 md:text-right">
    {filtered.length} of {rows.length} ADR{rows.length === 1 ? '' : 's'}
  </p>
</div>

<div class="bg-white rounded-lg shadow overflow-x-auto">
  <table class="min-w-full text-sm">
    <thead class="bg-slate-100 text-left">
      <tr>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('number')}>
          Number{sortIndicator('number')}
        </th>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('title')}>
          Title{sortIndicator('title')}
        </th>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('status')}>
          Status{sortIndicator('status')}
        </th>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('decisionGroup')}>
          Group{sortIndicator('decisionGroup')}
        </th>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('decisionDate')}>
          Date{sortIndicator('decisionDate')}
        </th>
        <th class="p-2 cursor-pointer select-none" onclick={() => setSort('authorName')}>
          Author{sortIndicator('authorName')}
        </th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as r (r.id)}
        <tr
          class="border-b border-slate-200 hover:bg-slate-50 cursor-pointer"
          onclick={() => goto(r.slug ? `/${r.slug}` : resolveMarkdownUrl(r))}
        >
          <td class="p-2 font-mono text-slate-600">{pad4(r.number)}</td>
          <td class="p-2 font-medium">{r.title}</td>
          <td class="p-2">
            <span class="inline-block px-2 py-0.5 rounded-full border text-xs {statusClass(r.status)}">
              {r.status}
            </span>
          </td>
          <td class="p-2">{r.decisionGroup || '—'}</td>
          <td class="p-2">{r.decisionDate || '—'}</td>
          <td class="p-2">{r.authorName || '—'}</td>
        </tr>
      {:else}
        <tr>
          <td colspan="6" class="p-6 text-center text-slate-500 italic">
            No ADRs match the current filters.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<p class="text-xs text-slate-500 mt-4">
  Source: <code>/api/adrs</code> when available, otherwise the compiled-in sample data.
</p>

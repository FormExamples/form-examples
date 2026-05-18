<script lang="ts">
  import { onMount } from 'svelte';
  import Filters from '$lib/components/Filters.svelte';
  import { COLUMNS } from '$lib/grid/columns';
  import { fetchCertificates } from '$lib/api/certificates';
  import type { CertificateRow } from '$lib/types';

  let rows = $state<CertificateRow[]>([]);
  let filters = $state({ disease: '', status: '', centre: '', search: '' });
  let selected = $state<CertificateRow | null>(null);

  onMount(async () => {
    rows = await fetchCertificates();
  });

  const view = $derived(
    rows.filter((r) => {
      if (filters.disease && r.primaryDisease !== filters.disease) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.centre && r.centre !== filters.centre) return false;
      if (filters.search) {
        const h = `${r.surname} ${r.givenNames} ${r.serial}`.toLowerCase();
        if (!h.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    }),
  );

  // SVAR grid library (`wx-svelte-grid`) may not be installed; render a
  // semantic table fallback that still demonstrates sort + filter + detail.
  let sortKey = $state<string>('serial');
  let sortDir = $state<'asc' | 'desc'>('asc');

  function setSort(key: string) {
    if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = key; sortDir = 'asc'; }
  }

  const sortedView = $derived(
    [...view].sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    }),
  );
</script>

<Filters rows={rows} onChange={(f) => (filters = f)} />

<main class="grid gap-4 p-4 lg:grid-cols-[3fr_2fr]">
  <table class="w-full bg-white text-sm border">
    <thead class="bg-stone-100">
      <tr>
        {#each COLUMNS as col}
          <th class="text-left p-2 cursor-pointer select-none" onclick={() => setSort(col.id)}>
            {col.header}
            {sortKey === col.id ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each sortedView as row}
        <tr class="border-t hover:bg-yellow-50 cursor-pointer"
            class:bg-yellow-100={selected?.id === row.id}
            onclick={() => (selected = row)}>
          <td class="p-2">{row.serial}</td>
          <td class="p-2">{row.surname}</td>
          <td class="p-2">{row.givenNames}</td>
          <td class="p-2">{row.centre}</td>
          <td class="p-2">{row.primaryDisease}</td>
          <td class="p-2 text-right">{row.entriesCount}</td>
          <td class="p-2">{row.vaccinationDate}</td>
          <td class="p-2">{row.validityStatus}</td>
          <td class="p-2">{row.status}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <aside class="bg-white border rounded p-4">
    {#if selected}
      <h2 class="font-semibold">{selected.serial} — {selected.givenNames} {selected.surname}</h2>
      <p><strong>Centre:</strong> {selected.centre} ({selected.issuingCountryAsIso31661Alpha3})</p>
      <p><strong>Status:</strong> {selected.status} — validity: {selected.validityStatus}</p>
      <h3 class="mt-3 font-medium">Entries ({selected.entriesCount})</h3>
      <ol class="list-decimal pl-5 text-sm">
        {#each selected.entries as e}
          <li>
            <strong>{e.disease}</strong> — {e.vaccinationDate}<br />
            {e.manufacturer} / batch {e.batchNumber}<br />
            Valid from {e.validityStartsOn} until
            {e.validityIsLifetime === 'yes' ? 'lifetime (2016 IHR amendment)' : (e.validityEndsOn ?? '—')}
          </li>
        {/each}
      </ol>
    {:else}
      <p>Select a row to see the certificate's vaccination entries.</p>
    {/if}
  </aside>
</main>

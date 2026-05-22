<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLpas } from '$lib/api/lpa.js';
  import type { LpaRow, ValidityStatus, RegistrationStage, Jurisdiction } from '$lib/data/sample.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  let rows = $state<LpaRow[]>([]);
  let filterStatus = $state<ValidityStatus | ''>('');
  let filterStage = $state<RegistrationStage | ''>('');
  let filterJurisdiction = $state<Jurisdiction | ''>('');
  let sortKey = $state<keyof LpaRow>('updatedAt');
  let sortDir = $state<'asc' | 'desc'>('desc');

  onMount(async () => {
    rows = await fetchLpas();
  });

  const filtered = $derived(
    rows
      .filter((r) => !filterStatus || r.validityStatus === filterStatus)
      .filter((r) => !filterStage || r.registrationStage === filterStage)
      .filter((r) => !filterJurisdiction || r.jurisdiction === filterJurisdiction)
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

  function setSort(k: keyof LpaRow) {
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else {
      sortKey = k;
      sortDir = 'asc';
    }
  }

  function rowClass(r: LpaRow): string {
    if (r.validityStatus === 'invalid') return 'bg-red-50';
    if (r.validityStatus === 'needs-correction') return 'bg-amber-50';
    return '';
  }
</script>

<section class="space-y-4">
  <div class="flex flex-wrap items-end gap-3">
    <label>
      <span class="block text-xs font-medium text-slate-600">Validity</span>
      <select class="rounded border border-slate-300 bg-white px-2 py-1 text-sm" bind:value={filterStatus}>
        <option value="">All</option>
        <option value="ready-to-register">Ready to register</option>
        <option value="needs-correction">Needs correction</option>
        <option value="invalid">Invalid</option>
      </select>
    </label>
    <label>
      <span class="block text-xs font-medium text-slate-600">Stage</span>
      <select class="rounded border border-slate-300 bg-white px-2 py-1 text-sm" bind:value={filterStage}>
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="awaiting-signatures">Awaiting signatures</option>
        <option value="submitted-to-opg">Submitted to OPG</option>
        <option value="registered">Registered</option>
        <option value="rejected">Rejected</option>
        <option value="revoked">Revoked</option>
      </select>
    </label>
    <label>
      <span class="block text-xs font-medium text-slate-600">Jurisdiction</span>
      <select class="rounded border border-slate-300 bg-white px-2 py-1 text-sm" bind:value={filterJurisdiction}>
        <option value="">All</option>
        <option value="england">England</option>
        <option value="wales">Wales</option>
      </select>
    </label>
    <p class="ml-auto text-sm text-slate-500">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
  </div>

  <div class="overflow-x-auto rounded-lg bg-white shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-100 text-left">
        <tr>
          <th class="cursor-pointer p-2" onclick={() => setSort('id')}>Reference</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('donorMaskedName')}>Donor</th>
          <th class="p-2">DOB year</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('jurisdiction')}>Jurisdiction</th>
          <th class="p-2">Attorneys</th>
          <th class="p-2">Decision</th>
          <th class="p-2">LST</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('validityStatus')}>Validity</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('completenessScore')}>Complete</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('registrationStage')}>Stage</th>
          <th class="cursor-pointer p-2" onclick={() => setSort('updatedAt')}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as r (r.id)}
          <tr class="{rowClass(r)} border-b border-slate-200 hover:bg-brand-50">
            <td class="p-2 font-mono text-xs">
              <a class="text-brand-700 hover:underline" href="/lpa/{r.id}">{r.id}</a>
            </td>
            <td class="p-2 font-medium">{r.donorMaskedName}</td>
            <td class="p-2 text-slate-600">{r.donorBirthYear}</td>
            <td class="p-2 capitalize">{r.jurisdiction}</td>
            <td class="p-2">{r.attorneyCount}{r.replacementAttorneyCount > 0 ? ` + ${r.replacementAttorneyCount}r` : ''}</td>
            <td class="p-2 text-xs">{r.decisionRule}</td>
            <td class="p-2 text-xs">{r.lstChoice || '—'}</td>
            <td class="p-2"><StatusBadge status={r.validityStatus} /></td>
            <td class="p-2">{r.completenessScore}%</td>
            <td class="p-2 text-xs">{r.registrationStage}</td>
            <td class="p-2 text-xs text-slate-600">{r.updatedAt.slice(0, 10)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <p class="text-xs text-slate-500">
    Sample data shown when the backend is unreachable. In production rows come from the Rust
    backend's <code class="font-mono">/api/lpa</code> endpoint.
  </p>
</section>

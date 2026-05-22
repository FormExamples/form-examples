<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchPrescriptions } from '$lib/api/prescriptions.js';
  import type { PrescriptionRow, Complexity, DashboardEye } from '$lib/data/sample.js';

  let rows = $state<PrescriptionRow[]>([]);
  let search = $state<string>('');
  let complexityFilter = $state<'' | Complexity>('');
  let lensFilter = $state<string>('');
  let flagsFilter = $state<'' | 'yes' | 'no'>('');
  let expiredFilter = $state<'' | 'expired' | 'active'>('');
  let prescriberFilter = $state<string>('');
  let sortKey = $state<'issueDate' | 'expiryDate' | 'patientName' | 'prescriberName' | 'complexity' | 'flagCount'>('issueDate');
  let sortDir = $state<'asc' | 'desc'>('desc');
  let selectedId = $state<string | null>(null);

  const todayIso = new Date().toISOString().slice(0, 10);

  onMount(async () => {
    rows = await fetchPrescriptions();
  });

  const prescribers = $derived(
    Array.from(new Set(rows.map((r) => r.prescriberName))).sort(),
  );

  function rowSortValue(r: PrescriptionRow, key: typeof sortKey): string | number {
    switch (key) {
      case 'issueDate': return r.issueDate;
      case 'expiryDate': return r.expiryDate;
      case 'patientName': return r.patientName.toLowerCase();
      case 'prescriberName': return r.prescriberName.toLowerCase();
      case 'complexity': {
        const ord: Record<Complexity, number> = { simple: 0, moderate: 1, complex: 2 };
        return ord[r.complexity];
      }
      case 'flagCount': return r.flags.length;
    }
  }

  const filtered = $derived(
    rows
      .filter((r) => {
        if (search) {
          const s = search.toLowerCase();
          if (
            !r.patientName.toLowerCase().includes(s) &&
            !r.prescriberName.toLowerCase().includes(s) &&
            !r.prescriberGoc.toLowerCase().includes(s) &&
            !r.practiceName.toLowerCase().includes(s)
          ) return false;
        }
        if (complexityFilter && r.complexity !== complexityFilter) return false;
        if (lensFilter && r.lensType !== lensFilter) return false;
        if (flagsFilter === 'yes' && r.flags.length === 0) return false;
        if (flagsFilter === 'no' && r.flags.length > 0) return false;
        if (expiredFilter === 'expired' && r.expiryDate >= todayIso) return false;
        if (expiredFilter === 'active' && r.expiryDate < todayIso) return false;
        if (prescriberFilter && r.prescriberName !== prescriberFilter) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        const va = rowSortValue(a, sortKey);
        const vb = rowSortValue(b, sortKey);
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      }),
  );

  const selected = $derived(rows.find((r) => r.id === selectedId) ?? null);

  function setSort(k: typeof sortKey): void {
    if (sortKey === k) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = k;
      sortDir = (k === 'issueDate' || k === 'expiryDate' || k === 'flagCount' || k === 'complexity') ? 'desc' : 'asc';
    }
  }

  function clickRow(id: string): void {
    selectedId = selectedId === id ? null : id;
    if (selectedId) {
      setTimeout(() => document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  function fmt(n: number | null | undefined, digits = 2): string {
    if (n === null || n === undefined) return '—';
    if (n === 0) return (0).toFixed(digits);
    const s = n.toFixed(digits);
    return n > 0 ? '+' + s : s;
  }
  function cylAx(e: DashboardEye): string {
    if (e.cylinderDiopters === null && e.axisDegrees === null) return '—';
    return `${fmt(e.cylinderDiopters)} × ${e.axisDegrees ?? '—'}°`;
  }

  function complexityClass(c: Complexity): string {
    if (c === 'complex') return 'bg-red-100 text-red-700';
    if (c === 'moderate') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }
  function priorityBorder(p: string): string {
    if (p === 'high') return 'border-red-400 bg-red-50';
    if (p === 'medium') return 'border-amber-400 bg-amber-50';
    return 'border-emerald-400 bg-emerald-50';
  }
  const isExpired = (r: PrescriptionRow): boolean => r.expiryDate < todayIso;

  const labelCls = 'text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1';
  const inputCls = 'rounded border border-slate-300 px-2 py-1 text-sm bg-white min-w-40 focus:outline-none focus:ring-2 focus:ring-brand-500';
</script>

<!-- Filter bar -->
<section class="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3 flex flex-wrap gap-x-3 gap-y-2 items-end" aria-label="Filters">
  <div class="flex flex-col">
    <label class={labelCls} for="f-search">Search</label>
    <input id="f-search" type="search" class={inputCls} placeholder="Patient, prescriber, GOC…" bind:value={search} />
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-complex">Complexity</label>
    <select id="f-complex" class={inputCls} bind:value={complexityFilter}>
      <option value="">All</option>
      <option value="simple">Simple</option>
      <option value="moderate">Moderate</option>
      <option value="complex">Complex</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-lens">Lens type</label>
    <select id="f-lens" class={inputCls} bind:value={lensFilter}>
      <option value="">All</option>
      <option value="single-vision-distance">Single vision distance</option>
      <option value="single-vision-near">Single vision near</option>
      <option value="bifocal">Bifocal</option>
      <option value="varifocal">Varifocal</option>
      <option value="occupational-varifocal">Occupational varifocal</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-flags">Flags</label>
    <select id="f-flags" class={inputCls} bind:value={flagsFilter}>
      <option value="">All</option>
      <option value="yes">With flags</option>
      <option value="no">No flags</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-expiry">Expiry</label>
    <select id="f-expiry" class={inputCls} bind:value={expiredFilter}>
      <option value="">All</option>
      <option value="expired">Expired</option>
      <option value="active">Active</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-presc">Prescriber</label>
    <select id="f-presc" class={inputCls} bind:value={prescriberFilter}>
      <option value="">All</option>
      {#each prescribers as p (p)}
        <option value={p}>{p}</option>
      {/each}
    </select>
  </div>
  <p class="text-sm text-slate-500 ml-auto self-end">
    {filtered.length} of {rows.length} prescriptions
  </p>
</section>

<!-- Grid -->
<div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
  <table class="min-w-full text-sm">
    <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
      <tr>
        <th class="p-2 text-left cursor-pointer" onclick={() => setSort('issueDate')}>Issue date</th>
        <th class="p-2 text-left cursor-pointer" onclick={() => setSort('patientName')}>Patient</th>
        <th class="p-2 text-left cursor-pointer" onclick={() => setSort('prescriberName')}>Prescriber</th>
        <th class="p-2 text-right">R SPH</th>
        <th class="p-2 text-right">R CYL × Ax</th>
        <th class="p-2 text-right">L SPH</th>
        <th class="p-2 text-right">L CYL × Ax</th>
        <th class="p-2 text-right">ADD</th>
        <th class="p-2 text-left cursor-pointer" onclick={() => setSort('complexity')}>Complexity</th>
        <th class="p-2 text-right cursor-pointer" onclick={() => setSort('flagCount')}>Flags</th>
        <th class="p-2 text-left cursor-pointer" onclick={() => setSort('expiryDate')}>Expiry</th>
        <th class="p-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as r (r.id)}
        <tr
          data-id={r.id}
          class="border-t border-slate-200 hover:bg-brand-50 cursor-pointer {selectedId === r.id ? 'bg-brand-50' : ''}"
          onclick={() => clickRow(r.id)}
        >
          <td class="p-2 whitespace-nowrap">{r.issueDate}</td>
          <td class="p-2 whitespace-nowrap">{r.patientName}</td>
          <td class="p-2 whitespace-nowrap">
            {r.prescriberName}
            <span class="block text-xs text-slate-500">GOC {r.prescriberGoc}</span>
          </td>
          <td class="p-2 text-right tabular-nums">{fmt(r.rightEye.sphereDiopters)}</td>
          <td class="p-2 text-right tabular-nums whitespace-nowrap">{cylAx(r.rightEye)}</td>
          <td class="p-2 text-right tabular-nums">{fmt(r.leftEye.sphereDiopters)}</td>
          <td class="p-2 text-right tabular-nums whitespace-nowrap">{cylAx(r.leftEye)}</td>
          <td class="p-2 text-right tabular-nums">
            {(() => { const a = r.rightEye.additionDiopters ?? r.leftEye.additionDiopters; return a === null ? '—' : fmt(a); })()}
          </td>
          <td class="p-2">
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold {complexityClass(r.complexity)}">{r.complexity}</span>
          </td>
          <td class="p-2 text-right">
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold {r.flags.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}">{r.flags.length}</span>
          </td>
          <td class="p-2 whitespace-nowrap {isExpired(r) ? 'text-red-700 font-semibold' : ''}">{r.expiryDate}</td>
          <td class="p-2">
            <span class="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{r.status}</span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Detail panel -->
{#if selected}
  {@const r = selected}
  <article id="detail" class="mt-4 bg-white rounded-lg shadow-sm border border-slate-200 p-5">
    <button
      type="button"
      class="float-right border border-slate-300 rounded px-3 py-1 text-sm hover:bg-slate-50"
      onclick={() => (selectedId = null)}
    >Close</button>
    <h2 class="text-lg font-semibold mb-2">{r.patientName} — {r.issueDate}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm mb-3">
      <div><span class="text-slate-500">DOB:</span> {r.patientDob}</div>
      <div><span class="text-slate-500">Status:</span> {r.status}</div>
      <div><span class="text-slate-500">Prescriber:</span> {r.prescriberName}</div>
      <div><span class="text-slate-500">GOC:</span> {r.prescriberGoc}</div>
      <div><span class="text-slate-500">Practice:</span> {r.practiceName}</div>
      <div><span class="text-slate-500">Reason:</span> {r.reasonForSightTest}</div>
      <div><span class="text-slate-500">Examination:</span> {r.examinationDate}</div>
      <div><span class="text-slate-500">Expiry:</span> <span class={isExpired(r) ? 'text-red-700 font-semibold' : ''}>{r.expiryDate}</span></div>
    </div>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mt-3 mb-1">Right eye (OD)</h3>
    <table class="w-full text-sm border-t border-slate-200 mb-2">
      <thead>
        <tr class="text-xs uppercase tracking-wide text-slate-500">
          <th class="p-1 text-left">Sphere</th>
          <th class="p-1 text-left">Cylinder</th>
          <th class="p-1 text-left">Axis</th>
          <th class="p-1 text-left">Add</th>
          <th class="p-1 text-left">Prism H</th>
          <th class="p-1 text-left">Prism V</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t border-slate-100">
          <td class="p-1 tabular-nums">{fmt(r.rightEye.sphereDiopters)}</td>
          <td class="p-1 tabular-nums">{fmt(r.rightEye.cylinderDiopters)}</td>
          <td class="p-1">{r.rightEye.axisDegrees ?? '—'}{r.rightEye.axisDegrees != null ? '°' : ''}</td>
          <td class="p-1 tabular-nums">{fmt(r.rightEye.additionDiopters)}</td>
          <td class="p-1">{fmt(r.rightEye.prismHorizontalDiopters)} {r.rightEye.baseHorizontal}</td>
          <td class="p-1">{fmt(r.rightEye.prismVerticalDiopters)} {r.rightEye.baseVertical}</td>
        </tr>
      </tbody>
    </table>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mt-3 mb-1">Left eye (OS)</h3>
    <table class="w-full text-sm border-t border-slate-200 mb-2">
      <thead>
        <tr class="text-xs uppercase tracking-wide text-slate-500">
          <th class="p-1 text-left">Sphere</th>
          <th class="p-1 text-left">Cylinder</th>
          <th class="p-1 text-left">Axis</th>
          <th class="p-1 text-left">Add</th>
          <th class="p-1 text-left">Prism H</th>
          <th class="p-1 text-left">Prism V</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t border-slate-100">
          <td class="p-1 tabular-nums">{fmt(r.leftEye.sphereDiopters)}</td>
          <td class="p-1 tabular-nums">{fmt(r.leftEye.cylinderDiopters)}</td>
          <td class="p-1">{r.leftEye.axisDegrees ?? '—'}{r.leftEye.axisDegrees != null ? '°' : ''}</td>
          <td class="p-1 tabular-nums">{fmt(r.leftEye.additionDiopters)}</td>
          <td class="p-1">{fmt(r.leftEye.prismHorizontalDiopters)} {r.leftEye.baseHorizontal}</td>
          <td class="p-1">{fmt(r.leftEye.prismVerticalDiopters)} {r.leftEye.baseVertical}</td>
        </tr>
      </tbody>
    </table>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mt-3 mb-1">Lens recommendation</h3>
    <p class="text-sm"><strong>{r.lensType}</strong>, {r.material}</p>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mt-3 mb-1">Classification</h3>
    <p class="text-sm">
      Complexity:
      <span class="px-2 py-0.5 rounded-full text-xs font-semibold {complexityClass(r.complexity)}">{r.complexity}</span>
    </p>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mt-3 mb-1">Safety flags ({r.flags.length})</h3>
    {#if r.flags.length === 0}
      <p class="text-sm text-slate-500">No flags fired.</p>
    {:else}
      <ul class="space-y-1.5">
        {#each r.flags as f}
          <li class="border-l-4 pl-3 py-2 rounded {priorityBorder(f.priority)}">
            <div class="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{f.category} · {f.priority} · {f.eye}</div>
            <div class="text-sm">{f.description}</div>
            <div class="text-xs italic text-slate-600 mt-1">{f.suggestedAction}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </article>
{/if}

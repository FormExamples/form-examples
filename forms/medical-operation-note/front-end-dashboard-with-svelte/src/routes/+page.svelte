<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOperationNotes } from '$lib/api.js';
  import { DASHBOARD_COLUMNS } from '$lib/columns.js';
  import type {
    OperationNoteRow,
    CompositeRisk,
    ClavienDindo,
    NcepodUrgency,
  } from '$lib/sample-data.js';
  import RiskBadge from '$lib/badges/RiskBadge.svelte';
  import ClavienDindoBadge from '$lib/badges/ClavienDindoBadge.svelte';
  import UrgencyBadge from '$lib/badges/UrgencyBadge.svelte';
  import SignedBadge from '$lib/badges/SignedBadge.svelte';
  import NeverEventBadge from '$lib/badges/NeverEventBadge.svelte';
  import CountsBadge from '$lib/badges/CountsBadge.svelte';

  let rows = $state<OperationNoteRow[]>([]);
  let selectedId = $state<string | null>(null);

  // SVAR-style dropdown filters
  let compositeRiskFilter = $state<'' | CompositeRisk>('');
  let clavienDindoFilter = $state<'' | ClavienDindo>('');
  let urgencyFilter = $state<'' | NcepodUrgency>('');
  let neverEventFilter = $state<'' | 'yes' | 'no'>('');
  let signedFilter = $state<'' | 'signed' | 'unsigned'>('');

  type SortKey =
    | 'hospital' | 'theatre' | 'listType' | 'surgeon' | 'patientLabel'
    | 'primaryProcedureName' | 'urgency' | 'compositeRisk' | 'clavienDindoGrade'
    | 'estimatedBloodLossMl' | 'countsAgreed' | 'neverEventFlagged'
    | 'recoveryDestination' | 'signedAt';
  let sortKey = $state<SortKey>('signedAt');
  let sortDir = $state<'asc' | 'desc'>('desc');

  onMount(async () => {
    rows = await fetchOperationNotes();
  });

  const RISK_ORDER: Record<CompositeRisk, number> = {
    routine: 0, complicated: 1, 'high-risk': 2, critical: 3,
  };
  const CD_ORDER: Record<ClavienDindo, number> = {
    '0': 0, I: 1, II: 2, IIIa: 3, IIIb: 4, IVa: 5, IVb: 6, V: 7,
  };
  const URG_ORDER: Record<NcepodUrgency, number> = {
    elective: 0, expedited: 1, urgent: 2, immediate: 3,
  };

  function rowSortValue(r: OperationNoteRow, key: SortKey): string | number {
    switch (key) {
      case 'compositeRisk': return RISK_ORDER[r.compositeRisk];
      case 'clavienDindoGrade': return CD_ORDER[r.clavienDindoGrade];
      case 'urgency': return URG_ORDER[r.urgency];
      case 'estimatedBloodLossMl': return r.estimatedBloodLossMl;
      case 'countsAgreed': return r.countsAgreed ? 1 : 0;
      case 'neverEventFlagged': return r.neverEventFlagged ? 1 : 0;
      case 'signedAt': return r.signedAt || '';
      default: return String(r[key] ?? '').toLowerCase();
    }
  }

  const filtered = $derived(
    rows
      .filter((r) => {
        if (compositeRiskFilter && r.compositeRisk !== compositeRiskFilter) return false;
        if (clavienDindoFilter && r.clavienDindoGrade !== clavienDindoFilter) return false;
        if (urgencyFilter && r.urgency !== urgencyFilter) return false;
        if (neverEventFilter === 'yes' && !r.neverEventFlagged) return false;
        if (neverEventFilter === 'no' && r.neverEventFlagged) return false;
        if (signedFilter === 'signed' && r.signedAt === '') return false;
        if (signedFilter === 'unsigned' && r.signedAt !== '') return false;
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

  function setSort(k: SortKey): void {
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else {
      sortKey = k;
      sortDir = k === 'estimatedBloodLossMl' || k === 'signedAt' ||
                k === 'compositeRisk' || k === 'clavienDindoGrade' ||
                k === 'urgency' || k === 'neverEventFlagged' ? 'desc' : 'asc';
    }
  }

  function clickRow(id: string): void {
    selectedId = selectedId === id ? null : id;
    if (selectedId) {
      setTimeout(
        () => document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        50,
      );
    }
  }

  function fmtTimestamp(iso: string): string {
    if (!iso) return '—';
    return iso.replace('T', ' ').replace('Z', '').slice(0, 16);
  }

  function listTypeLabel(t: string): string {
    return t.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  }

  function destinationLabel(t: string): string {
    return t.replace(/-/g, ' ').toUpperCase();
  }

  const labelCls = 'text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1';
  const inputCls = 'rounded border border-slate-300 px-2 py-1 text-sm bg-white min-w-36 focus:outline-none focus:ring-2 focus:ring-brand-500';
  const thBase = 'p-2 text-left whitespace-nowrap';

  function sortIndicator(k: SortKey): string {
    if (sortKey !== k) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }
</script>

<!-- Filter bar (SVAR-style dropdown filters) -->
<section
  class="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3 flex flex-wrap gap-x-3 gap-y-2 items-end"
  aria-label="Filters"
>
  <div class="flex flex-col">
    <label class={labelCls} for="f-risk">Composite risk</label>
    <select id="f-risk" class={inputCls} bind:value={compositeRiskFilter}>
      <option value="">All</option>
      <option value="routine">Routine</option>
      <option value="complicated">Complicated</option>
      <option value="high-risk">High-risk</option>
      <option value="critical">Critical</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-cd">Clavien–Dindo</label>
    <select id="f-cd" class={inputCls} bind:value={clavienDindoFilter}>
      <option value="">All</option>
      <option value="0">0</option>
      <option value="I">I</option>
      <option value="II">II</option>
      <option value="IIIa">IIIa</option>
      <option value="IIIb">IIIb</option>
      <option value="IVa">IVa</option>
      <option value="IVb">IVb</option>
      <option value="V">V</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-urg">Urgency</label>
    <select id="f-urg" class={inputCls} bind:value={urgencyFilter}>
      <option value="">All</option>
      <option value="elective">Elective</option>
      <option value="expedited">Expedited</option>
      <option value="urgent">Urgent</option>
      <option value="immediate">Immediate</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-ne">Never event</label>
    <select id="f-ne" class={inputCls} bind:value={neverEventFilter}>
      <option value="">All</option>
      <option value="yes">Flagged</option>
      <option value="no">Not flagged</option>
    </select>
  </div>
  <div class="flex flex-col">
    <label class={labelCls} for="f-sign">Sign-off</label>
    <select id="f-sign" class={inputCls} bind:value={signedFilter}>
      <option value="">All</option>
      <option value="signed">Signed</option>
      <option value="unsigned">Unsigned</option>
    </select>
  </div>
  <p class="text-sm text-slate-500 ml-auto self-end">
    {filtered.length} of {rows.length} op notes
  </p>
</section>

<!-- Data grid -->
<div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
  <table class="min-w-full text-sm">
    <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
      <tr>
        {#each DASHBOARD_COLUMNS as col (col.id)}
          {@const sk = (col.id === 'patient' ? 'patientLabel'
                       : col.id === 'procedure' ? 'primaryProcedureName'
                       : col.id) as SortKey}
          <th
            class="{thBase} {col.sort ? 'cursor-pointer hover:text-brand-700' : ''} {col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}"
            style="min-width: {col.width}px"
            onclick={() => col.sort && setSort(sk)}
          >
            {col.header}{col.sort ? sortIndicator(sk) : ''}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each filtered as r (r.id)}
        <tr
          data-id={r.id}
          class="border-t border-slate-200 hover:bg-brand-50 cursor-pointer {selectedId === r.id ? 'bg-brand-50' : ''}"
          onclick={() => clickRow(r.id)}
        >
          <td class="p-2 whitespace-nowrap">{r.hospital}</td>
          <td class="p-2 whitespace-nowrap font-mono text-xs">{r.theatre}</td>
          <td class="p-2 whitespace-nowrap">{listTypeLabel(r.listType)}</td>
          <td class="p-2 whitespace-nowrap">
            {r.surgeon}
            <span class="block text-xs text-slate-500">{r.surgeonGmc}</span>
          </td>
          <td class="p-2 whitespace-nowrap font-mono text-xs">{r.patientLabel}</td>
          <td class="p-2">
            <span class="font-mono text-xs text-slate-500">{r.primaryProcedureOpcs4}</span>
            <span class="block">{r.primaryProcedureName}</span>
          </td>
          <td class="p-2"><UrgencyBadge urgency={r.urgency} /></td>
          <td class="p-2"><RiskBadge risk={r.compositeRisk} /></td>
          <td class="p-2 text-center"><ClavienDindoBadge grade={r.clavienDindoGrade} /></td>
          <td class="p-2 text-right tabular-nums">{r.estimatedBloodLossMl}</td>
          <td class="p-2 text-center"><CountsBadge agreed={r.countsAgreed} /></td>
          <td class="p-2 text-center"><NeverEventBadge flagged={r.neverEventFlagged} /></td>
          <td class="p-2 whitespace-nowrap text-xs">{destinationLabel(r.recoveryDestination)}</td>
          <td class="p-2 whitespace-nowrap text-xs">
            <SignedBadge signedAt={r.signedAt} />
            {#if r.signedAt}
              <span class="block text-slate-500 mt-0.5">{fmtTimestamp(r.signedAt)}</span>
            {/if}
          </td>
        </tr>
      {/each}
      {#if filtered.length === 0}
        <tr>
          <td colspan={DASHBOARD_COLUMNS.length} class="p-6 text-center text-slate-500">
            No op notes match the current filters.
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

<!-- Detail panel -->
{#if selected}
  {@const r = selected}
  <article
    id="detail"
    class="mt-4 bg-white rounded-lg shadow-sm border border-slate-200 p-5"
    aria-labelledby="detail-title"
  >
    <button
      type="button"
      class="float-right border border-slate-300 rounded px-3 py-1 text-sm hover:bg-slate-50"
      onclick={() => (selectedId = null)}
    >Close</button>

    <h2 id="detail-title" class="text-lg font-semibold mb-1">
      {r.primaryProcedureName}
      <span class="text-slate-500 font-mono text-sm">({r.primaryProcedureOpcs4})</span>
    </h2>
    <p class="text-sm text-slate-600 mb-3">
      {r.hospital} · Theatre {r.theatre} · {listTypeLabel(r.listType)} list · {r.specialty}
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-6 text-sm mb-4">
      <div><span class="text-slate-500">Patient:</span> {r.patientLabel} ({r.patientAgeYears}y {r.patientSex})</div>
      <div><span class="text-slate-500">Lead surgeon:</span> {r.surgeon} ({r.surgeonGmc})</div>
      <div><span class="text-slate-500">Anaesthetist:</span> {r.anaesthetist}</div>
      <div><span class="text-slate-500">Knife to skin:</span> {fmtTimestamp(r.knifeToSkinAt)}</div>
      <div><span class="text-slate-500">End of surgery:</span> {fmtTimestamp(r.endOfSurgeryAt)}</div>
      <div><span class="text-slate-500">Duration:</span> {r.durationMinutes} min</div>
      <div><span class="text-slate-500">ASA:</span> {r.asaPhysicalStatus}</div>
      <div><span class="text-slate-500">Transfusion (PRBC):</span> {r.transfusionUnitsPrbc} units</div>
      <div><span class="text-slate-500">Conversion to open:</span> {r.conversionToOpen ? 'Yes' : 'No'}</div>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Composite</span>
      <RiskBadge risk={r.compositeRisk} />
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Clavien–Dindo</span>
      <ClavienDindoBadge grade={r.clavienDindoGrade} />
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Urgency</span>
      <UrgencyBadge urgency={r.urgency} />
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Counts</span>
      <CountsBadge agreed={r.countsAgreed} />
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Never event</span>
      <NeverEventBadge flagged={r.neverEventFlagged} />
      <span class="text-xs uppercase tracking-wide text-slate-500 font-semibold">Sign-off</span>
      <SignedBadge signedAt={r.signedAt} />
    </div>

    <h3 class="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-2">
      Safety flags ({r.safetyFlags.length})
    </h3>
    {#if r.safetyFlags.length === 0}
      <p class="text-sm text-slate-500">No flags fired.</p>
    {:else}
      <ul class="space-y-1.5">
        {#each r.safetyFlags as f (f.code)}
          {@const borderCls = f.priority === 'high'
            ? 'border-red-400 bg-red-50'
            : f.priority === 'medium'
              ? 'border-amber-400 bg-amber-50'
              : 'border-emerald-400 bg-emerald-50'}
          <li class="border-l-4 pl-3 py-2 rounded {borderCls}">
            <div class="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
              {f.code} · {f.priority}
            </div>
            <div class="text-sm">{f.description}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </article>
{/if}

<p class="text-xs text-slate-500 mt-4">
  Standalone mode: rows come from <code>src/lib/sample-data.ts</code>.
  In production the Loco backend serves <code>/api/operation-notes</code>.
</p>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Grid, Willow } from '@svar-ui/svelte-grid';
  import { fetchChecklists } from '$lib/data/api.js';
  import { computeSafetyFlags } from '$lib/checklist/safety-flags.js';
  import type {
    ChecklistRow,
    ChecklistStatus,
    Urgency,
  } from '$lib/checklist/types.js';

  let rows = $state<ChecklistRow[]>([]);
  let loading = $state<boolean>(true);

  let filterStatus = $state<string>('');
  let filterUrgency = $state<string>('');
  let filterSpecialty = $state<string>('');
  let search = $state<string>('');

  let selectedId = $state<string>('');

  onMount(async () => {
    rows = await fetchChecklists();
    loading = false;
  });

  // Distinct specialties seen in the data, for the dropdown.
  const specialties = $derived<string[]>(
    Array.from(
      new Set(
        rows
          .map((r) => r.surgicalSpecialty)
          .filter((s) => s && s.length > 0),
      ),
    ).sort(),
  );

  const filteredRows = $derived<ChecklistRow[]>(
    rows.filter((r) => {
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterUrgency && r.urgency !== filterUrgency) return false;
      if (filterSpecialty && r.surgicalSpecialty !== filterSpecialty)
        return false;
      if (search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        const hay = [
          r.patientName,
          r.patientNhsNumber,
          r.surgeonName,
          r.anaesthetistName,
          r.leadNurseName,
          r.siteName,
          r.operatingRoom,
          r.plannedProcedure,
          r.surgicalSpecialty,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }),
  );

  // SVAR Grid consumes plain objects keyed by `id`.
  const gridData = $derived(
    filteredRows.map((r) => ({
      id: r.id,
      caseDate: r.caseDate,
      patientName: r.patientName,
      siteName: r.siteName,
      operatingRoom: r.operatingRoom,
      surgeonName: r.surgeonName,
      anaesthetistName: r.anaesthetistName,
      urgency: r.urgency,
      surgicalSpecialty: r.surgicalSpecialty,
      status: r.status,
      flagCount: r.flagCount,
    })),
  );

  const columns = [
    { id: 'caseDate', header: 'Case date', sort: true, width: 120 },
    { id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
    { id: 'siteName', header: 'Site', flexgrow: 2, sort: true },
    { id: 'operatingRoom', header: 'Theatre / OR', sort: true, width: 120 },
    { id: 'surgeonName', header: 'Surgeon', flexgrow: 2, sort: true },
    { id: 'anaesthetistName', header: 'Anaesthetist', flexgrow: 2, sort: true },
    { id: 'urgency', header: 'Urgency', sort: true, width: 110 },
    { id: 'surgicalSpecialty', header: 'Specialty', flexgrow: 2, sort: true },
    { id: 'status', header: 'Status', sort: true, width: 160 },
    { id: 'flagCount', header: 'Flags', sort: true, width: 80 },
  ];

  const selectedRow = $derived<ChecklistRow | null>(
    selectedId ? rows.find((r) => r.id === selectedId) ?? null : null,
  );

  const selectedFlags = $derived(
    selectedRow ? computeSafetyFlags(selectedRow.checklist) : [],
  );

  const STATUS_LABELS: Record<ChecklistStatus, string> = {
    'not-started': 'Not started',
    'sign-in-complete': 'Sign In complete',
    'time-out-complete': 'Time Out complete',
    'sign-out-complete': 'Sign Out complete',
    completed: 'Completed',
    abandoned: 'Abandoned',
  };

  const URGENCY_LABELS: Record<Exclude<Urgency, ''>, string> = {
    elective: 'Elective',
    urgent: 'Urgent',
    emergency: 'Emergency',
    immediate: 'Immediate',
  };

  function handleRowClick(e: CustomEvent<{ row: { id: string } }>) {
    const id = e.detail?.row?.id;
    if (id) selectedId = id;
  }

  function clearSelection() {
    selectedId = '';
  }

  function clearFilters() {
    filterStatus = '';
    filterUrgency = '';
    filterSpecialty = '';
    search = '';
  }

  function severityClass(sev: 'low' | 'medium' | 'high'): string {
    if (sev === 'high') return 'bg-red-100 text-red-800';
    if (sev === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  function fmtTimestamp(ts: string | null): string {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  }
</script>

<section class="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
  <label class="block">
    <span class="text-xs font-medium text-slate-600 block mb-1">Status</span>
    <select class="border rounded px-2 py-1 w-full" bind:value={filterStatus}>
      <option value="">All</option>
      <option value="not-started">Not started</option>
      <option value="sign-in-complete">Sign In complete</option>
      <option value="time-out-complete">Time Out complete</option>
      <option value="sign-out-complete">Sign Out complete</option>
      <option value="completed">Completed</option>
      <option value="abandoned">Abandoned</option>
    </select>
  </label>

  <label class="block">
    <span class="text-xs font-medium text-slate-600 block mb-1">Urgency</span>
    <select class="border rounded px-2 py-1 w-full" bind:value={filterUrgency}>
      <option value="">All</option>
      <option value="elective">Elective</option>
      <option value="urgent">Urgent</option>
      <option value="emergency">Emergency</option>
      <option value="immediate">Immediate</option>
    </select>
  </label>

  <label class="block">
    <span class="text-xs font-medium text-slate-600 block mb-1">Specialty</span>
    <select
      class="border rounded px-2 py-1 w-full"
      bind:value={filterSpecialty}
    >
      <option value="">All</option>
      {#each specialties as s (s)}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </label>

  <label class="block sm:col-span-2 lg:col-span-1">
    <span class="text-xs font-medium text-slate-600 block mb-1">Search</span>
    <input
      type="search"
      class="border rounded px-2 py-1 w-full"
      placeholder="Patient, surgeon, procedure…"
      bind:value={search}
    />
  </label>

  <div class="flex items-end">
    <button
      type="button"
      class="border rounded px-3 py-1 text-sm bg-white hover:bg-slate-50"
      onclick={clearFilters}
    >
      Clear filters
    </button>
  </div>
</section>

<p class="text-sm text-slate-600 mb-2">
  Showing <span class="font-semibold">{filteredRows.length}</span>
  of <span class="font-semibold">{rows.length}</span> cases
</p>

<div class="bg-white rounded-lg shadow p-2">
  {#if loading}
    <p class="p-6 text-sm text-slate-500">Loading checklists…</p>
  {:else}
    <Willow>
      <div style="height: 560px">
        <Grid data={gridData} {columns} on:rowclick={handleRowClick} />
      </div>
    </Willow>
  {/if}
</div>

<p class="text-xs text-slate-500 mt-3">
  Click any row to open the case drawer. The dashboard falls back to bundled
  sample data when the backend API is unreachable.
</p>

{#if selectedRow}
  <div
    class="fixed inset-0 z-40 bg-black/30"
    role="presentation"
    onclick={clearSelection}
    onkeydown={(e) => {
      if (e.key === 'Escape') clearSelection();
    }}
  ></div>
  <aside
    class="fixed top-0 right-0 z-50 h-full w-full sm:w-[640px] bg-white shadow-xl overflow-y-auto"
    aria-label="Case detail"
  >
    <header class="sticky top-0 bg-white border-b px-5 py-4 flex items-start gap-3">
      <div class="flex-1">
        <p class="text-xs text-slate-500 uppercase tracking-wide">
          {selectedRow.caseDate || '—'} · {selectedRow.siteName} ·
          {selectedRow.operatingRoom}
        </p>
        <h2 class="text-lg font-bold text-slate-900">
          {selectedRow.patientName}
        </h2>
        <p class="text-sm text-slate-600">
          {selectedRow.plannedProcedure || '(no procedure recorded)'}
        </p>
        <p class="text-xs text-slate-500 mt-1">
          {URGENCY_LABELS[selectedRow.urgency as Exclude<Urgency, ''>] ??
            '—'} · {selectedRow.surgicalSpecialty || '—'} ·
          {STATUS_LABELS[selectedRow.status]}
        </p>
      </div>
      <button
        type="button"
        class="border rounded px-2 py-1 text-sm bg-white hover:bg-slate-50"
        onclick={clearSelection}
        aria-label="Close"
      >
        Close
      </button>
    </header>

    <div class="p-5 space-y-6 text-sm">
      <section>
        <h3 class="font-semibold text-slate-800 mb-2">Safety flags</h3>
        {#if selectedFlags.length === 0}
          <p class="text-slate-500">No safety flags raised.</p>
        {:else}
          <ul class="space-y-1">
            {#each selectedFlags as f (f.code)}
              <li class="flex items-center gap-2">
                <span
                  class="inline-block px-2 py-0.5 rounded text-xs font-medium {severityClass(
                    f.severity,
                  )}"
                >
                  {f.severity}
                </span>
                <span>{f.label}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </section>

      <section>
        <h3 class="font-semibold text-slate-800 mb-2">Phase 1 — Sign In</h3>
        <dl class="grid grid-cols-2 gap-x-3 gap-y-1">
          <dt class="text-slate-500">Coordinator</dt>
          <dd>{selectedRow.checklist.signInCoordinatorId ?? '—'}</dd>
          <dt class="text-slate-500">Completed at</dt>
          <dd>{fmtTimestamp(selectedRow.checklist.signInCompletedAt)}</dd>
          <dt class="text-slate-500">Identity/site/procedure/consent</dt>
          <dd>{selectedRow.checklist.signInIdentitySiteProcedureConsent || '—'}</dd>
          <dt class="text-slate-500">Site marked</dt>
          <dd>{selectedRow.checklist.signInSiteMarked || '—'}</dd>
          <dt class="text-slate-500">Anaesthesia check</dt>
          <dd>{selectedRow.checklist.signInAnaesthesiaCheckComplete || '—'}</dd>
          <dt class="text-slate-500">Pulse oximeter</dt>
          <dd>{selectedRow.checklist.signInPulseOximeterOnPatient || '—'}</dd>
          <dt class="text-slate-500">Known allergy</dt>
          <dd>
            {selectedRow.checklist.signInKnownAllergy || '—'}{selectedRow
              .checklist.signInKnownAllergyDetail
              ? ` — ${selectedRow.checklist.signInKnownAllergyDetail}`
              : ''}
          </dd>
          <dt class="text-slate-500">Difficult airway / aspiration</dt>
          <dd>{selectedRow.checklist.signInDifficultAirwayAspirationRisk || '—'}</dd>
          <dt class="text-slate-500">Blood-loss risk</dt>
          <dd>{selectedRow.checklist.signInBloodLossRisk || '—'}</dd>
        </dl>
      </section>

      <section>
        <h3 class="font-semibold text-slate-800 mb-2">Phase 2 — Time Out</h3>
        <dl class="grid grid-cols-2 gap-x-3 gap-y-1">
          <dt class="text-slate-500">Coordinator</dt>
          <dd>{selectedRow.checklist.timeOutCoordinatorId ?? '—'}</dd>
          <dt class="text-slate-500">Completed at</dt>
          <dd>{fmtTimestamp(selectedRow.checklist.timeOutCompletedAt)}</dd>
          <dt class="text-slate-500">Team introductions</dt>
          <dd>{selectedRow.checklist.timeOutTeamIntroductionsConfirmed || '—'}</dd>
          <dt class="text-slate-500">Patient/procedure/incision</dt>
          <dd>
            {selectedRow.checklist.timeOutPatientProcedureIncisionConfirmed || '—'}
          </dd>
          <dt class="text-slate-500">Antibiotic prophylaxis (60 min)</dt>
          <dd>{selectedRow.checklist.timeOutAntibioticProphylaxisWithin60Min || '—'}</dd>
          <dt class="text-slate-500">Critical steps</dt>
          <dd>{selectedRow.checklist.timeOutSurgeonCriticalSteps || '—'}</dd>
          <dt class="text-slate-500">Anticipated duration</dt>
          <dd>
            {selectedRow.checklist.timeOutSurgeonCaseDurationMinutes !== null
              ? `${selectedRow.checklist.timeOutSurgeonCaseDurationMinutes} min`
              : '—'}
          </dd>
          <dt class="text-slate-500">Anticipated blood loss</dt>
          <dd>
            {selectedRow.checklist.timeOutSurgeonAnticipatedBloodLossMl !== null
              ? `${selectedRow.checklist.timeOutSurgeonAnticipatedBloodLossMl} mL`
              : '—'}
          </dd>
          <dt class="text-slate-500">Anaesthetic concerns</dt>
          <dd>{selectedRow.checklist.timeOutAnaesthetistPatientConcerns || '—'}</dd>
          <dt class="text-slate-500">Sterility confirmed</dt>
          <dd>{selectedRow.checklist.timeOutNursingSterilityConfirmed || '—'}</dd>
          <dt class="text-slate-500">Nursing equipment concerns</dt>
          <dd>{selectedRow.checklist.timeOutNursingEquipmentConcerns || '—'}</dd>
          <dt class="text-slate-500">Essential imaging</dt>
          <dd>{selectedRow.checklist.timeOutEssentialImagingDisplayed || '—'}</dd>
        </dl>
      </section>

      <section>
        <h3 class="font-semibold text-slate-800 mb-2">Phase 3 — Sign Out</h3>
        <dl class="grid grid-cols-2 gap-x-3 gap-y-1">
          <dt class="text-slate-500">Coordinator</dt>
          <dd>{selectedRow.checklist.signOutCoordinatorId ?? '—'}</dd>
          <dt class="text-slate-500">Completed at</dt>
          <dd>{fmtTimestamp(selectedRow.checklist.signOutCompletedAt)}</dd>
          <dt class="text-slate-500">Procedure name confirmed</dt>
          <dd>{selectedRow.checklist.signOutProcedureNameConfirmed || '—'}</dd>
          <dt class="text-slate-500">Counts confirmed</dt>
          <dd>{selectedRow.checklist.signOutCountsConfirmed || '—'}</dd>
          <dt class="text-slate-500">Specimens labelled</dt>
          <dd>{selectedRow.checklist.signOutSpecimensLabelled || '—'}</dd>
          <dt class="text-slate-500">Equipment problems</dt>
          <dd>{selectedRow.checklist.signOutEquipmentProblems || '—'}</dd>
          <dt class="text-slate-500">Recovery concerns</dt>
          <dd>{selectedRow.checklist.signOutRecoveryConcerns || '—'}</dd>
        </dl>
      </section>

      <section>
        <h3 class="font-semibold text-slate-800 mb-2">Team roster</h3>
        {#if selectedRow.teamMembers.length === 0}
          <p class="text-slate-500">No team members recorded.</p>
        {:else}
          <ul class="divide-y divide-slate-100 border rounded">
            {#each selectedRow.teamMembers as tm (tm.id)}
              <li class="flex items-center justify-between px-3 py-1.5">
                <span>
                  <span class="font-medium">{tm.name}</span>
                  <span class="text-slate-500"> · {tm.role || '—'}</span>
                </span>
                <span class="text-xs text-slate-500">
                  {tm.introducedDuringTimeOut === 'yes'
                    ? 'Introduced'
                    : 'Not introduced'}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
      </section>

      {#if selectedRow.checklist.abandonedReason}
        <section>
          <h3 class="font-semibold text-slate-800 mb-2">Abandoned reason</h3>
          <p>{selectedRow.checklist.abandonedReason}</p>
        </section>
      {/if}
    </div>
  </aside>
{/if}

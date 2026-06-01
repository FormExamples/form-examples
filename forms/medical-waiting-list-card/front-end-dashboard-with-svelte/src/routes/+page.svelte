<script lang="ts">
  import { Grid, Willow } from '@svar-ui/svelte-grid';
  import { SAMPLE_CARDS } from '$lib/sample-data.js';
  import type { WaitingListCardSummary } from '$lib/types.js';

  // Sample-data fallback so the page works standalone (no backend required).
  const rows = $state<WaitingListCardSummary[]>([...SAMPLE_CARDS]);

  let searchTerm = $state('');
  let specialtyFilter = $state('');
  let priorityFilter = $state('');
  let statusFilter = $state('');
  let gridApi = $state<{ exec: (action: string, opts: unknown) => void } | null>(null);

  const specialtyOptions = [
    { value: '', label: 'All specialties' },
    ...Array.from(new Set(SAMPLE_CARDS.map((c) => c.specialty)))
      .sort()
      .map((s) => ({ value: s, label: s }))
  ];

  const priorityOptions = [
    { value: '', label: 'All priorities' },
    { value: 'P1a', label: 'P1a — Emergency (24 h)' },
    { value: 'P1b', label: 'P1b — Urgent (72 h)' },
    { value: 'P2', label: 'P2 — Cancer / time-critical (4 wk)' },
    { value: 'P3', label: 'P3 — Substantial harm (12 wk)' },
    { value: 'P4', label: 'P4 — Routine (18-wk RTT)' },
    { value: 'P5', label: 'P5 — Deferred (6 mo)' },
    { value: 'P6', label: 'P6 — Removed from list' }
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'within-target', label: 'Within target' },
    { value: 'approaching-breach', label: 'Approaching breach' },
    { value: 'breached', label: 'Breached' },
    { value: 'long-wait', label: 'Long wait (> 52 wk)' }
  ];

  function humaniseStatus(v: string): string {
    const map: Record<string, string> = {
      'within-target': 'Within target',
      'approaching-breach': 'Approaching breach',
      breached: 'Breached',
      'long-wait': 'Long wait (> 52 wk)'
    };
    return map[v] ?? v;
  }

  function highestFlagPriority(flags: WaitingListCardSummary['flags']): string {
    if (flags.some((f) => f.priority === 'high')) return 'high';
    if (flags.some((f) => f.priority === 'medium')) return 'medium';
    if (flags.length > 0) return 'low';
    return '';
  }

  const columns = [
    { id: 'patientName', header: 'Patient', flexgrow: 1, sort: true },
    { id: 'nhsNumber', header: 'NHS number', width: 130, sort: true },
    { id: 'specialty', header: 'Specialty', width: 170, sort: true },
    {
      id: 'procedureDescription',
      header: 'Procedure',
      flexgrow: 1,
      sort: true
    },
    { id: 'clinicalPriority', header: 'Priority', width: 80, sort: true },
    { id: 'rttClockStartDate', header: 'Clock-start', width: 120, sort: true },
    { id: 'weeksWaited', header: 'Weeks', width: 80, sort: true },
    {
      id: 'waitingTimeStatus',
      header: 'Waiting Time Status',
      width: 180,
      sort: true,
      template: (v: string) => humaniseStatus(v)
    },
    {
      id: 'nextAppointmentDate',
      header: 'Next appt',
      width: 120,
      sort: true,
      template: (v: string | null) => v ?? '—'
    },
    { id: 'practitionerName', header: 'Practitioner', width: 160, sort: true },
    {
      id: 'flags',
      header: 'Flags',
      width: 90,
      sort: false,
      template: (v: WaitingListCardSummary['flags']) =>
        v.length === 0
          ? '—'
          : `${v.length} (${highestFlagPriority(v)})`
    }
  ];

  function init(api: { exec: (action: string, opts: unknown) => void }) {
    gridApi = api;
    api.exec('sort-rows', { key: 'weeksWaited', order: 'desc' });
  }

  function applyFilters() {
    if (!gridApi) return;
    const term = searchTerm.toLowerCase();

    const filter = (row: WaitingListCardSummary): boolean => {
      if (term) {
        const matches =
          row.patientName.toLowerCase().includes(term) ||
          row.nhsNumber.toLowerCase().includes(term) ||
          row.procedureDescription.toLowerCase().includes(term) ||
          row.specialty.toLowerCase().includes(term) ||
          row.practitionerName.toLowerCase().includes(term);
        if (!matches) return false;
      }
      if (specialtyFilter && row.specialty !== specialtyFilter) return false;
      if (priorityFilter && row.clinicalPriority !== priorityFilter) return false;
      if (statusFilter && row.waitingTimeStatus !== statusFilter) return false;
      return true;
    };

    gridApi.exec('filter-rows', { filter });
  }

  function clearFilters() {
    searchTerm = '';
    specialtyFilter = '';
    priorityFilter = '';
    statusFilter = '';
    if (gridApi) gridApi.exec('filter-rows', { filter: () => true });
  }

  const hasActiveFilters = $derived(
    searchTerm !== '' || specialtyFilter !== '' || priorityFilter !== '' || statusFilter !== ''
  );

  const totals = $derived({
    all: rows.length,
    breached: rows.filter((r) => r.waitingTimeStatus === 'breached').length,
    approaching: rows.filter((r) => r.waitingTimeStatus === 'approaching-breach').length,
    longWait: rows.filter((r) => r.waitingTimeStatus === 'long-wait').length,
    highFlags: rows.filter((r) => r.flags.some((f) => f.priority === 'high')).length
  });
</script>

<!-- Summary cards -->
<section class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
  <div class="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <p class="text-xs uppercase tracking-wide text-nhs-muted">Cards</p>
    <p class="text-2xl font-bold text-nhs-text">{totals.all}</p>
  </div>
  <div class="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <p class="text-xs uppercase tracking-wide text-nhs-muted">Approaching</p>
    <p class="text-2xl font-bold text-nhs-warm-yellow">{totals.approaching}</p>
  </div>
  <div class="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <p class="text-xs uppercase tracking-wide text-nhs-muted">Breached</p>
    <p class="text-2xl font-bold text-nhs-red">{totals.breached}</p>
  </div>
  <div class="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <p class="text-xs uppercase tracking-wide text-nhs-muted">Long-wait</p>
    <p class="text-2xl font-bold text-nhs-red">{totals.longWait}</p>
  </div>
  <div class="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <p class="text-xs uppercase tracking-wide text-nhs-muted">High flags</p>
    <p class="text-2xl font-bold text-nhs-red">{totals.highFlags}</p>
  </div>
</section>

<!-- Filter bar -->
<div class="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
  <div class="flex flex-wrap items-end gap-3">
    <div class="min-w-[16rem] flex-1">
      <label for="filter-search" class="mb-1 block text-sm font-semibold text-slate-700">
        Search
      </label>
      <input
        id="filter-search"
        type="search"
        placeholder="Patient, NHS number, specialty, procedure, practitioner..."
        bind:value={searchTerm}
        oninput={applyFilters}
        class="w-full rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      />
    </div>

    <div>
      <label for="filter-specialty" class="mb-1 block text-sm font-semibold text-slate-700">
        Specialty
      </label>
      <select
        id="filter-specialty"
        bind:value={specialtyFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each specialtyOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="filter-priority" class="mb-1 block text-sm font-semibold text-slate-700">
        Clinical priority
      </label>
      <select
        id="filter-priority"
        bind:value={priorityFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each priorityOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="filter-status" class="mb-1 block text-sm font-semibold text-slate-700">
        Waiting Time Status
      </label>
      <select
        id="filter-status"
        bind:value={statusFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each statusOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if hasActiveFilters}
      <button
        type="button"
        onclick={clearFilters}
        class="rounded-md border-2 border-nhs-blue bg-white px-3 py-2 text-sm font-semibold text-nhs-blue hover:bg-blue-50"
      >
        Clear filters
      </button>
    {/if}
  </div>

  <p class="mt-3 text-xs text-slate-500">
    {rows.length} cards loaded (sample data — backend not yet wired).
  </p>
</div>

<!-- Data grid -->
<div class="rounded-md bg-white shadow-sm" style="height: 600px;">
  <Willow>
    <Grid data={rows} {columns} {init} />
  </Willow>
</div>

<p class="mt-4 text-xs text-slate-500">
  Waiting Time Status is computed by the rule-based grader (NHS RTT 18-week
  standard + clinical priority targets P1–P6 + 52-week long-waiter rule).
  Final operational decisions remain with the booking team.
</p>

<script lang="ts">
  import { goto } from '$app/navigation';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  // A column's template, typed as it was written, as a DataGrid format. A missing
  // value (null, undefined or '') is left to the grid's emptyValue.
  const fmt =
    <T,>(template: (value: T, row: DataGridRow) => string) =>
    (value: unknown, row: DataGridRow): string =>
      value === null || value === undefined || value === '' ? '' : template(value as T, row);
  import { sampleCardRows } from '#lib/data/sample-reports.js';
  import { waitingTimeStatusLabel } from '#lib/engine/utils.js';
  import type { WaitingTimeStatus } from '#lib/engine/types.js';

  let priorityFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleCardRows.filter(
      (r) =>
        (priorityFilter === '' || r.clinicalPriority === priorityFilter) &&
        (statusFilter === '' || r.waitingTimeStatus === statusFilter)
    )
  );

  // SVAR DataGrid columns. The Waiting Time Status and flag count render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Card' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'specialty', header: 'Specialty', sortable: true },
    {
      id: 'clinicalPriority',
      header: 'Priority',
      sortable: true
    },

    {
      id: 'rttClockStartDate',
      header: 'Clock-start',
      sortable: true
    },

    {
      id: 'weeksWaited',
      header: 'Weeks',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    {
      id: 'waitingTimeStatus',
      header: 'Waiting Time Status',
      sortable: true,
      format: fmt((v: WaitingTimeStatus) => waitingTimeStatusLabel(v))
    },
    {
      id: 'nextAppointmentDate',
      header: 'Next appt',
      sortable: true,
      format: fmt((v: string | null) => v ?? '—')
    },
    { id: 'practitionerName', header: 'Practitioner', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'weeksWaited',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/immunology-waiting-list-card/immunology-waiting-list-cards/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Waiting list — clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Waiting Time Status and flag counts for active waiting list cards, computed by the shared
        engine. Select a row to open the card.
      </p>
    </div>
    <a
      href="/immunology-waiting-list-card/immunology-waiting-list-cards/new"
      class="button"
      data-variant="primary">New card</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Clinical priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="P1a">P1a — Emergency (24 h)</option>
        <option value="P1b">P1b — Urgent (72 h)</option>
        <option value="P2">P2 — Cancer / time-critical (4 wk)</option>
        <option value="P3">P3 — Substantial harm (12 wk)</option>
        <option value="P4">P4 — Routine (18-wk RTT)</option>
        <option value="P5">P5 — Deferred (6 mo)</option>
        <option value="P6">P6 — Removed from list</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Waiting Time Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="within-target">Within target</option>
        <option value="approaching-breach">Approaching breach</option>
        <option value="breached">Breached</option>
        <option value="long-wait">Long wait (> 52 wk)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Waiting list — clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} cards</p>
</main>

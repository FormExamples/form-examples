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
  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
  import { priorityLevelShortLabel } from '#lib/engine/utils.js';
  import type { PriorityLevel } from '#lib/engine/types.js';

  let priorityFilter = $state('');
  let typeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (priorityFilter === '' || r.priorityLevel === priorityFilter) &&
        (typeFilter === '' || r.requestType === typeFilter)
    )
  );

  // SVAR DataGrid columns. The priority classification renders through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'clinicianName', header: 'Clinician', sortable: true },
    { id: 'medicationName', header: 'Medication', sortable: true },
    { id: 'dosage', header: 'Dosage', sortable: true },
    { id: 'requestType', header: 'Type', sortable: true },
    {
      id: 'priorityLevel',
      header: 'Priority',
      sortable: true,
      format: fmt((v: PriorityLevel) => priorityLevelShortLabel(v))
    },
    { id: 'requestDate', header: 'Date', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'requestDate',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/prescription-request/prescription-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Prescription request clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Priority classification and flag counts for prescription requests, computed by the shared
        engine. Select a row to open the request.
      </p>
    </div>
    <a href="/prescription-request/prescription-requests/new" class="button" data-variant="primary"
      >New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Type</span>
      <select class="select inline-block w-auto" bind:value={typeFilter}>
        <option value="">All</option>
        <option value="New">New</option>
        <option value="Refill">Refill</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Prescription request clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} prescription requests</p>
</main>

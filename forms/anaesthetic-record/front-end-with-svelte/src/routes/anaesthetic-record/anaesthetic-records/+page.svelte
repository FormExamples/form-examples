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
  import { statusLabel, urgencyLabel } from '#lib/engine/utils.js';

  let urgencyFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (urgencyFilter === '' || r.urgency === urgencyFilter) &&
        (statusFilter === '' || r.status === statusFilter)
    )
  );

  // SVAR DataGrid columns. Completeness status, percent, and flag count render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
    { id: 'patientIdentifier', header: 'Patient ID', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'theatre', header: 'Theatre', sortable: true },
    {
      id: 'anaesthetistName',
      header: 'Anaesthetist',
      sortable: true
    },

    {
      id: 'urgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => urgencyLabel(v as never) || '—')
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    { id: 'completenessPercent', header: 'Complete %', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true },
    { id: 'operationDate', header: 'Date', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'operationDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/anaesthetic-record/anaesthetic-records/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Anaesthetic record dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, completeness percent, and safety-flag count for anaesthetic records,
        computed by the shared engine. Select a row to open the record.
      </p>
    </div>
    <a href="/anaesthetic-record/anaesthetic-records/new" class="button" data-variant="primary"
      >New record</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="elective">Elective</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
        <option value="immediate">Immediate</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Anaesthetic record dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>

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
  import { statusLabel, careSettingLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let careSettingFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (careSettingFilter === '' || r.careSetting === careSettingFilter)
    )
  );

  // SVAR DataGrid columns. Completeness status, completeness percentage, and the
  // blocking-flag indicator render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Clerking' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Care setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    { id: 'clerkedDate', header: 'Clerked', sortable: true },
    {
      id: 'status',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: '%',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'blocking',
      header: 'Blocking flag',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/history-and-physical-examination/history-and-physical-examinations/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">H and P clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, completeness percentage, and safety flags for clerked patients,
        computed by the shared engine. A blocking flag always forces an incomplete status. Select a
        row to open the clerking.
      </p>
    </div>
    <a
      href="/history-and-physical-examination/history-and-physical-examinations/new"
      class="button"
      data-variant="primary">New clerking</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={careSettingFilter}>
        <option value="">All</option>
        <option value="emergency-department">Emergency department</option>
        <option value="acute-medical-unit">Acute medical unit</option>
        <option value="ward">Ward</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="H and P clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>

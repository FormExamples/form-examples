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
  import { statusLabel, careSettingLabel, formatVolume, formatRate } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (statusFilter === '' || r.status === statusFilter)
    )
  );

  // SVAR DataGrid columns. Total volume, first-phase rate, and plan status
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
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
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    {
      id: 'total24hVolumeMl',
      header: '24 h volume',
      sortable: true,
      format: fmt((v: number | null) => formatVolume(v))
    },
    {
      id: 'first8hRateMlPerHour',
      header: 'First-phase rate',
      format: fmt((v: number | null) => formatRate(v))
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/parkland-formula-for-burns/parkland-formula-for-burns-calculations/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Parkland formula dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Total 24 h volume, first-phase rate, and plan status for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/parkland-formula-for-burns/parkland-formula-for-burns-calculations/new"
      class="button"
      data-variant="primary">New calculation</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="emergency-department">Emergency department</option>
        <option value="burns-unit">Burns unit</option>
        <option value="intensive-care">Intensive care</option>
        <option value="retrieval">Retrieval / transfer</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="planned">Resuscitation planned</option>
        <option value="overdue">Resuscitation overdue</option>
        <option value="incomplete">Awaiting inputs</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Parkland formula dashboard"
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

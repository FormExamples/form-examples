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
  import { riskBandLabel } from '#lib/engine/utils.js';

  const plural = 'national-early-warning-score-2s';

  let bandFilter = $state('');
  let redFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (bandFilter === '' || r.riskBand === bandFilter) &&
        (redFilter === '' || String(r.redScore) === redFilter)
    )
  );

  // SVAR DataGrid columns. Aggregate, risk band, red score, and monitoring
  // frequency render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'wardOrLocation', header: 'Ward / location', sortable: true },
    { id: 'observedDate', header: 'Observed', sortable: true },
    { id: 'aggregate', header: 'NEWS2', sortable: true },
    {
      id: 'riskBand',
      header: 'Risk band',
      sortable: true,
      format: fmt((v: string) => riskBandLabel(v as never))
    },
    {
      id: 'redScore',
      header: 'Red score',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'monitoringFrequency', header: 'Monitoring' },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/national-early-warning-score-2/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">NEWS2 clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Aggregate NEWS2 total, risk band, red-score flag, and recommended monitoring frequency for
        assessed patients, computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/national-early-warning-score-2/{plural}/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="low-medium">Low-medium</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Red score</span>
      <select class="select inline-block w-auto" bind:value={redFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="NEWS2 clinician dashboard"
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

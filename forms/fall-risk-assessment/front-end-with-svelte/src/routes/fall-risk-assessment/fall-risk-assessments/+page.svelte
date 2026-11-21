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
  import { severityLabel, careSettingLabel } from '#lib/engine/utils.js';

  let severityFilter = $state('');
  let careSettingFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.severity === severityFilter) &&
        (careSettingFilter === '' || r.careSetting === careSettingFilter)
    )
  );

  // SVAR DataGrid columns. The Morse Fall Scale total and risk level render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
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
      header: 'Care setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v))
    },
    { id: 'mfsScore', header: 'MFS score', sortable: true },
    {
      id: 'severity',
      header: 'Risk level',
      sortable: true,
      format: fmt((v: string) => severityLabel(v as never))
    },
    {
      id: 'anticoagulantFlag',
      header: 'Anticoag.',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'recurrentFallsFlag',
      header: 'Recurrent',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/fall-risk-assessment/fall-risk-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Fall-risk clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Morse Fall Scale total and risk level for assessed patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a href="/fall-risk-assessment/fall-risk-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk level</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={careSettingFilter}>
        <option value="">All</option>
        <option value="inpatient">Inpatient</option>
        <option value="outpatient">Outpatient</option>
        <option value="community">Community / home</option>
        <option value="long-term-care">Long-term care</option>
        <option value="rehab">Rehabilitation</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Fall-risk clinician dashboard"
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

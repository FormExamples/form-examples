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
  import { combinedSeverityLabel, spaqBandLabel, phq9BandLabel } from '#lib/engine/sad-rules.js';

  let severityFilter = $state('');
  let spaqFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.combinedSeverity === severityFilter) &&
        (spaqFilter === '' || r.spaqBand === spaqFilter)
    )
  );

  // SVAR DataGrid columns. SPAQ GSS, PHQ-9 score, and the combined severity
  // render through the shared engine output so dashboard and report stay aligned.
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
      id: 'spaqScore',
      header: 'SPAQ GSS',
      sortable: true,
      format: fmt(
        (v: number, row: DataGridRow) => `${v}/24 (${spaqBandLabel(row.spaqBand as never)})`
      )
    },
    {
      id: 'phq9Score',
      header: 'PHQ-9',
      sortable: true,
      format: fmt(
        (v: number, row: DataGridRow) => `${v}/27 (${phq9BandLabel(row.phq9Band as never)})`
      )
    },
    {
      id: 'combinedSeverity',
      header: 'Combined severity',
      sortable: true,
      format: fmt((v: string) => combinedSeverityLabel(v as never))
    },

    {
      id: 'riskFlag',
      header: 'Risk',
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
    goto(`/seasonal-affective-disorder-assessment/seasonal-affective-disorder-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">SAD clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        SPAQ Global Seasonality Score, PHQ-9 depression severity, and combined severity for assessed
        patients, computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/seasonal-affective-disorder-assessment/seasonal-affective-disorder-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Combined severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="no-sad">No SAD</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">SPAQ band</span>
      <select class="select inline-block w-auto" bind:value={spaqFilter}>
        <option value="">All</option>
        <option value="no-sad">No SAD</option>
        <option value="subsyndromal">Subsyndromal SAD</option>
        <option value="sad-likely">SAD likely</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="SAD clinician dashboard"
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

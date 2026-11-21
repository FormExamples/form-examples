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
  import { severityLabel } from '#lib/engine/utils.js';
  import type { DassSeverity } from '#lib/engine/types.js';

  let severityFilter = $state('');
  let riskFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.highestSeverity === severityFilter) &&
        (riskFilter === '' ||
          (riskFilter === 'yes' ? r.suicidalIdeationFlag : !r.suicidalIdeationFlag))
    )
  );

  // SVAR DataGrid columns. The DASS-21 subscale severities and the suicidal
  // ideation flag render through the shared engine output so the dashboard and
  // report stay aligned.
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
      id: 'depressionSeverity',
      header: 'Depression',
      sortable: true,
      format: fmt((v: DassSeverity) => severityLabel(v))
    },
    {
      id: 'anxietySeverity',
      header: 'Anxiety',
      sortable: true,
      format: fmt((v: DassSeverity) => severityLabel(v))
    },
    {
      id: 'stressSeverity',
      header: 'Stress',
      sortable: true,
      format: fmt((v: DassSeverity) => severityLabel(v))
    },
    {
      id: 'suicidalIdeationFlag',
      header: 'Suicidal ideation',
      sortable: true,
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
    goto(`/psychology-assessment/psychology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Psychology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        DASS-21 Depression / Anxiety / Stress severities and safety flags for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/psychology-assessment/psychology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Highest severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="extremely-severe">Extremely Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Suicidal ideation</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="yes">Flagged</option>
        <option value="no">Not flagged</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Psychology clinician dashboard"
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

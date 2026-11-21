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

  let performanceFilter = $state('');
  let satisfactionFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (performanceFilter === '' || r.performanceCategory === performanceFilter) &&
        (satisfactionFilter === '' || r.satisfactionCategory === satisfactionFilter)
    )
  );

  // SVAR DataGrid columns. The COPM performance / satisfaction scores and their
  // category labels render through the shared engine output so the dashboard and
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
      id: 'primaryDiagnosis',
      header: 'Primary diagnosis',
      sortable: true
    },

    {
      id: 'performanceScore',
      header: 'Performance',
      sortable: true,
      format: fmt((v: number) => `${v}/10`)
    },

    {
      id: 'performanceCategory',
      header: 'Perf. category',
      sortable: true
    },

    {
      id: 'satisfactionScore',
      header: 'Satisfaction',
      sortable: true,
      format: fmt((v: number) => `${v}/10`)
    },
    { id: 'satisfactionCategory', header: 'Sat. category', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/occupational-therapy-assessment/occupational-therapy-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Occupational therapy dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        COPM performance and satisfaction scores for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/occupational-therapy-assessment/occupational-therapy-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Performance category</span>
      <select class="select inline-block w-auto" bind:value={performanceFilter}>
        <option value="">All</option>
        <option value="Significant issues">Significant issues</option>
        <option value="Moderate concerns">Moderate concerns</option>
        <option value="Good performance">Good performance</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Satisfaction category</span>
      <select class="select inline-block w-auto" bind:value={satisfactionFilter}>
        <option value="">All</option>
        <option value="Significant issues">Significant issues</option>
        <option value="Moderate concerns">Moderate concerns</option>
        <option value="Good performance">Good performance</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Occupational therapy dashboard"
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

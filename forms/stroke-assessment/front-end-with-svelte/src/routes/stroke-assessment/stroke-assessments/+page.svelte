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

  let severityFilter = $state('');
  let afFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.strokeSeverity === severityFilter) &&
        (afFilter === '' || String(r.atrialFibrillationFlag) === afFilter)
    )
  );

  // SVAR DataGrid columns. NIHSS score and stroke severity render through the
  // shared engine output so the dashboard and report stay aligned.
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
      id: 'nihssScore',
      header: 'NIHSS',
      sortable: true,
      format: fmt((v: number) => `${v}/42`)
    },

    {
      id: 'strokeSeverity',
      header: 'Stroke severity',
      sortable: true
    },

    {
      id: 'atrialFibrillationFlag',
      header: 'AF',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'anticoagulantFlag',
      header: 'Anticoag.',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'nihssScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/stroke-assessment/stroke-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Stroke clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NIHSS score and stroke severity for assessed patients, computed by the shared engine. Select
        a row to open the assessment.
      </p>
    </div>
    <a href="/stroke-assessment/stroke-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Stroke severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="No stroke symptoms">No stroke symptoms</option>
        <option value="Minor stroke">Minor stroke</option>
        <option value="Moderate stroke">Moderate stroke</option>
        <option value="Moderate to severe stroke">Moderate to severe stroke</option>
        <option value="Severe stroke">Severe stroke</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Atrial fibrillation</span>
      <select class="select inline-block w-auto" bind:value={afFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Stroke clinician dashboard"
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

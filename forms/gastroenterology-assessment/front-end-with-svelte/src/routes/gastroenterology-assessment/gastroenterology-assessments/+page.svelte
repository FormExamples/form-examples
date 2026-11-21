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
  import type { SeverityLevel } from '#lib/engine/types.js';

  let levelFilter = $state('');
  let redFlagFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (levelFilter === '' || r.severityLevel === levelFilter) &&
        (redFlagFilter === '' ||
          (redFlagFilter === 'with' ? r.redFlagCount > 0 : r.redFlagCount === 0))
    )
  );

  // SVAR DataGrid columns. The GI severity score and level render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'primarySymptom', header: 'Primary symptom' },
    { id: 'severityScore', header: 'Score', sortable: true },
    {
      id: 'severityLevel',
      header: 'Severity level',
      sortable: true,
      format: fmt((v: string) => severityLabel(v as SeverityLevel))
    },
    {
      id: 'bleedingFlag',
      header: 'GI bleed',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'weightLossFlag',
      header: 'Weight loss',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'redFlagCount', header: 'Red flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'severityScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/gastroenterology-assessment/gastroenterology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Gastroenterology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        GI symptom-severity score and level for assessed patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/gastroenterology-assessment/gastroenterology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity level</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="minimal">Minimal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="very-severe">Very Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Red flags</span>
      <select class="select inline-block w-auto" bind:value={redFlagFilter}>
        <option value="">All</option>
        <option value="with">With red flags</option>
        <option value="without">No red flags</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Gastroenterology clinician dashboard"
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

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
  import { controlLevelLabel } from '#lib/engine/utils.js';

  let controlFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter((r) => controlFilter === '' || r.controlLevel === controlFilter)
  );

  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Review' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'controlLevel',
      header: 'Control',
      sortable: true,
      format: fmt((v: string) => controlLevelLabel(v as never))
    },
    { id: 'controlScore', header: 'Score', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'controlScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/diabetes-assessment/diabetes-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Diabetes clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Diabetes control level and composite score for reviewed patients, computed by the shared
        engine. Select a row to open the review.
      </p>
    </div>
    <a href="/diabetes-assessment/diabetes-assessments/new" class="button" data-variant="primary"
      >New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Control level</span>
      <select class="select inline-block w-auto" bind:value={controlFilter}>
        <option value="">All</option>
        <option value="wellControlled">Well controlled</option>
        <option value="suboptimal">Suboptimal</option>
        <option value="poor">Poor</option>
        <option value="veryPoor">Very poor</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Diabetes clinician dashboard"
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

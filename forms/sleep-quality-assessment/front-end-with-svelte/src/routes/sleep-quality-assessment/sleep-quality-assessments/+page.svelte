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

  let categoryFilter = $state('');
  let snoringFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.psqiCategory === categoryFilter) &&
        (snoringFilter === '' || String(r.snoringFlag) === snoringFilter)
    )
  );

  // SVAR DataGrid columns. The PSQI score and sleep-quality category render
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
      id: 'psqiScore',
      header: 'PSQI',
      sortable: true,
      format: fmt((v: number) => `${v}/21`)
    },

    {
      id: 'psqiCategory',
      header: 'Sleep quality',
      sortable: true
    },

    {
      id: 'snoringFlag',
      header: 'Snoring',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'medicationFlag',
      header: 'Sleep meds',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'psqiScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/sleep-quality-assessment/sleep-quality-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Sleep clinic dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        PSQI global score and sleep-quality classification for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/sleep-quality-assessment/sleep-quality-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Sleep quality</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="Good sleep quality">Good sleep quality</option>
        <option value="Poor sleep quality">Poor sleep quality</option>
        <option value="Sleep disorder likely">Sleep disorder likely</option>
        <option value="Severe sleep disturbance">Severe sleep disturbance</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Snoring</span>
      <select class="select inline-block w-auto" bind:value={snoringFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Sleep clinic dashboard"
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

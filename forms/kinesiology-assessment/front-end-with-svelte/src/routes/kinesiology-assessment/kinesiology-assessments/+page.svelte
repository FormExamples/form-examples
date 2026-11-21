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
  let painFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.fmsCategory === categoryFilter) &&
        (painFilter === '' || String(r.painFlag) === painFilter)
    )
  );

  // SVAR DataGrid columns. The composite FMS score and movement category render
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
      id: 'fmsScore',
      header: 'FMS score',
      sortable: true,
      format: fmt((v: number) => `${v}/21`)
    },

    {
      id: 'fmsCategory',
      header: 'Category',
      sortable: true
    },

    {
      id: 'sportActivity',
      header: 'Sport / activity',
      sortable: true
    },

    {
      id: 'painFlag',
      header: 'Pain',
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
    goto(`/kinesiology-assessment/kinesiology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Kinesiology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite FMS score and movement category for screened patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/kinesiology-assessment/kinesiology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="Excellent">Excellent</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Poor">Poor</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Pain flag</span>
      <select class="select inline-block w-auto" bind:value={painFilter}>
        <option value="">All</option>
        <option value="true">Pain present</option>
        <option value="false">No pain</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Kinesiology clinician dashboard"
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

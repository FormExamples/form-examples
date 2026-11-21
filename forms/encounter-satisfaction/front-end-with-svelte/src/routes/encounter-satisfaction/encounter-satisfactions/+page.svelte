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
  let firstVisitFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.category === categoryFilter) &&
        (firstVisitFilter === '' || String(r.firstVisit) === firstVisitFilter)
    )
  );

  // SVAR DataGrid columns. The composite ESS score and its category render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Survey' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Date', sortable: true },
    {
      id: 'compositeScore',
      header: 'ESS score',
      sortable: true,
      format: fmt((v: number) => (v > 0 ? `${v.toFixed(1)}/5.0` : '—'))
    },
    { id: 'category', header: 'Category', sortable: true },
    {
      id: 'answeredCount',
      header: 'Answered',
      sortable: true,
      format: fmt((v: number) => `${v}/19`)
    },
    {
      id: 'firstVisit',
      header: 'First visit',
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
    goto(`/encounter-satisfaction/encounter-satisfactions/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Encounter satisfaction dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite ESS score and satisfaction category for completed surveys, computed by the shared
        engine. Select a row to open the survey.
      </p>
    </div>
    <a
      href="/encounter-satisfaction/encounter-satisfactions/new"
      class="button"
      data-variant="primary">New survey</a
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
        <option value="Very Poor">Very Poor</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">First visit</span>
      <select class="select inline-block w-auto" bind:value={firstVisitFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Encounter satisfaction dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} surveys</p>
</main>

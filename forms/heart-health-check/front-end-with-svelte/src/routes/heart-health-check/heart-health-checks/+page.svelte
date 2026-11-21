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
  import { riskCategoryLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let sexFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskCategory === riskFilter) &&
        (sexFilter === '' || r.sex === sexFilter)
    )
  );

  // SVAR DataGrid columns. The 10-year risk, heart age, and risk category
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Check' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'age', header: 'Age', sortable: true },
    { id: 'sex', header: 'Sex', sortable: true },
    {
      id: 'riskCategory',
      header: 'Risk category',
      sortable: true,
      format: fmt((v: string) => riskCategoryLabel(v))
    },
    {
      id: 'tenYearRisk',
      header: '10-yr CVD risk',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'heartAge',
      header: 'Heart age',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/heart-health-check/heart-health-checks/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Heart Health Check dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        10-year cardiovascular risk, heart age, and risk category for assessed patients, computed by
        the shared engine. Select a row to open the check.
      </p>
    </div>
    <a href="/heart-health-check/heart-health-checks/new" class="button" data-variant="primary"
      >New check</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk category</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Sex</span>
      <select class="select inline-block w-auto" bind:value={sexFilter}>
        <option value="">All</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Heart Health Check dashboard"
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

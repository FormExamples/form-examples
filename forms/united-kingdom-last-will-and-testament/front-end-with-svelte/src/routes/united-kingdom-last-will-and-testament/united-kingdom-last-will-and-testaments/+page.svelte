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
  import { sampleWillRows } from '#lib/data/sample-reports.js';
  import { validityClassLabel } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleWillRows.filter((r) => validityFilter === '' || r.validityClass === validityFilter)
  );

  // SVAR DataGrid columns. The validity class renders through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Will' },
    { id: 'testatorName', header: 'Testator', sortable: true },
    { id: 'executionStatus', header: 'Status', sortable: true },
    {
      id: 'validityClass',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => validityClassLabel(v as never))
    },
    { id: 'sharesTotalPercent', header: 'Shares %', sortable: true },
    { id: 'witnessCount', header: 'Witnesses', sortable: true },
    { id: 'formalityRisk', header: 'Formality risk', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'testatorName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Wills dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity class, beneficiary share total, witness count, and flag counts for will records,
        computed by the shared engine. Select a row to open the record. This dashboard checks
        completeness and formalities — it is documentation support, not legal advice.
      </p>
    </div>
    <a
      href="/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/new"
      class="button"
      data-variant="primary">New will</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="valid">Valid</option>
        <option value="incomplete">Incomplete</option>
        <option value="formality-risk">Formality risk</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Wills dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} will records</p>
</main>

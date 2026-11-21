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
  import { sampleBillOfSaleRows } from '#lib/data/sample-reports.js';
  import { completenessClassLabel } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleBillOfSaleRows.filter((r) => classFilter === '' || r.completenessClass === classFilter)
  );

  // SVAR DataGrid columns. The completeness class renders through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Bill of sale' },
    { id: 'vin', header: 'VIN', sortable: true },
    { id: 'vehicle', header: 'Vehicle', sortable: true },
    { id: 'sellerName', header: 'Seller', sortable: true },
    { id: 'saleDate', header: 'Sold', sortable: true },
    {
      id: 'completenessClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => completenessClassLabel(v as never))
    },
    { id: 'leadIssue', header: 'Lead issue', sortable: true },
    { id: 'odometerExempt', header: 'Odometer', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'vehicle',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Vehicle bill of sale dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness class, lead issue, and flag counts for bills of sale, computed by the shared
        engine. Select a row to open the bill of sale. This dashboard is documentation support, not
        legal advice.
      </p>
    </div>
    <a
      href="/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/new"
      class="button"
      data-variant="primary"
    >
      New bill of sale
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
        <option value="risk-flagged">Risk flagged</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Vehicle bill of sale dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} bills of sale</p>
</main>

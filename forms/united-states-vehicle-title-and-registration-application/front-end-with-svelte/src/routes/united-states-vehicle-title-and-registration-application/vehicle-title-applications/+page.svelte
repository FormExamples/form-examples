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
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';
  import { applicationClassLabel } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => classFilter === '' || r.applicationClass === classFilter)
  );

  // SVAR DataGrid columns. The class renders through the shared engine output
  // so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'ownerName', header: 'Owner', sortable: true },
    { id: 'vin', header: 'VIN', sortable: true },
    { id: 'state', header: 'State', sortable: true },
    { id: 'vehicle', header: 'Vehicle', sortable: true },
    {
      id: 'applicationClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => applicationClassLabel(v as never))
    },
    { id: 'outstandingItemCount', header: 'Outstanding', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'ownerName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-states-vehicle-title-and-registration-application/vehicle-title-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Vehicle title clerk dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Application class, VIN status, outstanding items, and flag counts, computed by the shared
        engine. Select a row to open the application. This dashboard is documentation support, not
        legal advice; the issuing state agency decides.
      </p>
    </div>
    <a
      href="/united-states-vehicle-title-and-registration-application/vehicle-title-applications/new"
      class="button"
      data-variant="primary"
    >
      New application
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="incomplete">Incomplete</option>
        <option value="title-brand-or-lien-issue">Title brand or lien issue</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Vehicle title clerk dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

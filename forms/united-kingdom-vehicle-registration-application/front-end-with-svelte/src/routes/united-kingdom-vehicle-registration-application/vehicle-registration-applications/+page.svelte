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
  import { poundsLabel, validityClassLabel } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => validityFilter === '' || r.validityClass === validityFilter)
  );

  // SVAR DataGrid columns. Validity class and the fee render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'applicantName', header: 'Applicant', sortable: true },
    { id: 'applicationType', header: 'Application type', sortable: true },
    { id: 'registrationNumber', header: 'Registration', sortable: true },
    { id: 'updatedAt', header: 'Date', sortable: true },
    {
      id: 'validityClass',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => validityClassLabel(v))
    },
    {
      id: 'feeDueAsPence',
      header: 'Fee due',
      sortable: true,
      format: fmt((v: number | null) => poundsLabel(v))
    },
    { id: 'missingItemCount', header: 'Missing', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-kingdom-vehicle-registration-application/vehicle-registration-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Vehicle registration application dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity class, fee due, and counts of missing items and flags for applications, computed by
        the shared engine. Select a row to open the application. This dashboard checks completeness
        — it makes no decision on any application.
      </p>
    </div>
    <a
      href="/united-kingdom-vehicle-registration-application/vehicle-registration-applications/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="needs-supporting-documents">Needs supporting documents</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Vehicle registration application dashboard"
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

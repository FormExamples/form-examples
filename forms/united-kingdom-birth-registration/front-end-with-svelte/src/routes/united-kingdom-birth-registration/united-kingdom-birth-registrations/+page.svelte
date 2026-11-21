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
  import { sampleRegistrationRows } from '#lib/data/sample-reports.js';
  import { readinessClassLabel } from '#lib/engine/utils.js';

  let readinessFilter = $state('');

  const rows = $derived(
    sampleRegistrationRows.filter(
      (r) => readinessFilter === '' || r.readinessClass === readinessFilter
    )
  );

  // SVAR DataGrid columns. Readiness class and days since birth render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'childName', header: 'Child', sortable: true },
    { id: 'informantName', header: 'Informant', sortable: true },
    { id: 'registeredDate', header: 'Registration date', sortable: true },
    { id: 'daysSinceBirth', header: 'Days since birth', sortable: true },
    {
      id: 'readinessClass',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: string) => readinessClassLabel(v as never))
    },
    { id: 'lateRegistration', header: 'Late', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'childName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-birth-registration/united-kingdom-birth-registrations/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Birth registration dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, days since birth, and flag counts for applications, computed by the shared
        engine. Select a row to open the application. This dashboard classifies and checks
        completeness — it does not register a birth or replace the registrar.
      </p>
    </div>
    <a
      href="/united-kingdom-birth-registration/united-kingdom-birth-registrations/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="incomplete">Incomplete</option>
        <option value="needs-additional-evidence">Needs additional evidence</option>
        <option value="out-of-scope">Out of scope</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Birth registration dashboard"
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

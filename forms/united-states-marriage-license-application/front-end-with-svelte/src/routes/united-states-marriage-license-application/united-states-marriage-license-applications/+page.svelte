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

  // SVAR DataGrid columns. The class and the derived ceremony date render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'applicants', header: 'Applicants', sortable: true },
    { id: 'jurisdiction', header: 'Jurisdiction', sortable: true },
    { id: 'applicationDate', header: 'Applied', sortable: true },
    {
      id: 'applicationClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => applicationClassLabel(v as never))
    },
    { id: 'earliestCeremonyDate', header: 'Earliest ceremony', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicants',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-states-marriage-license-application/united-states-marriage-license-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Marriage license review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Class, earliest permitted ceremony date, and flag counts for applications, computed by the
        shared engine. Select a row to open the application. This is documentation support, not
        legal advice.
      </p>
    </div>
    <a
      href="/united-states-marriage-license-application/united-states-marriage-license-applications/new"
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
        <option value="ready-to-apply">Ready to apply</option>
        <option value="incomplete">Incomplete</option>
        <option value="not-eligible">Not eligible</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Marriage license review dashboard"
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

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
  import { registrationClassLabel, deadlineStatusLabel } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleRegistrationRows.filter((r) => classFilter === '' || r.registrationClass === classFilter)
  );

  // SVAR DataGrid columns. Registration class and deadline status
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Registration' },
    { id: 'deceasedName', header: 'Deceased', sortable: true },
    { id: 'informantName', header: 'Informant', sortable: true },
    { id: 'updatedAt', header: 'Updated', sortable: true },
    {
      id: 'registrationClass',
      header: 'Registration class',
      sortable: true,
      format: fmt((v: string) => registrationClassLabel(v as never))
    },
    {
      id: 'deadlineStatus',
      header: '5-day deadline',
      sortable: true,
      format: fmt((v: string) => deadlineStatusLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'deceasedName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-death-registration/united-kingdom-death-registrations/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Death registrations dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Registration class, 5-day deadline status, and flag counts, computed by the shared engine.
        Select a row to open the registration. This dashboard classifies readiness — it is not legal
        advice.
      </p>
    </div>
    <a
      href="/united-kingdom-death-registration/united-kingdom-death-registrations/new"
      class="button"
      data-variant="primary">New registration</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Registration class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="ready-to-register">Ready to register</option>
        <option value="incomplete">Incomplete</option>
        <option value="referred-to-coroner-pending">Referred to coroner - pending</option>
        <option value="registered">Registered</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Death registrations dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} registrations</p>
</main>

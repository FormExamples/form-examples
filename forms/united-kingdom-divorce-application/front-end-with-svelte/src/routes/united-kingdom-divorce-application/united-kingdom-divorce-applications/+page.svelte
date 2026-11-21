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
  import { applicationClassLabel, stageShort } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => classFilter === '' || r.applicationClass === classFilter)
  );

  // SVAR DataGrid columns. Validity class and the derived underlying cause
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'applicantName', header: 'Applicant', sortable: true },
    { id: 'respondentName', header: 'Other spouse', sortable: true },
    {
      id: 'stage',
      header: 'Stage',
      sortable: true,
      format: fmt((v: string) => stageShort(v as never))
    },
    {
      id: 'applicationClass',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: string) => applicationClassLabel(v as never))
    },
    { id: 'earliestEligibleDate', header: 'Earliest date', sortable: true },
    { id: 'caseworkerName', header: 'Caseworker', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-divorce-application/united-kingdom-divorce-applications/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Divorce application caseworker dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, earliest eligible date and flag counts for applications, computed by the
        shared engine. Select a row to open the application. This dashboard classifies and checks
        completeness — it gives no legal advice.
      </p>
    </div>
    <a
      href="/united-kingdom-divorce-application/united-kingdom-divorce-applications/new"
      class="button"
      data-variant="primary">New check</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="ready-to-apply">Ready to apply</option>
        <option value="incomplete">Incomplete</option>
        <option value="not-eligible-yet">Not eligible yet</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Divorce application caseworker dashboard"
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

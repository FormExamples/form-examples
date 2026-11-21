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

  // SVAR DataGrid columns. The application class renders through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    { id: 'applicantName', header: 'Applicant', sortable: true },
    { id: 'requestType', header: 'Request', sortable: true },
    { id: 'applicationDate', header: 'Date', sortable: true },
    {
      id: 'applicationClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => applicationClassLabel(v as never))
    },
    { id: 'missingEvidenceCount', header: 'Evidence gaps', sortable: true },
    { id: 'replacementLimitReached', header: 'Limit reached', sortable: true },
    { id: 'preparerName', header: 'Preparer', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-states-social-security-card-application/united-states-social-security-card-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Social Security card application dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Application class, evidence-gap count, and flag counts for applications, computed by the
        shared engine. Select a row to open the application. This dashboard checks completeness only
        — it is not legal advice and not an SSA decision.
      </p>
    </div>
    <a
      href="/united-states-social-security-card-application/united-states-social-security-card-applications/new"
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
        <option value="evidence-missing">Evidence missing</option>
        <option value="not-eligible">Not eligible</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Social Security card application dashboard"
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

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

  let statusFilter = $state('');
  let agreedFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (agreedFilter === '' || String(r.agreed) === agreedFilter)
    )
  );

  // SVAR DataGrid columns. Status and completeness render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Acknowledgment' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'acknowledgedDate',
      header: 'Acknowledged',
      sortable: true
    },

    {
      id: 'agreed',
      header: 'Agreed',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'status', header: 'Status', sortable: true },
    {
      id: 'completeness',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/screening-program-privacy-notice/screening-program-privacy-notices/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Screening program privacy notice dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Acknowledgment completeness and status for recorded patients, computed by the shared engine.
        Select a row to open the acknowledgment.
      </p>
    </div>
    <a
      href="/screening-program-privacy-notice/screening-program-privacy-notices/new"
      class="button"
      data-variant="primary">New acknowledgment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="Complete">Complete</option>
        <option value="Incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Agreed</span>
      <select class="select inline-block w-auto" bind:value={agreedFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Screening program privacy notice dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} acknowledgments</p>
</main>

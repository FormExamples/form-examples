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
  let practiceFilter = $state('');

  const practices = $derived(
    Array.from(new Set(sampleAssessmentRows.map((r) => r.practiceName))).sort()
  );

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (practiceFilter === '' || r.practiceName === practiceFilter)
    )
  );

  // SVAR DataGrid columns. Status and completeness render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Notice' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'practiceName', header: 'Practice', sortable: true },
    { id: 'acknowledgedDate', header: 'Acknowledged', sortable: true },
    { id: 'status', header: 'Status', sortable: true },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'acknowledged',
      header: 'Agreed',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/care-privacy-notice/care-privacy-notices/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Privacy notice dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness and acknowledgment status for each recorded privacy notice, computed by the
        shared engine. Select a row to open the acknowledgment.
      </p>
    </div>
    <a href="/care-privacy-notice/care-privacy-notices/new" class="button" data-variant="primary"
      >New notice</a
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
      <span class="mr-2 font-medium text-base-content/80">Practice</span>
      <select class="select inline-block w-auto" bind:value={practiceFilter}>
        <option value="">All</option>
        {#each practices as p (p)}
          <option value={p}>{p}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Privacy notice dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} notices</p>
</main>

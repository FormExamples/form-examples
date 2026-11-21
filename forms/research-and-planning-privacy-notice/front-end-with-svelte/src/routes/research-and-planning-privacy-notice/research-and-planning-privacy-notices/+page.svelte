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
  let type1Filter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (type1Filter === '' || r.type1OptOut === type1Filter)
    )
  );

  // SVAR DataGrid columns. Status and completeness render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Acknowledgement' },
    {
      id: 'organisationName',
      header: 'Organisation',
      sortable: true
    },

    {
      id: 'recipientName',
      header: 'Recipient',
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
    {
      id: 'type1OptOut',
      header: 'Type 1',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    {
      id: 'nationalDataOptOut',
      header: 'National',
      sortable: true,
      format: fmt((v: string) => v || '—')
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
    columnId: 'recipientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/research-and-planning-privacy-notice/research-and-planning-privacy-notices/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Research and planning privacy notice dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Acknowledgement completeness, status, and opt-out preferences for recorded recipients,
        computed by the shared engine. Select a row to open the acknowledgement.
      </p>
    </div>
    <a
      href="/research-and-planning-privacy-notice/research-and-planning-privacy-notices/new"
      class="button"
      data-variant="primary">New acknowledgement</a
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
      <span class="mr-2 font-medium text-base-content/80">Type 1 opt-out</span>
      <select class="select inline-block w-auto" bind:value={type1Filter}>
        <option value="">All</option>
        <option value="opt-in">Opt in</option>
        <option value="opt-out">Opt out</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Research and planning privacy notice dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} acknowledgements</p>
</main>

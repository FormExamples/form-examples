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
  import { sampleMeetingRows } from '#lib/data/sample-reports.js';
  import { healthLabel, statusLabel, categoryLabel, formatDateTime } from '#lib/engine/utils.js';

  let healthFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleMeetingRows.filter(
      (r) =>
        (healthFilter === '' || r.health === healthFilter) &&
        (statusFilter === '' || r.status === statusFilter)
    )
  );

  // SVAR DataGrid columns. Duration, acceptance, open actions, outcomes and
  // overall health all render through the shared engine output so the dashboard
  // and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Meeting' },
    { id: 'title', header: 'Title', sortable: true },
    {
      id: 'organizerName',
      header: 'Organiser',
      sortable: true
    },

    {
      id: 'category',
      header: 'Category',
      sortable: true,
      format: fmt((v: string) => categoryLabel(v as never))
    },
    {
      id: 'scheduledStart',
      header: 'Scheduled start',
      sortable: true,
      format: fmt((v: string) => formatDateTime(v))
    },
    {
      id: 'durationMinutes',
      header: 'Duration',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : `${v} min`))
    },
    { id: 'acceptance', header: 'Accepted / total' },
    {
      id: 'openActions',
      header: 'Open actions',
      sortable: true
    },

    {
      id: 'outcomeCount',
      header: 'Outcomes',
      sortable: true
    },

    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    {
      id: 'health',
      header: 'Health',
      sortable: true,
      format: fmt((v: string) => healthLabel(v as never))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'scheduledStart',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/meeting/meetings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Meeting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Recorded meetings with their duration, acceptance, open actions, outcomes and overall
        health, computed by the shared validation engine. Select a row to open the record.
      </p>
    </div>
    <a href="/meeting/meetings/new" class="button" data-variant="primary">New meeting</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Health</span>
      <select class="select inline-block w-auto" bind:value={healthFilter}>
        <option value="">All</option>
        <option value="green">Healthy</option>
        <option value="amber">Needs attention</option>
        <option value="red">Action required</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Meeting dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} meetings</p>
</main>

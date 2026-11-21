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
  import { priorityLabel } from '#lib/engine/utils.js';
  import type { FlagPriority } from '#lib/engine/types.js';

  let triageFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (triageFilter === '' || r.triageCategory === triageFilter) &&
        (statusFilter === '' || (statusFilter === 'complete' ? r.complete : !r.complete))
    )
  );

  const triageLabel = (v: string) =>
    v === 'red'
      ? 'RED — Immediate'
      : v === 'yellow'
        ? 'YELLOW — Urgent'
        : v === 'green'
          ? 'GREEN — Non-urgent'
          : '—';

  // SVAR DataGrid columns. Triage category, completeness status and flag
  // counts render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Encounter' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'recordedDate',
      header: 'Recorded',
      sortable: true
    },

    {
      id: 'triageCategory',
      header: 'Triage',
      sortable: true,
      format: fmt((v: string) => triageLabel(v))
    },
    {
      id: 'complete',
      header: 'Status',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Complete' : 'Incomplete'))
    },
    { id: 'urgentFlags', header: 'Urgent', sortable: true },
    { id: 'totalFlags', header: 'Flags', sortable: true },
    {
      id: 'topPriority',
      header: 'Top priority',
      format: fmt((v: FlagPriority | null) => (v ? priorityLabel(v) : '—'))
    },
    {
      id: 'gcsTotal',
      header: 'GCS',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    {
      id: 'injury',
      header: 'Injury',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'recordedBy', header: 'Recorded by', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'recordedDate',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/who-prehospital-form/who-prehospital-forms/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Prehospital clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Triage category, completeness status and flagged issues for recorded prehospital encounters,
        computed by the shared engine. Select a row to open the encounter.
      </p>
    </div>
    <a href="/who-prehospital-form/who-prehospital-forms/new" class="button" data-variant="primary"
      >New encounter</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage</span>
      <select class="select inline-block w-auto" bind:value={triageFilter}>
        <option value="">All</option>
        <option value="red">RED — Immediate</option>
        <option value="yellow">YELLOW — Urgent</option>
        <option value="green">GREEN — Non-urgent</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Prehospital clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} encounters</p>
</main>

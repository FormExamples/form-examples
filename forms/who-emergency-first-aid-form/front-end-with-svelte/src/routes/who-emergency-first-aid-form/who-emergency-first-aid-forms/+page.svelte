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

  let problemFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (problemFilter === '' || r.problemType === problemFilter) &&
        (statusFilter === '' || (statusFilter === 'complete' ? r.complete : !r.complete))
    )
  );

  const problemLabel = (v: string) =>
    v === 'medical'
      ? 'Medical'
      : v === 'trauma'
        ? 'Trauma'
        : v === 'both'
          ? 'Medical + Trauma'
          : '—';

  // SVAR DataGrid columns. Completeness status and flag counts render through
  // the shared engine output so the dashboard and report stay aligned.
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
      id: 'problemType',
      header: 'Problem',
      sortable: true,
      format: fmt((v: string) => problemLabel(v))
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
      id: 'tourniquet',
      header: 'Tourniquet',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'recordedBy', header: 'Recorded by (CFAR)', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'recordedDate',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/who-emergency-first-aid-form/who-emergency-first-aid-forms/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Emergency first aid clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status and flagged issues for recorded CFAR encounters, computed by the shared
        engine. Select a row to open the encounter.
      </p>
    </div>
    <a
      href="/who-emergency-first-aid-form/who-emergency-first-aid-forms/new"
      class="button"
      data-variant="primary">New encounter</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Problem type</span>
      <select class="select inline-block w-auto" bind:value={problemFilter}>
        <option value="">All</option>
        <option value="medical">Medical</option>
        <option value="trauma">Trauma</option>
        <option value="both">Medical + Trauma</option>
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
    label="Emergency first aid clinician dashboard"
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

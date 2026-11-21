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
  import { fitnessStatementLabel, restrictionPriorityLabel } from '#lib/engine/utils.js';
  import type { FitnessStatement, RestrictionPriority } from '#lib/engine/types.js';

  let fitnessFilter = $state('');
  let priorityFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (fitnessFilter === '' || r.fitnessStatement === fitnessFilter) &&
        (priorityFilter === '' || r.restrictionPriority === priorityFilter)
    )
  );

  // SVAR DataGrid columns. The fitness statement and restriction priority render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'fitnessStatement',
      header: 'Fitness',
      sortable: true,
      format: fmt((v: string) => fitnessStatementLabel(v as FitnessStatement))
    },
    {
      id: 'restrictionPriority',
      header: 'Priority',
      sortable: true,
      format: fmt((v: string) => restrictionPriorityLabel(v as RestrictionPriority))
    },
    {
      id: 'phasedReturnFlag',
      header: 'Phased',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'daysAbsent', header: 'Days absent', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/return-to-work/return-to-work-records/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Return-to-work dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Fitness statements and restriction priorities for assessed employees, computed by the shared
        engine. Select a row to open the record.
      </p>
    </div>
    <a href="/return-to-work/return-to-work-records/new" class="button" data-variant="primary"
      >New record</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Fitness</span>
      <select class="select inline-block w-auto" bind:value={fitnessFilter}>
        <option value="">All</option>
        <option value="fit">Fit for work</option>
        <option value="may-be-fit">May be fit — with adjustments</option>
        <option value="not-fit">Not fit for work</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Restriction priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="standard">Standard</option>
        <option value="restricted">Restricted</option>
        <option value="high-risk">High-risk</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Return-to-work dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>

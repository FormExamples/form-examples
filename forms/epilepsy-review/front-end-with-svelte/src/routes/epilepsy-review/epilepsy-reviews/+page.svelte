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
  import { seizureControlLabel, reviewStatusLabel, careSettingLabel } from '#lib/engine/utils.js';

  let controlFilter = $state('');
  let reviewFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (controlFilter === '' || r.seizureControl === controlFilter) &&
        (reviewFilter === '' || r.reviewStatus === reviewFilter)
    )
  );

  // SVAR DataGrid columns. Seizure control and review completeness render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Review' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Care setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never))
    },

    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'seizureControl',
      header: 'Seizure control',
      sortable: true,
      format: fmt((v: string) => seizureControlLabel(v as never))
    },
    {
      id: 'reviewStatus',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => reviewStatusLabel(v as never))
    },
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/epilepsy-review/epilepsy-reviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Epilepsy review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Seizure control, review completeness, and safety flags for reviewed patients, computed by
        the shared engine. Select a row to open the review.
      </p>
    </div>
    <a href="/epilepsy-review/epilepsy-reviews/new" class="button" data-variant="primary"
      >New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Seizure control</span>
      <select class="select inline-block w-auto" bind:value={controlFilter}>
        <option value="">All</option>
        <option value="seizure-free">Seizure-free</option>
        <option value="controlled">Controlled</option>
        <option value="uncontrolled">Uncontrolled</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={reviewFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Epilepsy review dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>

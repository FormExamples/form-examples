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
  import {
    functionalStatusLabel,
    optimisationStatusLabel,
    reviewStatusLabel,
    careSettingLabel
  } from '#lib/engine/utils.js';

  let functionalFilter = $state('');
  let optimisationFilter = $state('');
  let reviewFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (functionalFilter === '' || r.functionalStatus === functionalFilter) &&
        (optimisationFilter === '' || r.optimisationStatus === optimisationFilter) &&
        (reviewFilter === '' || r.reviewStatus === reviewFilter)
    )
  );

  // SVAR DataGrid columns. Functional status, medication optimisation, and
  // review completeness render through the shared engine output so the
  // dashboard and report stay aligned.
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
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },

    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'functionalStatus',
      header: 'NYHA status',
      sortable: true,
      format: fmt((v: string) => functionalStatusLabel(v as never))
    },
    {
      id: 'optimisationStatus',
      header: 'Optimisation',
      sortable: true,
      format: fmt((v: string) => optimisationStatusLabel(v as never))
    },
    {
      id: 'reviewStatus',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => reviewStatusLabel(v as never))
    },
    {
      id: 'completenessScore',
      header: '%',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
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
    goto(`/heart-failure-review/heart-failure-reviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Heart-failure review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NYHA functional status, medication-optimisation status, review completeness, and safety
        flags for reviewed patients, computed by the shared engine. Select a row to open the review.
      </p>
    </div>
    <a href="/heart-failure-review/heart-failure-reviews/new" class="button" data-variant="primary"
      >New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">NYHA status</span>
      <select class="select inline-block w-auto" bind:value={functionalFilter}>
        <option value="">All</option>
        <option value="stable">Stable</option>
        <option value="symptomatic">Symptomatic</option>
        <option value="advanced">Advanced</option>
        <option value="unknown">Not assessed</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Optimisation</span>
      <select class="select inline-block w-auto" bind:value={optimisationFilter}>
        <option value="">All</option>
        <option value="optimised">Optimised</option>
        <option value="partial">Partially optimised</option>
        <option value="suboptimal">Suboptimal</option>
        <option value="not-applicable">Not applicable</option>
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
    label="Heart-failure review dashboard"
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

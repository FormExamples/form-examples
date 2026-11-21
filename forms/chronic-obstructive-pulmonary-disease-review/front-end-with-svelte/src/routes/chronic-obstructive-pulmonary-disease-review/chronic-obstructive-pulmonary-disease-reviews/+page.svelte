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
    goldGradeShort,
    abeGroupShort,
    reviewStatusLabel,
    reviewTypeLabel
  } from '#lib/engine/utils.js';

  const plural = 'chronic-obstructive-pulmonary-disease-reviews';
  let goldFilter = $state('');
  let abeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (goldFilter === '' || String(r.goldGrade) === goldFilter) &&
        (abeFilter === '' || r.abeGroup === abeFilter)
    )
  );

  // SVAR DataGrid columns. GOLD grade, ABE group, and review completeness
  // render through the shared engine output so the dashboard and report stay
  // aligned.
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
      id: 'reviewType',
      header: 'Review type',
      sortable: true,
      format: fmt((v: string) => reviewTypeLabel(v as never) || '—')
    },

    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'goldGrade',
      header: 'GOLD',
      sortable: true,
      format: fmt((v: number | null) => goldGradeShort(v as never))
    },
    {
      id: 'abeGroup',
      header: 'ABE',
      sortable: true,
      format: fmt((v: string | null) => abeGroupShort(v as never))
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
    goto(`/chronic-obstructive-pulmonary-disease-review/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">COPD review clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        GOLD airflow grade, ABE assessment group, review completeness, and clinical flags for
        reviewed patients, computed by the shared engine. Select a row to open the review.
      </p>
    </div>
    <a
      href="/chronic-obstructive-pulmonary-disease-review/{plural}/new"
      class="button"
      data-variant="primary">New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">GOLD grade</span>
      <select class="select inline-block w-auto" bind:value={goldFilter}>
        <option value="">All</option>
        <option value="1">GOLD 1</option>
        <option value="2">GOLD 2</option>
        <option value="3">GOLD 3</option>
        <option value="4">GOLD 4</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ABE group</span>
      <select class="select inline-block w-auto" bind:value={abeFilter}>
        <option value="">All</option>
        <option value="A">Group A</option>
        <option value="B">Group B</option>
        <option value="E">Group E</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="COPD review clinician dashboard"
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

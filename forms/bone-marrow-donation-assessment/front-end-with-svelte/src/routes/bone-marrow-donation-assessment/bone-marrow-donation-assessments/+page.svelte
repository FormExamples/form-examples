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
  import { eligibilityLabel, riskLevelLabel } from '#lib/engine/utils.js';

  let eligibilityFilter = $state('');
  let riskFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (eligibilityFilter === '' || r.eligibility === eligibilityFilter) &&
        (riskFilter === '' || r.riskLevel === riskFilter)
    )
  );

  // SVAR DataGrid columns. Eligibility, risk level, HLA match, and collection
  // method render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'donorName', header: 'Donor', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'eligibility',
      header: 'Eligibility',
      sortable: true,
      format: fmt((v: string) => eligibilityLabel(v as never))
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },
    { id: 'hlaMatchLevel', header: 'HLA match', sortable: true },
    { id: 'collectionMethod', header: 'Collection', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'donorName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/bone-marrow-donation-assessment/bone-marrow-donation-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Donor assessment dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility classification and overall risk for assessed donors, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/bone-marrow-donation-assessment/bone-marrow-donation-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility</span>
      <select class="select inline-block w-auto" bind:value={eligibilityFilter}>
        <option value="">All</option>
        <option value="suitable">Suitable</option>
        <option value="conditionally-suitable">Conditionally suitable</option>
        <option value="unsuitable">Unsuitable</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Donor assessment dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} donors</p>
</main>

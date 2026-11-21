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
  import { statusLabel, cprRecommendationLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let cprFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (cprFilter === '' || r.cprRecommendation === cprFilter)
    )
  );

  // SVAR DataGrid columns. Completeness status and CPR recommendation render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Plan' },
    { id: 'patientIdentifier', header: 'Patient ID', sortable: true },
    { id: 'patientName', header: 'Person', sortable: true },
    { id: 'updatedDate', header: 'Updated', sortable: true },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'cprRecommendation',
      header: 'CPR',
      sortable: true,
      format: fmt((v: string) => cprRecommendationLabel(v as never))
    },
    { id: 'clinicianName', header: 'Clinician', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/recommended-summary-plan-for-emergency-care-and-treatment/plans/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ReSPECT clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, CPR recommendation, and flag count for each plan, computed by the
        shared engine. Select a row to open the plan.
      </p>
    </div>
    <a
      href="/recommended-summary-plan-for-emergency-care-and-treatment/plans/new"
      class="button"
      data-variant="primary">New plan</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">CPR recommendation</span>
      <select class="select inline-block w-auto" bind:value={cprFilter}>
        <option value="">All</option>
        <option value="attempt">Attempt</option>
        <option value="do-not-attempt">Do not attempt</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ReSPECT clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} plans</p>
</main>

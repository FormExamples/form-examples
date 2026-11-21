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
  import { completenessStatusLabel, sectionClassShort, urgencyLabel } from '#lib/engine/utils.js';

  let sectionFilter = $state('');
  let completenessFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (sectionFilter === '' || r.recommendedSectionClass === sectionFilter) &&
        (completenessFilter === '' || r.completenessStatus === completenessFilter)
    )
  );

  // SVAR DataGrid columns. Completeness, recommended-section class, and urgency
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'personIdentifier', header: 'Person ID', sortable: true },
    { id: 'personName', header: 'Person', sortable: true },
    { id: 'amhpName', header: 'AMHP', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'recommendedSectionClass',
      header: 'Section',
      sortable: true,
      format: fmt((v: string) => sectionClassShort(v as never))
    },
    {
      id: 'completenessStatus',
      header: 'Documentation',
      sortable: true,
      format: fmt((v: string) => completenessStatusLabel(v as never))
    },
    {
      id: 'urgencyClass',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => urgencyLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'personName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/mental-health-act-assessment/mental-health-act-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">MHA clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Documentation completeness, recommended-section class, urgency, and flag counts for assessed
        people, computed by the shared engine. Select a row to open the assessment. This dashboard
        classifies and validates — it makes no automated decision to detain.
      </p>
    </div>
    <a
      href="/mental-health-act-assessment/mental-health-act-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Section</span>
      <select class="select inline-block w-auto" bind:value={sectionFilter}>
        <option value="">All</option>
        <option value="section-2">Section 2</option>
        <option value="section-3">Section 3</option>
        <option value="section-4">Section 4</option>
        <option value="section-5-2">Section 5(2)</option>
        <option value="section-5-4">Section 5(4)</option>
        <option value="section-136">Section 136</option>
        <option value="none">None</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Documentation</span>
      <select class="select inline-block w-auto" bind:value={completenessFilter}>
        <option value="">All</option>
        <option value="valid">Valid</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="MHA clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} people</p>
</main>

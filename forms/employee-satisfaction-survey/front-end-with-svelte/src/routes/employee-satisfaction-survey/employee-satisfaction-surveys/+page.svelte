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
  import { categoryLabel, enpsClassificationLabel } from '#lib/engine/utils.js';
  import type { SatisfactionCategory, ENpsClassification } from '#lib/engine/types.js';

  let categoryFilter = $state('');
  let enpsFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.category === categoryFilter) &&
        (enpsFilter === '' || r.enps === enpsFilter)
    )
  );

  // SVAR DataGrid columns. The composite score, satisfaction category and eNPS
  // classification render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Survey' },
    { id: 'department', header: 'Department', sortable: true },
    { id: 'tenure', header: 'Tenure', sortable: true },
    {
      id: 'submittedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'compositeScore',
      header: 'Score /100',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v}`))
    },
    {
      id: 'category',
      header: 'Category',
      sortable: true,
      format: fmt((v: SatisfactionCategory) => categoryLabel(v))
    },
    {
      id: 'enps',
      header: 'eNPS',
      sortable: true,
      format: fmt((v: ENpsClassification) => enpsClassificationLabel(v))
    },
    {
      id: 'retentionRisk',
      header: 'Retention risk',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'compositeScore',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/employee-satisfaction-survey/employee-satisfaction-surveys/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Employee satisfaction dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite satisfaction score, category and eNPS for submitted surveys, computed by the
        shared engine. Select a row to open the survey.
      </p>
    </div>
    <a
      href="/employee-satisfaction-survey/employee-satisfaction-surveys/new"
      class="button"
      data-variant="primary">New survey</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
        <option value="satisfactory">Satisfactory</option>
        <option value="poor">Poor</option>
        <option value="very-poor">Very Poor</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">eNPS</span>
      <select class="select inline-block w-auto" bind:value={enpsFilter}>
        <option value="">All</option>
        <option value="promoter">Promoter</option>
        <option value="passive">Passive</option>
        <option value="detractor">Detractor</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Employee satisfaction dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} surveys</p>
</main>

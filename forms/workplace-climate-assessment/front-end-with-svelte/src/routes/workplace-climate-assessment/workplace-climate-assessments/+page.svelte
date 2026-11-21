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
  import { categoryLabel, domainLabel, DOMAIN_LABELS } from '#lib/engine/utils.js';
  import type { ClimateCategory, GradedDomainKey } from '#lib/engine/types.js';

  let categoryFilter = $state('');
  let worstDomainFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.category === categoryFilter) &&
        (worstDomainFilter === '' || r.worstDomain === worstDomainFilter)
    )
  );

  const domainKeys = Object.keys(DOMAIN_LABELS) as GradedDomainKey[];

  // SVAR DataGrid columns. The composite index, category and worst domain
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Response' },
    {
      id: 'department',
      header: 'Department',
      sortable: true
    },

    {
      id: 'submittedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'compositeScore',
      header: 'Index',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v}/100`))
    },
    {
      id: 'category',
      header: 'Climate',
      sortable: true,
      format: fmt((v: ClimateCategory) => categoryLabel(v))
    },
    { id: 'worstDomain', header: 'Lowest domain', sortable: true },
    { id: 'recommend', header: 'Recommend', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'department',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/workplace-climate-assessment/workplace-climate-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Workplace climate leadership dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Anonymous, aggregate Workplace Climate Index per response, computed by the shared engine.
        Select a row to open the response.
      </p>
    </div>
    <a
      href="/workplace-climate-assessment/workplace-climate-assessments/new"
      class="button"
      data-variant="primary">New response</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Climate category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="thriving">Thriving (85-100)</option>
        <option value="healthy">Healthy (70-84)</option>
        <option value="developing">Developing (50-69)</option>
        <option value="strained">Strained (25-49)</option>
        <option value="critical">Critical (0-24)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Lowest domain</span>
      <select class="select inline-block w-auto" bind:value={worstDomainFilter}>
        <option value="">All</option>
        {#each domainKeys as key (key)}
          <option value={domainLabel(key)}>{domainLabel(key)}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Workplace climate leadership dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>

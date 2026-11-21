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
  import { bandShortLabel } from '#lib/engine/utils.js';
  import type { Band } from '#lib/engine/types.js';

  const plural = 'agile-consulting-scorecards-for-hiring-help';

  let bandFilter = $state('');
  let sectorFilter = $state('');

  const sectors = $derived([...new Set(sampleAssessmentRows.map((r) => r.sector))].sort());

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (bandFilter === '' || r.computedBand === bandFilter) &&
        (sectorFilter === '' || r.sector === sectorFilter)
    )
  );

  // SVAR DataGrid columns. The score, subtotals, and readiness band render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Scorecard' },
    { id: 'organizationName', header: 'Organization', sortable: true },
    { id: 'sector', header: 'Sector', sortable: true },
    {
      id: 'respondentName',
      header: 'Respondent',
      sortable: true
    },

    {
      id: 'assessmentDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'scoreTotal',
      header: 'Score',
      sortable: true,
      format: fmt((v: number) => `${v} / 16`)
    },

    {
      id: 'manifestoSubtotal',
      header: 'Manifesto',
      sortable: true,
      format: fmt((v: number) => `${v} / 4`)
    },

    {
      id: 'principlesSubtotal',
      header: 'Principles',
      sortable: true,
      format: fmt((v: number) => `${v} / 12`)
    },

    {
      id: 'computedBand',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: Band) => bandShortLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'scoreTotal',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/agile-consulting-scorecard-for-hiring-help/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Agile readiness reviewer dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Total score, manifesto and principles subtotals, and readiness band for assessed
        organizations, computed by the shared engine. Select a row to open the scorecard.
      </p>
    </div>
    <a
      href="/agile-consulting-scorecard-for-hiring-help/{plural}/new"
      class="button"
      data-variant="primary">New scorecard</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="borderline">Borderline</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Sector</span>
      <select class="select inline-block w-auto" bind:value={sectorFilter}>
        <option value="">All</option>
        {#each sectors as s (s)}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Agile readiness reviewer dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} organizations</p>
</main>

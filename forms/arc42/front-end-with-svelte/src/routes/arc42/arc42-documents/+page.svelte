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
  import { sampleDocumentRows } from '#lib/data/sample-reports.js';
  import { maturityLabel, recommendationLabel } from '#lib/grading/utils.js';
  import type { Maturity } from '#lib/grading/types.js';

  let maturityFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleDocumentRows.filter(
      (r) =>
        (maturityFilter === '' || r.maturity === maturityFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. The maturity band, completed-section count, flags,
  // and recommendation render through the shared engine output so the dashboard
  // and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Document' },
    { id: 'name', header: 'Architecture', sortable: true },
    { id: 'owner', header: 'Owner', sortable: true },
    { id: 'updatedDate', header: 'Updated', sortable: true },
    {
      id: 'maturity',
      header: 'Maturity',
      sortable: true,
      format: fmt((v: Maturity) => maturityLabel(v))
    },
    {
      id: 'sectionsComplete',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}/12`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    {
      id: 'recommendation',
      header: 'Recommendation',
      format: fmt((v: string) => recommendationLabel(v))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'name',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/arc42/arc42-documents/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Architecture dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Maturity band, completed-section count, open flags, and sign-off recommendation for each
        documented architecture, computed by the shared engine. Select a row to open the document.
      </p>
    </div>
    <a href="/arc42/arc42-documents/new" class="button" data-variant="primary">New document</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Maturity</span>
      <select class="select inline-block w-auto" bind:value={maturityFilter}>
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="reviewable">Reviewable</option>
        <option value="ready">Ready</option>
        <option value="mature">Mature</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="proceed">Proceed</option>
        <option value="revise-first">Revise first</option>
        <option value="block">Block</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Architecture dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} documents</p>
</main>

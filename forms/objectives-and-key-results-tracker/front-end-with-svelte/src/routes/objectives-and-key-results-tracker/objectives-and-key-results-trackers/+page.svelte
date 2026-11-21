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
  import { sampleObjectiveRows } from '#lib/data/sample-reports.js';
  import { ragLabel } from '$engine/utils';
  import type { RagBand } from '$engine/types';

  let levelFilter = $state('');
  let ragFilter = $state('');

  const rows = $derived(
    sampleObjectiveRows.filter(
      (r) =>
        (levelFilter === '' || r.level === levelFilter) && (ragFilter === '' || r.rag === ragFilter)
    )
  );

  // SVAR DataGrid columns. The composite RAG band renders through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Objective' },
    { id: 'objectiveTitle', header: 'Title', sortable: true },
    { id: 'owner', header: 'Owner', sortable: true },
    { id: 'level', header: 'Level', sortable: true },
    { id: 'updatedDate', header: 'Updated', sortable: true },
    {
      id: 'rag',
      header: 'RAG',
      sortable: true,
      format: fmt((v: RagBand) => ragLabel(v))
    },
    {
      id: 'progressPercent',
      header: 'Progress',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : `${v}%`))
    },
    {
      id: 'confidenceDecile',
      header: 'Confidence',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : `${v}/10`))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'objectiveTitle',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/objectives-and-key-results-tracker/objectives-and-key-results-trackers/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">OKR review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite RAG band, progress, and confidence for tracked objectives, computed by the shared
        engine. Select a row to open the objective.
      </p>
    </div>
    <a
      href="/objectives-and-key-results-tracker/objectives-and-key-results-trackers/new"
      class="button"
      data-variant="primary">New objective</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Level</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="individual">Individual</option>
        <option value="team">Team</option>
        <option value="department">Department</option>
        <option value="company">Company</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">RAG</span>
      <select class="select inline-block w-auto" bind:value={ragFilter}>
        <option value="">All</option>
        <option value="green">On track</option>
        <option value="amber">At risk</option>
        <option value="red">Off track</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="OKR review dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} objectives</p>
</main>

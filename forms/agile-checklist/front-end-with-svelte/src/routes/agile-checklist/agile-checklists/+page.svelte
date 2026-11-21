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
  import { maturityLabel, bandLabel, pctOrDash } from '#lib/engine/utils.js';
  import type { Band, Maturity } from '#lib/engine/types.js';

  let maturityFilter = $state('');
  let weakFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (maturityFilter === '' || r.maturity === maturityFilter) &&
        (weakFilter === '' || r.weakSection === weakFilter)
    )
  );

  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—');

  // SVAR DataGrid columns. Composite maturity, overall percentage, and the
  // per-section bands all render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Checklist' },
    { id: 'respondent', header: 'Respondent', sortable: true },
    { id: 'team', header: 'Team', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'maturity',
      header: 'Maturity',
      sortable: true,
      format: fmt((v: Maturity) => maturityLabel(v))
    },
    {
      id: 'overallPercent',
      header: 'Overall',
      sortable: true,
      format: fmt((v: number | null) => pctOrDash(v))
    },

    {
      id: 'teamsBand',
      header: 'Teams',
      format: fmt((v: Band) => bandLabel(v))
    },

    {
      id: 'stakeholdersBand',
      header: 'Stakeholders',
      format: fmt((v: Band) => bandLabel(v))
    },
    { id: 'practicesBand', header: 'Practices', format: fmt((v: Band) => bandLabel(v)) },
    { id: 'weakSection', header: 'Weakest', format: fmt((v: string) => cap(v)) },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'respondent',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/agile-checklist/agile-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Agile coach dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite maturity, overall percentage, and per-section bands for assessed teams, computed
        by the shared engine. Select a row to open the checklist.
      </p>
    </div>
    <a href="/agile-checklist/agile-checklists/new" class="button" data-variant="primary"
      >New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Maturity</span>
      <select class="select inline-block w-auto" bind:value={maturityFilter}>
        <option value="">All</option>
        <option value="optimising">Optimising</option>
        <option value="mature">Mature</option>
        <option value="developing">Developing</option>
        <option value="initial">Initial</option>
        <option value="ad-hoc">Ad-hoc</option>
        <option value="insufficient-data">Insufficient data</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Weakest section</span>
      <select class="select inline-block w-auto" bind:value={weakFilter}>
        <option value="">All</option>
        <option value="teams">Teams</option>
        <option value="stakeholders">Stakeholders</option>
        <option value="practices">Practices</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Agile coach dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} teams</p>
</main>

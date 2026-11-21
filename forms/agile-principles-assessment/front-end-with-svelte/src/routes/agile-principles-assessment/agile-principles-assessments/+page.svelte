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

  let maturityFilter = $state('');
  let roleFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (maturityFilter === '' || r.maturity === maturityFilter) &&
        (roleFilter === '' || r.role === roleFilter)
    )
  );

  function maturityLabel(m: string): string {
    switch (m) {
      case 'optimising':
        return 'Optimising';
      case 'mature':
        return 'Mature';
      case 'developing':
        return 'Developing';
      case 'initial':
        return 'Initial';
      case 'ad-hoc':
        return 'Ad-hoc';
      default:
        return 'Insufficient data';
    }
  }

  // SVAR DataGrid columns. The composite maturity, mean score, weak-principle
  // count, and flag count all render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'respondent', header: 'Respondent', sortable: true },
    { id: 'role', header: 'Role', sortable: true, format: fmt((v: string) => v || '—') },
    { id: 'team', header: 'Team', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'answered',
      header: 'Answered',
      sortable: true,
      format: fmt((v: number) => `${v}/12`)
    },
    {
      id: 'meanScore',
      header: 'Mean',
      sortable: true,
      // typeof, not === null: the grid passes a missing value as ''.
      format: fmt((v: number | null) => (typeof v === 'number' ? v.toFixed(2) : '—'))
    },
    {
      id: 'maturity',
      header: 'Maturity',
      sortable: true,
      format: fmt((v: string) => maturityLabel(v))
    },
    { id: 'weakCount', header: 'Weak', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  const ROLES = [
    'individual-contributor',
    'team-lead',
    'scrum-master',
    'product-owner',
    'engineering-manager',
    'agile-coach',
    'executive-sponsor',
    'other'
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'respondent',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/agile-principles-assessment/agile-principles-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Agile coaching dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite agility maturity, mean score, and operational flag counts for assessed teams,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/agile-principles-assessment/agile-principles-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
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
      <span class="mr-2 font-medium text-base-content/80">Role</span>
      <select class="select inline-block w-auto" bind:value={roleFilter}>
        <option value="">All</option>
        {#each ROLES as r (r)}
          <option value={r}>{r}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Agile coaching dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} assessments</p>
</main>

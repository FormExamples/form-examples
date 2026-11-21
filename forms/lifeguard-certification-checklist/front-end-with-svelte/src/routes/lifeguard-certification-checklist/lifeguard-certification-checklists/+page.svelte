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
  import { outcomeLabel, venueTypeLabel } from '#lib/engine/utils.js';

  let outcomeFilter = $state('');
  let venueFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (venueFilter === '' || r.venueType === venueFilter)
    )
  );

  // SVAR DataGrid columns. The outcome, critical-failure count, deficiency
  // count, and answered tally render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'candidateName',
      header: 'Candidate',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'venueType',
      header: 'Venue',
      sortable: true,
      format: fmt((v: string) => venueTypeLabel(v))
    },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },

    {
      id: 'criticalCount',
      header: 'Critical fails',
      sortable: true
    },

    {
      id: 'deficiencyCount',
      header: 'Deficiencies',
      sortable: true
    },

    {
      id: 'answeredCount',
      header: 'Answered',
      format: fmt((v: number, row: DataGridRow) => `${v}/${row.totalRules}`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'candidateName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/lifeguard-certification-checklist/lifeguard-certification-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Lifeguard training coordinator dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Outcome, critical failures, and deficiencies for assessed candidates, computed by the shared
        engine. Select a row to open the checklist.
      </p>
    </div>
    <a
      href="/lifeguard-certification-checklist/lifeguard-certification-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="pass">Pass</option>
        <option value="needs-development">Needs Development</option>
        <option value="fail">Fail</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Venue</span>
      <select class="select inline-block w-auto" bind:value={venueFilter}>
        <option value="">All</option>
        <option value="pool">Swimming pool</option>
        <option value="beach">Beach</option>
        <option value="inland-water">Inland water</option>
        <option value="water-park">Water park</option>
        <option value="leisure">Leisure centre</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Lifeguard training coordinator dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} candidates</p>
</main>

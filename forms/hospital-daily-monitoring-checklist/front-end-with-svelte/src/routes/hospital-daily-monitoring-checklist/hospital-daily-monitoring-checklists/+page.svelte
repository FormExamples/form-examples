<script lang="ts">
  import { goto } from '$app/navigation';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

  let hospitalFilter = $state('');
  let needsAttentionFilter = $state('');
  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (hospitalFilter === '' || r.hospitalName === hospitalFilter) &&
        (needsAttentionFilter === '' ||
          (needsAttentionFilter === 'none' && r.needsAttentionCount === 0) ||
          (needsAttentionFilter === 'some' && r.needsAttentionCount > 0))
    )
  );
  const hospitalOptions = Array.from(new Set(sampleAssessmentRows.map((r) => r.hospitalName)));

  // SVAR DataGrid columns. Answered/needs-attention counts and affected areas
  // all render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Round' },
    { id: 'hospitalName', header: 'Hospital', sortable: true },
    { id: 'inspectingOfficerName', header: 'Inspecting officer', sortable: true },
    { id: 'inspectionDate', header: 'Date', sortable: true },
    { id: 'answeredCount', header: 'Answered', sortable: true },
    { id: 'needsAttentionCount', header: 'Needs attention', sortable: true },
    { id: 'affectedAreas', header: 'Affected areas' }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'hospitalName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Administrator review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Checkpoints answered, needs-attention tally, and affected areas for each inspection round,
        computed by the shared engine. Select a row to open the round.
      </p>
    </div>
    <a
      href="/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/new"
      class="button"
      data-variant="primary">New round</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Hospital</span>
      <select class="select inline-block w-auto" bind:value={hospitalFilter}>
        <option value="">All</option>
        {#each hospitalOptions as h (h)}
          <option value={h}>{h}</option>
        {/each}
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Needs attention</span>
      <select class="select inline-block w-auto" bind:value={needsAttentionFilter}>
        <option value="">All</option>
        <option value="none">None</option>
        <option value="some">One or more</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Administrator review dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} inspection rounds</p>
</main>

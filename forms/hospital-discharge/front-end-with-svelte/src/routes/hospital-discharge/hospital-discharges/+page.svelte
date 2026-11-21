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
  import { completenessShortLabel } from '#lib/engine/utils.js';
  import type { CompletenessLevel } from '#lib/engine/types.js';

  let completenessFilter = $state('');
  let destinationFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (completenessFilter === '' || r.completenessLevel === completenessFilter) &&
        (destinationFilter === '' || r.destination === destinationFilter)
    )
  );

  const destinations = $derived(
    [...new Set(sampleAssessmentRows.map((r) => r.destination))].sort()
  );

  // SVAR DataGrid columns. Completeness, mandatory-missing count, follow-up and
  // flag totals render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Discharge' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'dischargeDate',
      header: 'Discharged',
      sortable: true
    },

    {
      id: 'completenessLevel',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: CompletenessLevel) => completenessShortLabel(v))
    },
    { id: 'mandatoryMissing', header: 'Mandatory missing', sortable: true },
    { id: 'destination', header: 'Destination', sortable: true },
    { id: 'followUp', header: 'Follow-up', sortable: true },
    {
      id: 'reconciliationFlag',
      header: 'Recon. gap',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/hospital-discharge/hospital-discharges/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Hospital discharge dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NICE NG27 completeness, outstanding mandatory fields, follow-up arrangement and safety flags
        for each discharge summary, computed by the shared engine. Select a row to open the summary.
      </p>
    </div>
    <a href="/hospital-discharge/hospital-discharges/new" class="button" data-variant="primary"
      >New discharge summary</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={completenessFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Destination</span>
      <select class="select inline-block w-auto" bind:value={destinationFilter}>
        <option value="">All</option>
        {#each destinations as dest (dest)}
          <option value={dest}>{dest}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Hospital discharge dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} discharge summaries</p>
</main>

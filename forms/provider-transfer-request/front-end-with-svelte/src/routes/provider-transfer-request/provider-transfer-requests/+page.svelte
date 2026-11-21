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
  import { completenessLabel, urgencyLabel } from '#lib/engine/utils.js';

  let completenessFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (completenessFilter === '' || r.completeness === completenessFilter) &&
        (urgencyFilter === '' || r.urgency === urgencyFilter)
    )
  );

  const stableLabel: Record<string, string> = { yes: 'Yes', no: 'No', unknown: 'Unknown' };

  // SVAR DataGrid columns. Completeness, urgency, mandatory-field counts, and
  // the flag total render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Transfer' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Date', sortable: true },
    {
      id: 'completeness',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => completenessLabel(v as never))
    },
    {
      id: 'urgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => urgencyLabel(v))
    },
    { id: 'mandatory', header: 'Mandatory' },
    {
      id: 'stable',
      header: 'Stable',
      format: fmt((v: string) => stableLabel[v] ?? '—')
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/provider-transfer-request/provider-transfer-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Transfer request dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        SBAR completeness, transfer urgency, mandatory-field progress, and safety flag totals for
        each request, computed by the shared engine. Select a row to open the transfer.
      </p>
    </div>
    <a
      href="/provider-transfer-request/provider-transfer-requests/new"
      class="button"
      data-variant="primary">New transfer</a
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
      <span class="mr-2 font-medium text-base-content/80">Urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergent">Emergent</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Transfer request dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} transfer requests</p>
</main>

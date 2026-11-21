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
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';

  const plural = 'united-kingdom-nhs-england-medical-exemption-certificates';

  const OUTCOME_LABELS: Record<string, string> = {
    eligible: 'Eligible',
    ineligible: 'Ineligible',
    'requires-clarification': 'Requires clarification'
  };

  let outcomeFilter = $state('');
  let flaggedFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (flaggedFilter === '' ||
          (flaggedFilter === 'flagged' ? r.flagCount > 0 : r.flagCount === 0))
    )
  );

  // SVAR DataGrid columns. The eligibility outcome, eligible-condition count,
  // and flag count render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Application' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'practitionerName',
      header: 'Practitioner',
      sortable: true
    },

    {
      id: 'completionDate',
      header: 'Completed',
      sortable: true
    },

    {
      id: 'conditionCount',
      header: 'Eligible conds',
      sortable: true
    },

    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => OUTCOME_LABELS[v] ?? '—')
    },
    {
      id: 'validUntil',
      header: 'Valid until',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-nhs-england-medical-exemption-certificate/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">FP92A practitioner dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility outcome, eligible-condition count, and advisory flag count for each FP92A
        application, computed by the shared engine. Select a row to open the application.
      </p>
    </div>
    <a
      href="/united-kingdom-nhs-england-medical-exemption-certificate/{plural}/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="eligible">Eligible</option>
        <option value="ineligible">Ineligible</option>
        <option value="requires-clarification">Requires clarification</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Flags</span>
      <select class="select inline-block w-auto" bind:value={flaggedFilter}>
        <option value="">All</option>
        <option value="flagged">Has flags</option>
        <option value="clear">No flags</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="FP92A practitioner dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

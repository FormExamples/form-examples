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

  let statusFilter = $state('');
  let consentFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (consentFilter === '' || r.consent === consentFilter)
    )
  );

  const consentLabel: Record<string, string> = {
    given: 'Given',
    refused: 'Refused',
    pending: 'Pending'
  };

  // SVAR DataGrid columns. The completeness status, percentage and consent
  // decision render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'procedureName', header: 'Procedure', sortable: true },
    { id: 'scheduledDate', header: 'Scheduled', sortable: true },
    { id: 'status', header: 'Status', sortable: true },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'consent',
      header: 'Consent',
      sortable: true,
      format: fmt((v: string) => consentLabel[v] ?? v)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/consent-to-treatment/consents-to-treatment/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Consent to treatment dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status and consent decision for each record, computed by the shared engine.
        Select a row to open the consent form.
      </p>
    </div>
    <a href="/consent-to-treatment/consents-to-treatment/new" class="button" data-variant="primary"
      >New form</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="Complete">Complete</option>
        <option value="Incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Consent</span>
      <select class="select inline-block w-auto" bind:value={consentFilter}>
        <option value="">All</option>
        <option value="given">Given</option>
        <option value="refused">Refused</option>
        <option value="pending">Pending</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Consent to treatment dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>

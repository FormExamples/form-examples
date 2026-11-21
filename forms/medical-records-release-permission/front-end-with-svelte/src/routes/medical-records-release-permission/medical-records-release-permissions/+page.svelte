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
  import { purposeOptions } from '#lib/engine/validation-rules.js';

  let statusFilter = $state('');
  let purposeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.completenessStatus === statusFilter) &&
        (purposeFilter === '' || r.purpose === purposeFilter)
    )
  );

  // SVAR DataGrid columns. The completeness status, validation status and flag
  // count render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Reference' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'nhsNumber', header: 'NHS number' },
    { id: 'recipientOrg', header: 'Recipient', sortable: true },
    { id: 'purpose', header: 'Purpose', sortable: true },
    {
      id: 'submittedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'completenessStatus',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string, row: DataGridRow) => `${v} (${row.completenessScore}%)`)
    },

    {
      id: 'validationStatus',
      header: 'Validation',
      sortable: true
    },

    {
      id: 'consentConfirmed',
      header: 'Consent',
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
    goto(`/medical-records-release-permission/medical-records-release-permissions/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Records release clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, validation status and flagged issues for submitted authorisations,
        computed by the shared engine. Select a row to open the form.
      </p>
    </div>
    <a
      href="/medical-records-release-permission/medical-records-release-permissions/new"
      class="button"
      data-variant="primary">New form</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="Complete">Complete</option>
        <option value="Nearly Complete">Nearly Complete</option>
        <option value="Partially Complete">Partially Complete</option>
        <option value="Incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Purpose</span>
      <select class="select inline-block w-auto" bind:value={purposeFilter}>
        <option value="">All</option>
        {#each purposeOptions as opt (opt.value)}
          <option value={opt.label}>{opt.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Records release clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} authorisations</p>
</main>

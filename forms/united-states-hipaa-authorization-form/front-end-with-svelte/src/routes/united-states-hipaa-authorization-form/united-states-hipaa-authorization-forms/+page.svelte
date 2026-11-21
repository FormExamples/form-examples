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
  import { sampleAuthorizationRows } from '#lib/data/sample-reports.js';
  import { primaryPurposeLabel, validityStatusLabel } from '#lib/engine/utils.js';
  import type { PrimaryPurpose, ValidityStatus } from '#lib/engine/types.js';

  const plural = 'united-states-hipaa-authorization-forms';

  let validityFilter = $state('');
  let purposeFilter = $state('');

  const rows = $derived(
    sampleAuthorizationRows.filter(
      (r) =>
        (validityFilter === '' || r.validityStatus === validityFilter) &&
        (purposeFilter === '' || r.primaryPurpose === purposeFilter)
    )
  );

  // SVAR DataGrid columns. Validity status, completeness, and flag counts all
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Authorization' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'recipientOrganization',
      header: 'Recipient',
      sortable: true
    },

    {
      id: 'primaryPurpose',
      header: 'Purpose',
      sortable: true,
      format: fmt((v: PrimaryPurpose) => primaryPurposeLabel(v))
    },
    { id: 'categories', header: 'Categories' },
    {
      id: 'validityStatus',
      header: 'Validity',
      sortable: true,
      format: fmt((v: ValidityStatus) => validityStatusLabel(v))
    },
    {
      id: 'completenessScore',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Total flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-states-hipaa-authorization-form/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">HIPAA authorization dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity status, completeness, and flag counts for submitted HIPAA authorizations, computed
        by the shared engine. Select a row to open the authorization.
      </p>
    </div>
    <a
      href="/united-states-hipaa-authorization-form/{plural}/new"
      class="button"
      data-variant="primary">New authorization</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="valid">Valid</option>
        <option value="invalid">Invalid</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Purpose</span>
      <select class="select inline-block w-auto" bind:value={purposeFilter}>
        <option value="">All</option>
        <option value="eligibility-determination">Eligibility determination</option>
        <option value="continuing-treatment">Continuing treatment</option>
        <option value="insurance-claim">Insurance claim</option>
        <option value="legal-proceeding">Legal proceeding</option>
        <option value="personal-use">Personal use</option>
        <option value="research">Research</option>
        <option value="at-the-request-of-the-individual">At the request of the individual</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="HIPAA authorization dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} authorizations</p>
</main>

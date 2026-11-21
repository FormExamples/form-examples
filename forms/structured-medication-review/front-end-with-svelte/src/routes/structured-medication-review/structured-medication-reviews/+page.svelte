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
  import { sampleReviewRows } from '#lib/data/sample-reports.js';
  import { reviewStatusLabel, burdenBandLabel, careSettingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleReviewRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (statusFilter === '' || r.reviewStatus === statusFilter)
    )
  );

  // SVAR DataGrid columns. Status, counts, and band render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Review' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },

    {
      id: 'medicineCount',
      header: 'Medicines',
      sortable: true
    },

    {
      id: 'anticholinergicBurdenScore',
      header: 'ACB',
      sortable: true
    },

    {
      id: 'burdenBand',
      header: 'Burden',
      sortable: true,
      format: fmt((v: string) => burdenBandLabel(v as never))
    },
    {
      id: 'reviewStatus',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => reviewStatusLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/structured-medication-review/structured-medication-reviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Structured medication review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Review status, medicine and anticholinergic-burden indicators, and flag count for reviewed
        patients, computed by the shared engine. Select a row to open the review.
      </p>
    </div>
    <a
      href="/structured-medication-review/structured-medication-reviews/new"
      class="button"
      data-variant="primary">New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="gp-practice">GP practice</option>
        <option value="pcn">Primary Care Network</option>
        <option value="care-home">Care home</option>
        <option value="community-pharmacy">Community pharmacy</option>
        <option value="patient-home">Patient's home</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Structured medication review dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>

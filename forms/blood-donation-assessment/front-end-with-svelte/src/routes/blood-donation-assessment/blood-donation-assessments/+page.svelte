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
  import { eligibilityLabel, donorTypeLabel } from '#lib/engine/utils.js';
  import type { EligibilityStatus, DonorType } from '#lib/engine/types.js';

  let eligibilityFilter = $state('');
  let donorTypeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (eligibilityFilter === '' || r.eligibilityStatus === eligibilityFilter) &&
        (donorTypeFilter === '' || r.donorType === donorTypeFilter)
    )
  );

  // SVAR DataGrid columns. The eligibility status, deferral window, and flag
  // count render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'donorName', header: 'Donor', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'eligibilityStatus',
      header: 'Eligibility',
      sortable: true,
      format: fmt((v: EligibilityStatus) => eligibilityLabel(v))
    },
    {
      id: 'donorType',
      header: 'Donor type',
      sortable: true,
      format: fmt((v: DonorType) => donorTypeLabel(v))
    },
    {
      id: 'hemoglobin',
      header: 'Hb (g/dL)',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    {
      id: 'deferralWindow',
      header: 'Deferral window',
      format: fmt((v: string) => v || '—')
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    {
      id: 'riskFlag',
      header: 'Risk',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'donorName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/blood-donation-assessment/blood-donation-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Blood donation clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility status, deferral window, and risk flags for screened donors, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/blood-donation-assessment/blood-donation-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility</span>
      <select class="select inline-block w-auto" bind:value={eligibilityFilter}>
        <option value="">All</option>
        <option value="eligible">Eligible</option>
        <option value="temporarily-deferred">Temporarily Deferred</option>
        <option value="permanently-deferred">Permanently Deferred</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Donor type</span>
      <select class="select inline-block w-auto" bind:value={donorTypeFilter}>
        <option value="">All</option>
        <option value="first-time">First-time</option>
        <option value="regular">Regular</option>
        <option value="lapsed">Lapsed</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Blood donation clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} donors</p>
</main>

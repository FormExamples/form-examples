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
  import { statusLabel, urgencyLabel, primaryCategoryLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (urgencyFilter === '' || r.urgency === urgencyFilter)
    )
  );

  // SVAR DataGrid columns. Completeness status and urgency render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Referral' },
    { id: 'childReference', header: 'Child ref', sortable: true },
    { id: 'childName', header: 'Child', sortable: true },
    { id: 'updatedDate', header: 'Updated', sortable: true },
    {
      id: 'urgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => urgencyLabel(v as never))
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'primaryCategory',
      header: 'Category',
      sortable: true,
      format: fmt((v: string) => primaryCategoryLabel(v as never))
    },
    { id: 'referrerName', header: 'Referrer', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'urgency',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/child-safeguarding-referral/child-safeguarding-referrals/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Child safeguarding referral dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Urgency, completeness status, category, and flag count for each referral, computed by the
        shared engine. Select a row to open the referral.
      </p>
    </div>
    <a
      href="/child-safeguarding-referral/child-safeguarding-referrals/new"
      class="button"
      data-variant="primary">New referral</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="emergency">Emergency</option>
        <option value="urgent">Urgent (s47)</option>
        <option value="standard">Standard (s17)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Child safeguarding referral dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} referrals</p>
</main>

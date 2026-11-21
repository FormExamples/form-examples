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
  import { sampleClaimRows } from '#lib/data/sample-reports.js';
  import {
    approvalTierLabel,
    complianceLabel,
    formatMoney,
    recommendationLabel,
    statusLabel
  } from '#lib/engine/utils.js';

  let approvalFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleClaimRows.filter(
      (r) =>
        (approvalFilter === '' || r.approvalTier === approvalFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // Claims overview — rolls up the rows currently in view (reflects filters).
  const cards = $derived.by(() => {
    const total = rows.length;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
    const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
    const compliant = pct(c((r) => r.complianceBand === 'compliant'));
    const ineligible = pct(c((r) => r.complianceBand === 'likely-ineligible'));
    const finance = pct(c((r) => r.approvalTier === 'finance-review'));
    const value = rows.reduce((a, r) => a + r.total, 0);
    const avgComplete =
      total === 0
        ? 0
        : Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
    return [
      { label: 'Claims in view', value: String(total), cls: '' },
      { label: 'Total value', value: formatMoney(value), cls: '' },
      { label: 'Policy compliant', value: compliant + '%', cls: 'text-success' },
      { label: 'Likely ineligible', value: ineligible + '%', cls: ineligible ? 'text-error' : '' },
      { label: 'Needs finance', value: finance + '%', cls: finance ? 'text-warning' : '' },
      { label: 'Avg completeness', value: avgComplete + '%', cls: '' }
    ];
  });

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Claim' },
    { id: 'workerName', header: 'Worker', sortable: true },
    { id: 'claimTitle', header: 'Title' },
    {
      id: 'status',
      header: 'Status',
      format: fmt((v: string) => statusLabel(v))
    },
    {
      id: 'total',
      header: 'Total',
      sortable: true,
      format: fmt((v: number) => v.toFixed(2))
    },
    {
      id: 'complianceBand',
      header: 'Compliance',
      format: fmt((v: string) => complianceLabel(v))
    },
    {
      id: 'approvalTier',
      header: 'Approval',
      sortable: true,
      format: fmt((v: string) => approvalTierLabel(v))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      format: fmt((v: string) => recommendationLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'approvalTier',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/expense-reimbursement/expense-reimbursements/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Expense claims dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Three-axis grades for expense claims, computed by the shared engine. Select a row to open
        the claim.
      </p>
    </div>
    <a
      href="/expense-reimbursement/expense-reimbursements/new"
      class="button"
      data-variant="primary">New claim</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Approval tier</span>
      <select class="select inline-block w-auto" bind:value={approvalFilter}>
        <option value="">All</option>
        <option value="line-manager">Line manager</option>
        <option value="budget-holder">Budget holder</option>
        <option value="finance-review">Finance review</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="approve">Approve</option>
        <option value="escalate">Escalate</option>
        <option value="request-more-information">Request more information</option>
        <option value="reject">Reject</option>
      </select>
    </label>
  </div>

  <section class="mb-4" aria-label="Claims overview">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {#each cards as card (card.label)}
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
          <div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
          <div class="text-xs text-base-content/60">{card.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <DataGrid
    label="Expense claims dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} claims</p>
</main>

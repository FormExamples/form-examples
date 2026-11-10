<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
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

  // Follow the active Lily theme: pick the dark SVAR skin when the theme's
  // base surface is dark. Recomputed whenever <html data-theme> changes (after
  // the new theme stylesheet has applied its tokens).
  let isDark = $state(false);
  function computeDark(): boolean {
    if (!browser) return false;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-base-100')
      .trim();
    const m = v.match(/oklch\(\s*([0-9.]+%?)/);
    if (!m) return false;
    const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    return l < 0.5;
  }
  $effect(() => {
    if (!browser) return;
    const update = () => (isDark = computeDark());
    update();
    const obs = new MutationObserver(() => setTimeout(update, 120));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  });
  const GridTheme = $derived(isDark ? WillowDark : Willow);

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns = [
    { id: 'id', header: 'Claim', width: 90 },
    { id: 'workerName', header: 'Worker', flexgrow: 2, sort: true },
    { id: 'claimTitle', header: 'Title', flexgrow: 2 },
    {
      id: 'status',
      header: 'Status',
      width: 110,
      template: (v: string) => statusLabel(v)
    },
    {
      id: 'total',
      header: 'Total',
      width: 100,
      sort: true,
      template: (v: number) => v.toFixed(2)
    },
    {
      id: 'complianceBand',
      header: 'Compliance',
      width: 140,
      template: (v: string) => complianceLabel(v)
    },
    {
      id: 'approvalTier',
      header: 'Approval',
      width: 130,
      sort: true,
      template: (v: string) => approvalTierLabel(v)
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      width: 100,
      template: (v: number) => `${v}%`
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      width: 200,
      template: (v: string) => recommendationLabel(v)
    },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'approvalTier', order: 'desc' });
    // Open a claim when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null) goto(`/expense-reimbursement/expense-reimbursements/${ev.id}`);
    });
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

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} claims</p>
</main>

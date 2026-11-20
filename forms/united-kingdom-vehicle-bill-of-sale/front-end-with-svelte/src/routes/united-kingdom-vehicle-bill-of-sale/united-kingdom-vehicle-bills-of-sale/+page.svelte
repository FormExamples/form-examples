<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleBillOfSaleRows } from '#lib/data/sample-reports.js';
  import { classificationLabel } from '#lib/engine/utils.js';

  let classificationFilter = $state('');

  const rows = $derived(
    sampleBillOfSaleRows.filter(
      (r) => classificationFilter === '' || r.classification === classificationFilter
    )
  );

  // Follow the active Lily theme: pick the dark SVAR skin when the theme's base
  // surface is dark. Recomputed whenever <html data-theme> changes (after the
  // new theme stylesheet has applied its tokens).
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

  // SVAR DataGrid columns. The classification renders through the shared engine output so the dashboard and report stay
  // aligned.
  const columns = [
    { id: 'id', header: 'Bill of sale', width: 150 },
    { id: 'registration', header: 'Registration', width: 130, sort: true },
    { id: 'vehicle', header: 'Vehicle', flexgrow: 1, sort: true },
    { id: 'sellerName', header: 'Seller', flexgrow: 1, sort: true },
    { id: 'buyerName', header: 'Buyer', flexgrow: 1, sort: true },
    { id: 'updatedAt', header: 'Updated', width: 120, sort: true },
    {
      id: 'classification',
      header: 'Classification',
      width: 150,
      sort: true,
      template: (v: string) => classificationLabel(v as never)
    },
    { id: 'riskFlagCount', header: 'Risks', width: 80, sort: true },
    { id: 'missingItemCount', header: 'Missing', width: 90, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'registration', order: 'asc' });
    // Open a bill of sale when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(`/united-kingdom-vehicle-bill-of-sale/united-kingdom-vehicle-bills-of-sale/${ev.id}`);
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Vehicle bill of sale dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Classification, missing-item, risk, and flag counts for bills of sale, computed by the
        shared engine. Select a row to open the bill of sale. This dashboard is documentation
        support, not legal advice.
      </p>
    </div>
    <a
      href="/united-kingdom-vehicle-bill-of-sale/united-kingdom-vehicle-bills-of-sale/new"
      class="button"
      data-variant="primary">New bill of sale</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Classification</span>
      <select class="select inline-block w-auto" bind:value={classificationFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
        <option value="risk-flagged">Risk flagged</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} bills of sale</p>
</main>

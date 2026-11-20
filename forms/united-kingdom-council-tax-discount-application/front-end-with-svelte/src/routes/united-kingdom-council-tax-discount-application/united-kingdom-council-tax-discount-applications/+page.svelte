<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';
  import {
    eligibilityClassLabel,
    claimTypeLabel,
    indicativeOutcomeLabel
  } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter(
      (r) => validityFilter === '' || r.eligibilityClass === validityFilter
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

  // SVAR DataGrid columns. Eligibility class and the indicative outcome render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns = [
    { id: 'id', header: 'Application', width: 150 },
    { id: 'accountReference', header: 'Account', width: 130, sort: true },
    { id: 'applicantName', header: 'Applicant', flexgrow: 2, sort: true },
    {
      id: 'claimType',
      header: 'Claim',
      flexgrow: 2,
      sort: true,
      template: (v: string) => claimTypeLabel(v as never)
    },
    { id: 'billingAuthority', header: 'Authority', flexgrow: 1, sort: true },
    {
      id: 'eligibilityClass',
      header: 'Eligibility',
      width: 150,
      sort: true,
      template: (v: string) => eligibilityClassLabel(v as never)
    },
    {
      id: 'indicativeOutcome',
      header: 'Indicative outcome',
      flexgrow: 2,
      sort: true,
      template: (v: string) => indicativeOutcomeLabel(v as never)
    },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'applicantName', order: 'asc' });
    // Open an application when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(
          `/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/${ev.id}`
        );
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Council Tax applications dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility class, claim type, indicative outcome, and flag counts for applications,
        computed by the shared engine. Select a row to open the application. This dashboard
        pre-checks only — eligibility is decided by the billing authority.
      </p>
    </div>
    <a
      href="/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="likely-eligible">Likely eligible</option>
        <option value="incomplete">Incomplete</option>
        <option value="likely-ineligible">Likely ineligible</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

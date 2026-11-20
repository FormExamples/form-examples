<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';
  import { applicationClassLabel, stageShort } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => classFilter === '' || r.applicationClass === classFilter)
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

  // SVAR DataGrid columns. Validity class and the derived underlying cause
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns = [
    { id: 'id', header: 'Application', width: 150 },
    { id: 'applicantName', header: 'Applicant', flexgrow: 2, sort: true },
    { id: 'respondentName', header: 'Other spouse', flexgrow: 2, sort: true },
    {
      id: 'stage',
      header: 'Stage',
      width: 150,
      sort: true,
      template: (v: string) => stageShort(v as never)
    },
    {
      id: 'applicationClass',
      header: 'Readiness',
      width: 150,
      sort: true,
      template: (v: string) => applicationClassLabel(v as never)
    },
    { id: 'earliestEligibleDate', header: 'Earliest date', width: 130, sort: true },
    { id: 'caseworkerName', header: 'Caseworker', flexgrow: 1, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'applicantName', order: 'asc' });
    // Open an application when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(`/united-kingdom-divorce-application/united-kingdom-divorce-applications/${ev.id}`);
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Divorce application caseworker dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, earliest eligible date and flag counts for applications, computed by the
        shared engine. Select a row to open the application. This dashboard classifies and checks
        completeness — it gives no legal advice.
      </p>
    </div>
    <a
      href="/united-kingdom-divorce-application/united-kingdom-divorce-applications/new"
      class="button"
      data-variant="primary">New check</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="ready-to-apply">Ready to apply</option>
        <option value="incomplete">Incomplete</option>
        <option value="not-eligible-yet">Not eligible yet</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

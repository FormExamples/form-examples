<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleRegistrationRows } from '#lib/data/sample-reports.js';
  import { readinessClassLabel } from '#lib/engine/utils.js';

  let readinessFilter = $state('');

  const rows = $derived(
    sampleRegistrationRows.filter(
      (r) => readinessFilter === '' || r.readinessClass === readinessFilter
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

  // SVAR DataGrid columns. Readiness class and days since birth render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns = [
    { id: 'id', header: 'Application', width: 150 },
    { id: 'childName', header: 'Child', flexgrow: 2, sort: true },
    { id: 'informantName', header: 'Informant', flexgrow: 1, sort: true },
    { id: 'registeredDate', header: 'Registration date', width: 150, sort: true },
    { id: 'daysSinceBirth', header: 'Days since birth', width: 140, sort: true },
    {
      id: 'readinessClass',
      header: 'Readiness',
      width: 200,
      sort: true,
      template: (v: string) => readinessClassLabel(v as never)
    },
    { id: 'lateRegistration', header: 'Late', width: 80, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'childName', order: 'asc' });
    // Open an application when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(`/united-kingdom-birth-registration/united-kingdom-birth-registrations/${ev.id}`);
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Birth registration dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, days since birth, and flag counts for applications, computed by the shared
        engine. Select a row to open the application. This dashboard classifies and checks
        completeness — it does not register a birth or replace the registrar.
      </p>
    </div>
    <a
      href="/united-kingdom-birth-registration/united-kingdom-birth-registrations/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="incomplete">Incomplete</option>
        <option value="needs-additional-evidence">Needs additional evidence</option>
        <option value="out-of-scope">Out of scope</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

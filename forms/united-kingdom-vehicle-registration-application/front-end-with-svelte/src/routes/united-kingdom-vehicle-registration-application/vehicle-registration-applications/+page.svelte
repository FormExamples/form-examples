<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';
  import { poundsLabel, validityClassLabel } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => validityFilter === '' || r.validityClass === validityFilter)
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

  // SVAR DataGrid columns. Validity class and the fee render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns = [
    { id: 'id', header: 'Application', width: 150 },
    { id: 'applicantName', header: 'Applicant', flexgrow: 2, sort: true },
    { id: 'applicationType', header: 'Application type', flexgrow: 2, sort: true },
    { id: 'registrationNumber', header: 'Registration', width: 120, sort: true },
    { id: 'updatedAt', header: 'Date', width: 120, sort: true },
    {
      id: 'validityClass',
      header: 'Validity',
      width: 190,
      sort: true,
      template: (v: string) => validityClassLabel(v)
    },
    {
      id: 'feeDueAsPence',
      header: 'Fee due',
      width: 100,
      sort: true,
      template: (v: number | null) => poundsLabel(v)
    },
    { id: 'missingItemCount', header: 'Missing', width: 90, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'applicantName', order: 'asc' });
    // Open an application when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(
          `/united-kingdom-vehicle-registration-application/vehicle-registration-applications/${ev.id}`
        );
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Vehicle registration application dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity class, fee due, and counts of missing items and flags for applications, computed by
        the shared engine. Select a row to open the application. This dashboard checks completeness
        — it makes no decision on any application.
      </p>
    </div>
    <a
      href="/united-kingdom-vehicle-registration-application/vehicle-registration-applications/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="needs-supporting-documents">Needs supporting documents</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>

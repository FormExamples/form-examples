<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
  import { fetchDashboardRows } from '#lib/api/medical-device-assessments.js';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { readinessLabel, routeLabel, shortClass } from '#lib/engine/utils.js';
  import type { ConformityRoute, DashboardRow, DeviceClass, Readiness } from '#lib/engine/types.js';

  let search = $state('');
  let classFilter = $state('');
  let routeFilter = $state('');
  let readinessFilter = $state('');

  // Sample rows show immediately; they are replaced by the joined back-end
  // rows when the API answers with at least one assessment, and kept (with a
  // notice) when it is down or empty.
  let allRows = $state<DashboardRow[]>(sampleAssessmentRows);
  let notice = $state('');
  $effect(() => {
    if (!browser) return;
    fetchDashboardRows()
      .then((items) => {
        if (items.length > 0) {
          allRows = items;
          notice = '';
        } else {
          notice = 'Showing sample data — backend returned no assessments.';
        }
      })
      .catch((err: unknown) => {
        notice = `Showing sample data — backend offline (${err instanceof Error ? err.message : 'fetch failed'}).`;
      });
  });

  const rows = $derived(
    allRows.filter((r) => {
      if (search) {
        const term = search.toLowerCase();
        const hit = [r.device, r.summary, r.determiningRule, r.deviceKind].some((v) =>
          String(v || '')
            .toLowerCase()
            .includes(term)
        );
        if (!hit) return false;
      }
      if (classFilter === 'none') return r.finalClass === '';
      if (classFilter && r.finalClass !== classFilter) return false;
      if (routeFilter && r.conformityRoute !== routeFilter) return false;
      if (readinessFilter && r.readiness !== readinessFilter) return false;
      return true;
    })
  );

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

  // Columns mirror the HTML dashboard; class, route and readiness render
  // through the shared engine label helpers.
  const columns = [
    { id: 'id', header: 'Assessment', width: 140 },
    { id: 'date', header: 'Date', width: 120, sort: true },
    { id: 'device', header: 'Device', flexgrow: 2, sort: true },
    { id: 'deviceKind', header: 'Kind', width: 170, sort: true },
    {
      id: 'computedClass',
      header: 'Computed',
      width: 100,
      sort: true,
      template: (v: DeviceClass) => shortClass(v)
    },
    {
      id: 'finalClass',
      header: 'Final class',
      width: 100,
      sort: true,
      template: (v: DeviceClass, row: unknown) =>
        shortClass(v, (row as DashboardRow | undefined)?.classSuffix)
    },
    {
      id: 'conformityRoute',
      header: 'Conformity route',
      flexgrow: 2,
      template: (v: ConformityRoute) => routeLabel(v)
    },
    { id: 'determiningRule', header: 'Determining rule', width: 150, sort: true },
    {
      id: 'readiness',
      header: 'Readiness',
      width: 130,
      sort: true,
      template: (v: Readiness) => readinessLabel(v)
    },
    {
      id: 'flags',
      header: 'Flags',
      flexgrow: 2,
      template: (v: string[]) => (v && v.length > 0 ? v.join(', ') : '—')
    }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'date', order: 'desc' });
    // Open an assessment when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null) goto(`/medical-device-assessment/medical-device-assessments/${ev.id}`);
    });
  }
</script>

<header class="page-header">
  <div class="page-header-inner">
    <h1>Medical device assessment dashboard</h1>
    <p class="subtitle">
      Computed and final device class, conformity route, determining rule, readiness and flags for
      assessed devices, computed by the shared engine. Select a row to open the assessment.
    </p>
  </div>
</header>

<main class="mx-16 px-4 py-6">
  {#if notice}
    <div data-testid="status-banner" class="mb-4">
      <Alert type="warning" role="status">{notice}</Alert>
    </div>
  {/if}

  <div class="mb-6 flex justify-end">
    <a
      href="/medical-device-assessment/medical-device-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Search</span>
      <input
        class="text-input inline-block w-auto"
        type="search"
        placeholder="Device, rule or purpose"
        bind:value={search}
      />
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Final class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="I">Class I</option>
        <option value="IIa">Class IIa</option>
        <option value="IIb">Class IIb</option>
        <option value="III">Class III</option>
        <option value="none">Not determined</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Conformity route</span>
      <select class="select inline-block w-auto" bind:value={routeFilter}>
        <option value="">All</option>
        <option value="self-declaration">Self-declaration</option>
        <option value="notified-body-partial">Notified body, partial</option>
        <option value="notified-body-full">Notified body, full</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready">Ready</option>
        <option value="gaps">Gaps to close</option>
        <option value="blocked">Blocked</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} devices</p>
</main>

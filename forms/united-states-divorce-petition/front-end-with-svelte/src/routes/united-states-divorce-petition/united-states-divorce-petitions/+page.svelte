<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { samplePetitionRows } from '#lib/data/sample-reports.js';
  import { readinessClassLabel } from '#lib/engine/utils.js';

  let readinessFilter = $state('');

  const rows = $derived(
    samplePetitionRows.filter((r) => readinessFilter === '' || r.readinessClass === readinessFilter)
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

  // SVAR DataGrid columns. Readiness class and the earliest decree date render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns = [
    { id: 'id', header: 'Petition', width: 150 },
    { id: 'petitionerName', header: 'Petitioner', flexgrow: 2, sort: true },
    { id: 'respondentName', header: 'Respondent', flexgrow: 2, sort: true },
    { id: 'state', header: 'State', width: 80, sort: true },
    { id: 'caseType', header: 'Case type', width: 120, sort: true },
    { id: 'filedDate', header: 'Filed', width: 120, sort: true },
    {
      id: 'readinessClass',
      header: 'Readiness',
      width: 150,
      sort: true,
      template: (v: string) => readinessClassLabel(v as never)
    },
    { id: 'earliestDecreeDate', header: 'Earliest decree', width: 140, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'petitionerName', order: 'asc' });
    // Open a petition when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(`/united-states-divorce-petition/united-states-divorce-petitions/${ev.id}`);
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Divorce petitions dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, earliest permitted decree date, and flag counts for petitions, computed by
        the shared engine. Select a row to open the petition. This dashboard classifies only; it
        gives no legal advice and the court decides.
      </p>
    </div>
    <a
      href="/united-states-divorce-petition/united-states-divorce-petitions/new"
      class="button"
      data-variant="primary"
    >
      New petition
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready-to-file">Ready to file</option>
        <option value="incomplete">Incomplete</option>
        <option value="not-yet-eligible">Not yet eligible</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} petitions</p>
</main>

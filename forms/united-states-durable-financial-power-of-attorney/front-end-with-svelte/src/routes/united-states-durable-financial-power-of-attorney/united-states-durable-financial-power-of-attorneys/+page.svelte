<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleInstrumentRows } from '#lib/data/sample-reports.js';
  import { validityClassLabel } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleInstrumentRows.filter((r) => validityFilter === '' || r.validityClass === validityFilter)
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
    { id: 'id', header: 'Instrument', width: 150 },
    { id: 'state', header: 'State', width: 80, sort: true },
    { id: 'principalName', header: 'Principal', flexgrow: 2, sort: true },
    { id: 'agentName', header: 'Agent', flexgrow: 1, sort: true },
    { id: 'updatedDate', header: 'Updated', width: 120, sort: true },
    {
      id: 'validityClass',
      header: 'Validity',
      width: 160,
      sort: true,
      template: (v: string) => validityClassLabel(v as never)
    },
    { id: 'governingState', header: 'Governing rule', flexgrow: 2, sort: true },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'principalName', order: 'asc' });
    // Open an instrument when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null)
        goto(
          `/united-states-durable-financial-power-of-attorney/united-states-durable-financial-power-of-attorneys/${ev.id}`
        );
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">
        Durable power of attorney readiness dashboard
      </h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity class, governing state rule, and flag counts for plans, computed by the shared
        engine. Select a row to open the plan. This dashboard classifies — it is documentation
        support, not legal advice.
      </p>
    </div>
    <a
      href="/united-states-durable-financial-power-of-attorney/united-states-durable-financial-power-of-attorneys/new"
      class="button"
      data-variant="primary"
    >
      New plan
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="ready-to-execute">Ready to execute</option>
        <option value="incomplete">Incomplete</option>
        <option value="execution-risk">Execution risk</option>
      </select>
    </label>
  </div>

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} instruments</p>
</main>

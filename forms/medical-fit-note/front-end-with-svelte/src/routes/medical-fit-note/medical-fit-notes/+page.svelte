<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { Grid, Willow, WillowDark, type IApi } from '@svar-ui/svelte-grid';
  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
  import { fetchDashboardRows } from '#lib/api/index.js';
  import Alert from '#lib/components/ui/Alert.svelte';
  import type { DashboardRow } from '#lib/engine/types.js';
  import { adviceLabel, approvalLabel } from '#lib/engine/utils.js';

  let approvalFilter = $state('');
  let adviceFilter = $state('');

  // Start with the offline sample rows, then replace them with the joined
  // back-end rows when the API answers with at least one graded fit note.
  let allRows: DashboardRow[] = $state(sampleAssessmentRows);
  let notice = $state('');
  $effect(() => {
    if (!browser) return;
    let cancelled = false;
    fetchDashboardRows()
      .then((fetched) => {
        if (cancelled) return;
        if (fetched.length > 0) {
          allRows = fetched;
          notice = '';
        } else {
          notice = 'Showing sample data — backend returned no fit notes.';
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        notice = `Showing sample data — backend offline (${
          err instanceof Error ? err.message : 'fetch failed'
        }).`;
      });
    return () => {
      cancelled = true;
    };
  });

  const rows = $derived(
    allRows.filter(
      (r) =>
        (approvalFilter === '' || r.approval === approvalFilter) &&
        (adviceFilter === '' || r.advice === adviceFilter)
    )
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

  // SVAR DataGrid columns. Approval, adjustments, period and flags all render
  // from the shared engine output so the dashboard and report stay aligned.
  const columns = [
    { id: 'id', header: 'Fit note', width: 100 },
    { id: 'date', header: 'Date', width: 120, sort: true, template: (v: string) => v || '—' },
    { id: 'employee', header: 'Employee', flexgrow: 2, sort: true },
    { id: 'employer', header: 'Employer', flexgrow: 2, sort: true },
    {
      id: 'advice',
      header: 'Advice',
      flexgrow: 2,
      sort: true,
      template: (v: string) => adviceLabel(v) || '—'
    },
    {
      id: 'durationDays',
      header: 'Days',
      width: 80,
      sort: true,
      template: (v: number | null) => (v == null ? '—' : String(v))
    },
    { id: 'adjustments', header: 'Adjustments', width: 120, sort: true },
    {
      id: 'approval',
      header: 'Approval',
      width: 160,
      sort: true,
      template: (v: string) => approvalLabel(v)
    },
    { id: 'flagCount', header: 'Flags', width: 80, sort: true },
    { id: 'clinician', header: 'Clinician', flexgrow: 1, sort: true }
  ];

  function init(api: IApi) {
    api.exec('sort-rows', { key: 'employee', order: 'asc' });
    // Open a fit note when its row is selected.
    api.on('select-row', (ev: { id?: string | number }) => {
      if (ev?.id != null) goto(`/medical-fit-note/medical-fit-notes/${ev.id}`);
    });
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Fit note dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Approval status, advice, period, adjustments and flags for each fit note, computed by the
        shared engine. Select a row to open the fit note.
      </p>
    </div>
    <a href="/medical-fit-note/medical-fit-notes/new" class="button" data-variant="primary"
      >New fit note</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Approval</span>
      <select class="select inline-block w-auto" bind:value={approvalFilter}>
        <option value="">All</option>
        <option value="approved">Approved</option>
        <option value="needs-completion">Needs completion</option>
        <option value="blocked">Blocked</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Advice</span>
      <select class="select inline-block w-auto" bind:value={adviceFilter}>
        <option value="">All</option>
        <option value="not-fit-for-work">Not fit for work</option>
        <option value="may-be-fit-for-work">May be fit for work</option>
      </select>
    </label>
  </div>

  {#if notice}
    <Alert type="warning" role="status" class="mb-4" data-testid="status-banner">{notice}</Alert>
  {/if}

  <div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
    <GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
  </div>

  <p class="mt-4 text-sm text-base-content/60">{rows.length} fit notes</p>
</main>

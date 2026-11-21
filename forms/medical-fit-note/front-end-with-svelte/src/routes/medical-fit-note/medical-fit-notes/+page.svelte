<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  // A column's template, typed as it was written, as a DataGrid format. A missing
  // value (null, undefined or '') is left to the grid's emptyValue.
  const fmt =
    <T,>(template: (value: T, row: DataGridRow) => string) =>
    (value: unknown, row: DataGridRow): string =>
      value === null || value === undefined || value === '' ? '' : template(value as T, row);
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

  // SVAR DataGrid columns. Approval, adjustments, period and flags all render
  // from the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Fit note' },
    { id: 'date', header: 'Date', sortable: true, format: fmt((v: string) => v || '—') },
    { id: 'employee', header: 'Employee', sortable: true },
    { id: 'employer', header: 'Employer', sortable: true },
    {
      id: 'advice',
      header: 'Advice',
      sortable: true,
      format: fmt((v: string) => adviceLabel(v) || '—')
    },
    {
      id: 'durationDays',
      header: 'Days',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    { id: 'adjustments', header: 'Adjustments', sortable: true },
    {
      id: 'approval',
      header: 'Approval',
      sortable: true,
      format: fmt((v: string) => approvalLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    { id: 'clinician', header: 'Clinician', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'employee',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/medical-fit-note/medical-fit-notes/${id}`);
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

  <DataGrid
    label="Fit note dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} fit notes</p>
</main>

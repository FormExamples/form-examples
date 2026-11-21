<script lang="ts">
  import { goto } from '$app/navigation';
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
  import { priorityLabel } from '#lib/engine/utils.js';
  import type { CompositePriority } from '#lib/engine/types.js';

  let priorityFilter = $state('');
  let categoryFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (priorityFilter === '' || r.compositePriority === priorityFilter) &&
        (categoryFilter === '' || r.category === categoryFilter)
    )
  );

  // SVAR DataGrid columns. The composite priority, severity, and harm grade
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Issue' },
    { id: 'summary', header: 'Summary', sortable: true },
    { id: 'reportedDate', header: 'Reported', sortable: true },
    { id: 'category', header: 'Category', sortable: true },
    {
      id: 'environment',
      header: 'Environment',
      sortable: true
    },

    {
      id: 'compositePriority',
      header: 'Priority',
      sortable: true,
      format: fmt((v: CompositePriority) => priorityLabel(v))
    },

    {
      id: 'severity',
      header: 'Severity',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },

    {
      id: 'harm',
      header: 'Harm',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },

    {
      id: 'frequency',
      header: 'Freq.',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v}%`))
    },
    {
      id: 'regulatoryFlag',
      header: 'Regulatory',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'id',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/issue-tracker/issues/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Issue triage dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite priority, severity, harm grade, and safety-flag count for reported issues,
        computed by the shared engine. Select a row to open the issue.
      </p>
    </div>
    <a href="/issue-tracker/issues/new" class="button" data-variant="primary">New issue</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="software-defect">Software defect</option>
        <option value="service-outage">Service outage</option>
        <option value="performance">Performance</option>
        <option value="security">Security</option>
        <option value="data-protection">Data protection</option>
        <option value="clinical-safety">Clinical safety</option>
        <option value="workplace-safety">Workplace safety</option>
        <option value="medical-device">Medical device</option>
        <option value="regulatory">Regulatory</option>
        <option value="project-blocker">Project blocker</option>
        <option value="customer-complaint">Customer complaint</option>
        <option value="hardware-fault">Hardware fault</option>
        <option value="process">Process</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Issue triage dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} issues</p>
</main>

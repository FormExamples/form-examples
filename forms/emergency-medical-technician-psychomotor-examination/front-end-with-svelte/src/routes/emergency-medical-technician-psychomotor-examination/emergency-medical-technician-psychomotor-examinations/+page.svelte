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
  import { outcomeLabel } from '#lib/engine/utils.js';
  import type { ExamAttempt, Outcome } from '#lib/engine/types.js';

  const plural = 'emergency-medical-technician-psychomotor-examinations';

  let outcomeFilter = $state('');
  let attemptFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (attemptFilter === '' || r.attempt === attemptFilter)
    )
  );

  const attemptLabel: Record<ExamAttempt, string> = {
    'first-attempt': 'First attempt',
    retest: 'Retest',
    '': '—'
  };

  // SVAR DataGrid columns. Outcome, points, percent, and critical-criteria
  // count render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Examination' },
    { id: 'candidateName', header: 'Candidate', sortable: true },
    { id: 'sessionDate', header: 'Date', sortable: true },
    {
      id: 'attempt',
      header: 'Attempt',
      sortable: true,
      format: fmt((v: ExamAttempt) => attemptLabel[v] ?? '—')
    },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: Outcome) => outcomeLabel(v))
    },
    { id: 'score', header: 'Points' },
    { id: 'percent', header: 'Percent', sortable: true, format: fmt((v: number) => `${v}%`) },
    { id: 'criticalCount', header: 'Critical fails', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'candidateName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/emergency-medical-technician-psychomotor-examination/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Training coordinator dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Pass / Fail outcome, points, and critical-criteria failures for graded candidates, computed
        by the shared engine. Select a row to open the examination.
      </p>
    </div>
    <a
      href="/emergency-medical-technician-psychomotor-examination/{plural}/new"
      class="button"
      data-variant="primary">New examination</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="pass">Pass</option>
        <option value="fail">Fail</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Attempt</span>
      <select class="select inline-block w-auto" bind:value={attemptFilter}>
        <option value="">All</option>
        <option value="first-attempt">First attempt</option>
        <option value="retest">Retest</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Training coordinator dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} candidates</p>
</main>

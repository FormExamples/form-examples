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
  import { outcomeLabel, roleLabel } from '#lib/engine/utils.js';
  import type { Outcome, TraineeRole } from '#lib/engine/types.js';

  let outcomeFilter = $state('');
  let roleFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (roleFilter === '' || r.role === roleFilter)
    )
  );

  // SVAR DataGrid columns. The Pass/Fail outcome, critical-action failures,
  // and deficiency counts render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'traineeName',
      header: 'Trainee',
      sortable: true
    },

    {
      id: 'role',
      header: 'Role',
      sortable: true,
      format: fmt((v: TraineeRole) => roleLabel(v) || '—')
    },
    { id: 'sessionDate', header: 'Session', sortable: true },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: Outcome) => outcomeLabel(v))
    },
    { id: 'criticalFailures', header: 'Critical fails', sortable: true },
    { id: 'deficiencies', header: 'Deficiencies', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'traineeName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Training coordinator dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Pass / Fail outcome, critical-action failures, and deficiency counts for assessed trainees,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/new"
      class="button"
      data-variant="primary">New assessment</a
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
      <span class="mr-2 font-medium text-base-content/80">Role</span>
      <select class="select inline-block w-auto" bind:value={roleFilter}>
        <option value="">All</option>
        <option value="instructor">Instructor</option>
        <option value="first-responder">First responder</option>
        <option value="nurse">Nurse</option>
        <option value="paramedic">Paramedic</option>
        <option value="physician">Physician</option>
        <option value="other">Other</option>
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

  <p class="mt-4 text-sm text-base-content/60">{rows.length} trainees</p>
</main>

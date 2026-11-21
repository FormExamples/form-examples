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
  import { escalationBandLabel, ageBandLabel } from '#lib/engine/utils.js';

  const plural = 'paediatric-early-warning-scores';

  let bandFilter = $state('');
  let ageBandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (bandFilter === '' || r.escalationBand === bandFilter) &&
        (ageBandFilter === '' || r.ageBand === ageBandFilter)
    )
  );

  // SVAR DataGrid columns. Aggregate, escalation band, single-parameter trigger,
  // and monitoring frequency render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'ageBand',
      header: 'Age band',
      sortable: true,
      format: fmt((v: string) => ageBandLabel(v as never))
    },
    { id: 'careSetting', header: 'Care setting', sortable: true },
    { id: 'observedDate', header: 'Observed', sortable: true },
    { id: 'aggregateScore', header: 'PEWS', sortable: true },
    {
      id: 'escalationBand',
      header: 'Escalation',
      sortable: true,
      format: fmt((v: string) => escalationBandLabel(v as never))
    },
    {
      id: 'singleParameterTrigger',
      header: 'Single param = 3',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'monitoringFrequency', header: 'Monitoring' },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'observedDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/paediatric-early-warning-score/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">PEWS clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Aggregate PEWS total, escalation band, single-parameter trigger, and recommended monitoring
        frequency for assessed children, computed by the shared age-banded engine. Select a row to
        open the assessment.
      </p>
    </div>
    <a href="/paediatric-early-warning-score/{plural}/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Escalation band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Age band</span>
      <select class="select inline-block w-auto" bind:value={ageBandFilter}>
        <option value="">All</option>
        <option value="neonate">Neonate</option>
        <option value="infant">Infant</option>
        <option value="young-child">Young child</option>
        <option value="child">Child</option>
        <option value="adolescent">Adolescent</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="PEWS clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>

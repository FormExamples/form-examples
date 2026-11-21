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
  import {
    outcomeBandLabel,
    readingOutcomeLabel,
    screeningOutcomeLabel
  } from '#lib/engine/utils.js';

  let unitFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (unitFilter === '' || r.screeningUnit === unitFilter) &&
        (bandFilter === '' || r.outcomeBand === bandFilter)
    )
  );

  const units = $derived([...new Set(sampleAssessmentRows.map((r) => r.screeningUnit))].sort());

  // SVAR DataGrid columns. The reading outcome, imaging classification,
  // screening outcome, outcome band, and flag count all render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
    { id: 'patientIdentifier', header: 'Patient ID', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'reportedDate', header: 'Reported', sortable: true },
    { id: 'screeningUnit', header: 'Unit', sortable: true },
    {
      id: 'readingOutcome',
      header: 'Reading',
      sortable: true,
      format: fmt((v: string) => readingOutcomeLabel(v as never))
    },
    {
      id: 'imagingClassification',
      header: 'Class',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    {
      id: 'screeningOutcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => screeningOutcomeLabel(v as never))
    },
    {
      id: 'outcomeBand',
      header: 'Band',
      sortable: true,
      format: fmt((v: string) => outcomeBandLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/breast-screening/breast-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Breast screening dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Reading outcome, imaging classification, screening outcome, outcome band, and safety-flag
        counts for screened women, computed by the shared engine. Select a row to open the record.
      </p>
    </div>
    <a href="/breast-screening/breast-screenings/new" class="button" data-variant="primary"
      >New record</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Unit</span>
      <select class="select inline-block w-auto" bind:value={unitFilter}>
        <option value="">All</option>
        {#each units as u (u)}
          <option value={u}>{u}</option>
        {/each}
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="routine">Routine recall</option>
        <option value="repeat">Technical repeat</option>
        <option value="assessment">Assessment</option>
        <option value="urgent">Urgent</option>
        <option value="referral">Referral</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Breast screening dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>

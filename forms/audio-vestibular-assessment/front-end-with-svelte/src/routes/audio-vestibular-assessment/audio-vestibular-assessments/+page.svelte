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
  import { hearingLossGradeShort, dhiHandicapShort } from '#lib/engine/utils.js';
  import type { HearingLossGrade, DhiHandicapLevel } from '#lib/engine/types.js';

  let hearingFilter = $state('');
  let handicapFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (hearingFilter === '' || r.hearingLossGrade === hearingFilter) &&
        (handicapFilter === '' || r.dhiHandicapLevel === handicapFilter)
    )
  );

  // SVAR DataGrid columns. The WHO hearing-loss grade and DHI handicap level
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'betterEarPta',
      header: 'Better-ear PTA',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : `${v} dB`))
    },
    {
      id: 'hearingLossGrade',
      header: 'WHO hearing grade',
      sortable: true,
      format: fmt((v: HearingLossGrade) => hearingLossGradeShort(v))
    },
    { id: 'dhiTotal', header: 'DHI', sortable: true },
    {
      id: 'dhiHandicapLevel',
      header: 'DHI handicap',
      sortable: true,
      format: fmt((v: DhiHandicapLevel) => dhiHandicapShort(v))
    },
    {
      id: 'vestibularFlag',
      header: 'Vestibular',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/audio-vestibular-assessment/audio-vestibular-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Audio-vestibular clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        WHO hearing-loss grade and Dizziness Handicap Inventory results for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/audio-vestibular-assessment/audio-vestibular-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">WHO hearing grade</span>
      <select class="select inline-block w-auto" bind:value={hearingFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="moderately-severe">Moderately Severe</option>
        <option value="severe">Severe</option>
        <option value="profound">Profound</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">DHI handicap</span>
      <select class="select inline-block w-auto" bind:value={handicapFilter}>
        <option value="">All</option>
        <option value="no-handicap">No Handicap</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Audio-vestibular clinician dashboard"
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

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
  import { gradeShort, outcomeLabel } from '#lib/engine/utils.js';

  let gradeFilter = $state('');
  let outcomeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || r.grade === gradeFilter) &&
        (outcomeFilter === '' || r.outcome === outcomeFilter)
    )
  );

  // SVAR DataGrid columns. The OET grade, 0-500 score and pass/refer outcome
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'candidateName', header: 'Candidate', sortable: true },
    { id: 'testDate', header: 'Tested', sortable: true },
    {
      id: 'profession',
      header: 'Profession',
      sortable: true
    },

    {
      id: 'grade',
      header: 'OET grade',
      sortable: true,
      format: fmt((v: string) => gradeShort(v as never))
    },
    { id: 'score', header: 'Score / 500', sortable: true },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'candidateName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Speaking assessment dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        OET Medicine speaking sub-test results — letter grade, 0-500 score and registration outcome
        for assessed candidates, computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">OET grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="A">Grade A</option>
        <option value="B">Grade B</option>
        <option value="C+">Grade C+</option>
        <option value="C">Grade C</option>
        <option value="D">Grade D</option>
        <option value="E">Grade E</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="pass">Pass</option>
        <option value="refer">Below threshold</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Speaking assessment dashboard"
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

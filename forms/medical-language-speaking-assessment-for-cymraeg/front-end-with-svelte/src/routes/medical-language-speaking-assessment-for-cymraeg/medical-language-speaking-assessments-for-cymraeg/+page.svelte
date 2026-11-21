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
  import { gradeShortLabel } from '#lib/engine/utils.js';
  import type { OETGrade } from '#lib/engine/types.js';

  const plural = 'medical-language-speaking-assessments-for-cymraeg';

  let gradeFilter = $state('');
  let thresholdFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || r.grade === gradeFilter) &&
        (thresholdFilter === '' || String(r.thresholdMet) === thresholdFilter)
    )
  );

  // SVAR DataGrid columns. Grade, scaled score, and totals render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'candidateName',
      header: 'Candidate',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'grade',
      header: 'Grade',
      sortable: true,
      format: fmt((v: OETGrade) => gradeShortLabel(v))
    },

    {
      id: 'scaledScore',
      header: 'Score /500',
      sortable: true
    },

    {
      id: 'linguisticTotal',
      header: 'Ling /24',
      sortable: true
    },

    {
      id: 'clinicalTotal',
      header: 'Clin /15',
      sortable: true
    },

    {
      id: 'thresholdMet',
      header: 'Clinical threshold',
      format: fmt((v: boolean) => (v ? 'Met' : 'Below'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'candidateName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/medical-language-speaking-assessment-for-cymraeg/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Cymraeg clinical-speaking dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        CEFR-mapped grade, scaled score, and linguistic / clinical totals for assessed candidates,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href={`/${plural}/new`} class="button" data-variant="primary">New assessment</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="A">A (CEFR C2)</option>
        <option value="B">B (CEFR C1)</option>
        <option value="C+">C+ (CEFR B2+)</option>
        <option value="C">C (CEFR B2)</option>
        <option value="D">D (CEFR B1)</option>
        <option value="E">E (CEFR A2-)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Clinical threshold</span>
      <select class="select inline-block w-auto" bind:value={thresholdFilter}>
        <option value="">All</option>
        <option value="true">Met</option>
        <option value="false">Below</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Cymraeg clinical-speaking dashboard"
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

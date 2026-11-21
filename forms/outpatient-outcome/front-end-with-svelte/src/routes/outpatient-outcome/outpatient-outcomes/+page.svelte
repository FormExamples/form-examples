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

  let gradeFilter = $state('');
  let specialtyFilter = $state('');

  const specialties = $derived(
    [...new Set(sampleAssessmentRows.map((r) => r.specialty))].filter(Boolean).sort()
  );

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || r.overallGrade === gradeFilter) &&
        (specialtyFilter === '' || r.specialty === specialtyFilter)
    )
  );

  const gradeCell = (v: string) => (v ? v : '—');

  // SVAR DataGrid columns. The four OOCG domain grades and the overall grade
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Report', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Clinic date', sortable: true },
    { id: 'specialty', header: 'Specialty', sortable: true },
    {
      id: 'overallGrade',
      header: 'Overall',
      sortable: true,
      format: fmt(gradeCell)
    },

    {
      id: 'clinicalGrade',
      header: 'Clinical',
      sortable: true,
      format: fmt(gradeCell)
    },

    {
      id: 'promGrade',
      header: 'PROM',
      sortable: true,
      format: fmt(gradeCell)
    },

    {
      id: 'premGrade',
      header: 'PREM',
      sortable: true,
      format: fmt(gradeCell)
    },

    {
      id: 'operationalGrade',
      header: 'Operational',
      sortable: true,
      format: fmt(gradeCell)
    },

    {
      id: 'waitTimeDays',
      header: 'Wait (d)',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/outpatient-outcome/outpatient-outcomes/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Outpatient outcome dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        OOCG domain grades and overall grade for reported outpatient episodes, computed by the
        shared engine. Select a row to open the report.
      </p>
    </div>
    <a href="/outpatient-outcome/outpatient-outcomes/new" class="button" data-variant="primary"
      >New report</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="A">A — Excellent</option>
        <option value="B">B — Good</option>
        <option value="C">C — Unchanged</option>
        <option value="D">D — Poor</option>
        <option value="E">E — Very poor</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Specialty</span>
      <select class="select inline-block w-auto" bind:value={specialtyFilter}>
        <option value="">All</option>
        {#each specialties as s (s)}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Outpatient outcome dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">
    {rows.length} reports · overall grade is the worst of the four domains
  </p>
</main>

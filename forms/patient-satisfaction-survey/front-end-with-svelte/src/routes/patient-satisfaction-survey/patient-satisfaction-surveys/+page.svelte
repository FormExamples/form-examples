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
  import { satisfactionCategoryLabel } from '#lib/engine/utils.js';
  import type { SatisfactionCategory } from '#lib/engine/types.js';

  let categoryFilter = $state('');
  let visitTypeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.category === categoryFilter) &&
        (visitTypeFilter === '' || r.visitType === visitTypeFilter)
    )
  );

  const visitTypeLabel: Record<string, string> = {
    outpatient: 'Outpatient',
    inpatient: 'Inpatient',
    'day-case': 'Day case',
    emergency: 'Emergency',
    telehealth: 'Telehealth',
    'home-visit': 'Home visit'
  };

  // SVAR DataGrid columns. Satisfaction score and category render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Survey' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'surveyedDate',
      header: 'Surveyed',
      sortable: true
    },

    {
      id: 'visitType',
      header: 'Visit type',
      sortable: true,
      format: fmt((v: string) => visitTypeLabel[v] ?? (v || '—'))
    },

    {
      id: 'score',
      header: 'Score',
      sortable: true,
      format: fmt((v: number) => `${v}/100`)
    },

    {
      id: 'category',
      header: 'Satisfaction',
      sortable: true,
      format: fmt((v: SatisfactionCategory) => satisfactionCategoryLabel(v))
    },
    {
      id: 'complaintFlag',
      header: 'Complaint',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'score',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/patient-satisfaction-survey/patient-satisfaction-surveys/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Patient satisfaction dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Normalized satisfaction score and category for completed surveys, computed by the shared
        engine. Select a row to open the survey.
      </p>
    </div>
    <a
      href="/patient-satisfaction-survey/patient-satisfaction-surveys/new"
      class="button"
      data-variant="primary">New survey</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Satisfaction</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
        <option value="satisfactory">Satisfactory</option>
        <option value="poor">Poor</option>
        <option value="very-poor">Very Poor</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Visit type</span>
      <select class="select inline-block w-auto" bind:value={visitTypeFilter}>
        <option value="">All</option>
        <option value="outpatient">Outpatient</option>
        <option value="inpatient">Inpatient</option>
        <option value="day-case">Day case</option>
        <option value="emergency">Emergency</option>
        <option value="telehealth">Telehealth</option>
        <option value="home-visit">Home visit</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Patient satisfaction dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} surveys</p>
</main>

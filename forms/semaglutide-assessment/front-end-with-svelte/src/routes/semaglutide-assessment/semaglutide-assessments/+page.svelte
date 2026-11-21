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
  import { eligibilityLabel } from '#lib/engine/utils.js';

  let eligibilityFilter = $state('');
  let indicationFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (eligibilityFilter === '' || r.eligibilityStatus === eligibilityFilter) &&
        (indicationFilter === '' || r.primaryIndication === indicationFilter)
    )
  );

  const indicationLabels: Record<string, string> = {
    'type2-diabetes': 'Type 2 diabetes',
    'weight-management': 'Weight management',
    'cardiovascular-risk-reduction': 'CV risk reduction'
  };

  // SVAR DataGrid columns. Eligibility status, BMI / category, indication and
  // contraindication / flag counts render through the shared engine output so
  // the dashboard and report stay aligned.
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
      id: 'eligibilityStatus',
      header: 'Eligibility',
      sortable: true,
      format: fmt((v: string) => eligibilityLabel(v))
    },
    {
      id: 'bmi',
      header: 'BMI',
      sortable: true,
      format: fmt((v: number | null) => (v != null ? v.toFixed(1) : '—'))
    },

    {
      id: 'bmiCategory',
      header: 'BMI category',
      sortable: true
    },

    {
      id: 'primaryIndication',
      header: 'Indication',
      sortable: true,
      format: fmt((v: string) => indicationLabels[v] ?? v ?? '—')
    },
    { id: 'absoluteCount', header: 'Absolute', sortable: true },
    { id: 'relativeCount', header: 'Relative', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/semaglutide-assessment/semaglutide-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Semaglutide clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility status, BMI category, indication, and contraindication / flag counts for
        assessed patients, computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/semaglutide-assessment/semaglutide-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility</span>
      <select class="select inline-block w-auto" bind:value={eligibilityFilter}>
        <option value="">All</option>
        <option value="Eligible">Eligible</option>
        <option value="Conditional">Conditional</option>
        <option value="Ineligible">Ineligible</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Indication</span>
      <select class="select inline-block w-auto" bind:value={indicationFilter}>
        <option value="">All</option>
        <option value="type2-diabetes">Type 2 diabetes</option>
        <option value="weight-management">Weight management</option>
        <option value="cardiovascular-risk-reduction">CV risk reduction</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Semaglutide clinician dashboard"
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

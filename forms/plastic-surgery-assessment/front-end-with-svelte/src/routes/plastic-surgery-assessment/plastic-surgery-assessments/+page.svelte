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
  import { riskLevelLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let asaFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (asaFilter === '' || String(r.asaClass ?? '') === asaFilter)
    )
  );

  const roman = ['I', 'II', 'III', 'IV', 'V'];

  // SVAR DataGrid columns. ASA / wound / complexity classes and the overall
  // risk render through the shared engine output so the dashboard and report
  // stay aligned.
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
      id: 'asaClass',
      header: 'ASA class',
      sortable: true,
      format: fmt((v: number | null) => (v ? `ASA ${roman[v - 1]}` : '—'))
    },
    {
      id: 'woundClass',
      header: 'Wound class',
      sortable: true,
      format: fmt((v: number | null) => (v ? `Class ${roman[v - 1]}` : '—'))
    },
    {
      id: 'complexityScore',
      header: 'Complexity',
      sortable: true,
      format: fmt((v: number | null) => (v ? `Cx ${v}` : '—'))
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },

    {
      id: 'smokerFlag',
      header: 'Smoker',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
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
    goto(`/plastic-surgery-assessment/plastic-surgery-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Plastic surgery clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ASA / wound / complexity classification and overall surgical risk for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/plastic-surgery-assessment/plastic-surgery-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ASA class</span>
      <select class="select inline-block w-auto" bind:value={asaFilter}>
        <option value="">All</option>
        <option value="1">ASA I</option>
        <option value="2">ASA II</option>
        <option value="3">ASA III</option>
        <option value="4">ASA IV</option>
        <option value="5">ASA V</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Plastic surgery clinician dashboard"
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

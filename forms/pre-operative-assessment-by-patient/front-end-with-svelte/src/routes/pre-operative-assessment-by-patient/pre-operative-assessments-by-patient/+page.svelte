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

  let asaFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (asaFilter === '' || String(r.asaGrade) === asaFilter) &&
        (urgencyFilter === '' || r.procedureUrgency === urgencyFilter)
    )
  );

  const roman = ['I', 'II', 'III', 'IV', 'V'];

  // SVAR DataGrid columns. The ASA grade and safety flags render through the
  // shared engine output so the dashboard and report stay aligned.
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
      id: 'asaGrade',
      header: 'ASA grade',
      sortable: true,
      format: fmt((v: number) => `ASA ${roman[v - 1] ?? v}`)
    },
    {
      id: 'procedureUrgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—'))
    },

    {
      id: 'airwayFlag',
      header: 'Airway',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'anticoagulantFlag',
      header: 'Anticoag.',
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
    goto(`/pre-operative-assessment-by-patient/pre-operative-assessments-by-patient/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Pre-operative clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ASA Physical Status grade and safety flags for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/pre-operative-assessment-by-patient/pre-operative-assessments-by-patient/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ASA grade</span>
      <select class="select inline-block w-auto" bind:value={asaFilter}>
        <option value="">All</option>
        <option value="1">ASA I</option>
        <option value="2">ASA II</option>
        <option value="3">ASA III</option>
        <option value="4">ASA IV</option>
        <option value="5">ASA V</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Procedure urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="elective">Elective</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Pre-operative clinician dashboard"
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

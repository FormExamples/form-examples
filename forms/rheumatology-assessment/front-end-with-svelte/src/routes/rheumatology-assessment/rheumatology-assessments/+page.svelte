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
  import { diseaseActivityLabel, diagnosisLabel } from '#lib/engine/utils.js';
  import type { DiseaseActivity, DiseaseHistory } from '#lib/engine/types.js';

  let activityFilter = $state('');
  let diagnosisFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (activityFilter === '' || r.diseaseActivity === activityFilter) &&
        (diagnosisFilter === '' || r.diagnosis === diagnosisFilter)
    )
  );

  // SVAR DataGrid columns. The DAS28 score and disease activity render through
  // the shared engine output so the dashboard and report stay aligned.
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
      id: 'diagnosis',
      header: 'Diagnosis',
      sortable: true,
      format: fmt((v: DiseaseHistory['primaryDiagnosis']) => diagnosisLabel(v))
    },
    {
      id: 'das28Score',
      header: 'DAS28',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : v.toFixed(2)))
    },
    {
      id: 'diseaseActivity',
      header: 'Disease activity',
      sortable: true,
      format: fmt((v: DiseaseActivity | null) => diseaseActivityLabel(v))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'biologicFlag',
      header: 'Biologic',
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
    goto(`/rheumatology-assessment/rheumatology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Rheumatology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        DAS28 disease activity score and classification for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/rheumatology-assessment/rheumatology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Disease activity</span>
      <select class="select inline-block w-auto" bind:value={activityFilter}>
        <option value="">All</option>
        <option value="remission">Remission</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Diagnosis</span>
      <select class="select inline-block w-auto" bind:value={diagnosisFilter}>
        <option value="">All</option>
        <option value="rheumatoid-arthritis">Rheumatoid arthritis</option>
        <option value="psoriatic-arthritis">Psoriatic arthritis</option>
        <option value="ankylosing-spondylitis">Ankylosing spondylitis</option>
        <option value="systemic-lupus">Systemic lupus</option>
        <option value="gout">Gout</option>
        <option value="osteoarthritis">Osteoarthritis</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Rheumatology clinician dashboard"
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

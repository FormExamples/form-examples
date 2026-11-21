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
  import { vaccinationLevelLabel } from '#lib/engine/utils.js';

  let levelFilter = $state('');
  let immunoFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (levelFilter === '' || r.vaccinationLevel === levelFilter) &&
        (immunoFilter === '' || String(r.immunocompromisedFlag) === immunoFilter)
    )
  );

  // SVAR DataGrid columns. The vaccination level and completeness score render
  // through the shared engine output so the dashboard and report stay aligned.
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
      id: 'vaccinationScore',
      header: 'Score',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'vaccinationLevel',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => vaccinationLevelLabel(v))
    },
    {
      id: 'immunocompromisedFlag',
      header: 'Immuno.',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'contraindicationFlag',
      header: 'Contra.',
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
    goto(`/vaccinations-assessment/vaccinations-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Vaccinations clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Vaccination level and completeness score for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/vaccinations-assessment/vaccinations-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="upToDate">Up to Date</option>
        <option value="partiallyComplete">Partially Complete</option>
        <option value="overdue">Overdue</option>
        <option value="contraindicated">Contraindicated</option>
        <option value="draft">Draft</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Immunocompromised</span>
      <select class="select inline-block w-auto" bind:value={immunoFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Vaccinations clinician dashboard"
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

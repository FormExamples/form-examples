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
  import { childPughClassLabel, careSettingLabel, surgicalRiskLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let classFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (classFilter === '' || r.childPughClass === classFilter)
    )
  );

  // SVAR DataGrid columns. Score, class, and surgical risk render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

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
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    { id: 'childPughScore', header: 'Score', sortable: true },
    {
      id: 'childPughClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => childPughClassLabel(v as never))
    },
    {
      id: 'surgicalRisk',
      header: 'Surgical risk',
      sortable: true,
      format: fmt((v: string) => surgicalRiskLabel(v as never))
    },
    {
      id: 'highFlag',
      header: 'High flag',
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
    goto(`/child-pugh-score/child-pugh-scores/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Child-Pugh dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Child-Pugh score, class, and surgical risk for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/child-pugh-score/child-pugh-scores/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="hepatology-clinic">Hepatology / gastroenterology clinic</option>
        <option value="ward">General / acute ward</option>
        <option value="pre-operative">Pre-operative assessment</option>
        <option value="intensive-care">Intensive care</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="A">Class A</option>
        <option value="B">Class B</option>
        <option value="C">Class C</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Child-Pugh dashboard"
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

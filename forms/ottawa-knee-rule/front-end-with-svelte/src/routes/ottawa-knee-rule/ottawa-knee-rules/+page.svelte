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
  import { decisionLabel, careSettingLabel, injuredSideLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let decisionFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (decisionFilter === '' || r.decision === decisionFilter)
    )
  );

  // SVAR DataGrid columns. Decision, fired-criterion count, and the flag count
  // render through the shared engine output so the dashboard and report stay
  // aligned.
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
    {
      id: 'injuredSide',
      header: 'Side',
      format: fmt((v: string) => injuredSideLabel(v as never) || '—')
    },
    {
      id: 'decision',
      header: 'Decision',
      sortable: true,
      format: fmt((v: string) => decisionLabel(v as never))
    },
    { id: 'firedCount', header: 'Criteria', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/ottawa-knee-rule/ottawa-knee-rules/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Ottawa Knee Rule clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Imaging decision, fired-criterion count, and flags for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/ottawa-knee-rule/ottawa-knee-rules/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="emergency-department">Emergency department</option>
        <option value="minor-injuries-unit">Minor-injuries unit</option>
        <option value="urgent-care">Urgent-care / walk-in centre</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Decision</span>
      <select class="select inline-block w-auto" bind:value={decisionFilter}>
        <option value="">All</option>
        <option value="xray-indicated">X-ray indicated</option>
        <option value="xray-not-indicated">X-ray not indicated</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Ottawa Knee Rule clinician dashboard"
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

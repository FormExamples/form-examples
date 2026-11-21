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
  import {
    riskBandLabel,
    careSettingLabel,
    anticoagulationStatusLabel
  } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (bandFilter === '' || r.riskBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. HAS-BLED score, risk band, and high-bleeding-risk
  // flag render through the shared engine output so the dashboard and report
  // stay aligned.
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
      id: 'anticoagulationStatus',
      header: 'Anticoagulation',
      sortable: true,
      format: fmt((v: string) => anticoagulationStatusLabel(v as never) || '—')
    },

    {
      id: 'hasBledScore',
      header: 'HAS-BLED',
      sortable: true
    },

    {
      id: 'riskBand',
      header: 'Risk band',
      sortable: true,
      format: fmt((v: string) => riskBandLabel(v as never))
    },
    {
      id: 'highBleedingRiskFlag',
      header: 'High risk',
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
    goto(`/has-bled-score-for-major-bleeding-risk/has-bled-score-for-major-bleeding-risks/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">HAS-BLED clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        HAS-BLED score, risk band, and high-bleeding-risk flag for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/has-bled-score-for-major-bleeding-risk/has-bled-score-for-major-bleeding-risks/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="cardiology">Cardiology</option>
        <option value="general-practice">General practice</option>
        <option value="anticoagulation-clinic">Anticoagulation clinic</option>
        <option value="acute-medical">Acute medical</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="low">Low (0)</option>
        <option value="moderate">Moderate (1-2)</option>
        <option value="high">High (3+)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="HAS-BLED clinician dashboard"
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

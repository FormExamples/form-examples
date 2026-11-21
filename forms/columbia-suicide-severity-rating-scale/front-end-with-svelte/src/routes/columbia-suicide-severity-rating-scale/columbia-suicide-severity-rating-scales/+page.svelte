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
  import { riskTierLabel, careSettingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let tierFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (tierFilter === '' || r.riskTier === tierFilter)
    )
  );

  // SVAR DataGrid columns. Ideation level, risk tier, and the escalation flag
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
      header: 'Care setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },

    {
      id: 'ideationLevel',
      header: 'Ideation',
      sortable: true
    },

    {
      id: 'riskTier',
      header: 'Risk tier',
      sortable: true,
      format: fmt((v: string) => riskTierLabel(v as never))
    },
    {
      id: 'escalationFlag',
      header: 'Escalate',
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
    goto(`/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">C-SSRS clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Ideation level, risk tier, and safety flags for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="mental-health">Mental-health service</option>
        <option value="emergency-department">Emergency department</option>
        <option value="primary-care">Primary care</option>
        <option value="crisis-service">Crisis service</option>
        <option value="inpatient">Inpatient ward</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk tier</span>
      <select class="select inline-block w-auto" bind:value={tierFilter}>
        <option value="">All</option>
        <option value="low">Low risk</option>
        <option value="moderate">Moderate risk</option>
        <option value="high">High risk</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="C-SSRS clinician dashboard"
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

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
  import { careSettingLabel } from '#lib/engine/utils.js';

  const plural = 'emergency-department-triage-notes';

  let levelFilter = $state('');
  let settingFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (levelFilter === '' || String(r.priorityLevel) === levelFilter) &&
        (settingFilter === '' || r.careSetting === settingFilter)
    )
  );

  // SVAR DataGrid columns. Priority level, name, target time, supporting NEWS2,
  // and flag count render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Triage', sortable: true },
    {
      id: 'patientIdentifier',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Care setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never))
    },
    { id: 'triagedDate', header: 'Triaged', sortable: true },
    {
      id: 'priorityLevel',
      header: 'Priority',
      sortable: true
    },

    {
      id: 'priorityName',
      header: 'Category',
      sortable: true
    },

    {
      id: 'targetMinutes',
      header: 'Target',
      format: fmt((v: number) => (v === 0 ? 'Immediate' : `${v} min`))
    },
    { id: 'news2Total', header: 'NEWS2', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'priorityLevel',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/emergency-department-triage-note/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ED triage clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Manchester Triage System priority level, category, target time to first assessment,
        supporting NEWS2 aggregate, and flag count for triaged patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/emergency-department-triage-note/{plural}/new" class="button" data-variant="primary"
      >New triage</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Priority level</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="1">1 — Immediate</option>
        <option value="2">2 — Very urgent</option>
        <option value="3">3 — Urgent</option>
        <option value="4">4 — Standard</option>
        <option value="5">5 — Non-urgent</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="emergency-department">Emergency department</option>
        <option value="urgent-treatment-centre">Urgent treatment centre</option>
        <option value="minor-injuries-unit">Minor injuries unit</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ED triage clinician dashboard"
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

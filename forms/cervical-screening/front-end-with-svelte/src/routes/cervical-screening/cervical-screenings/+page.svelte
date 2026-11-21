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
  import { resultClassLabel, managementActionLabel, careSettingLabel } from '#lib/engine/utils.js';

  let careSettingFilter = $state('');
  let resultClassFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (careSettingFilter === '' || r.careSetting === careSettingFilter) &&
        (resultClassFilter === '' || r.resultClass === resultClassFilter)
    )
  );

  // SVAR DataGrid columns. Result class, management action, and the urgent /
  // flag indicators render through the shared engine output so the dashboard
  // and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Screening' },
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
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },

    {
      id: 'screenedDate',
      header: 'Screened',
      sortable: true
    },

    {
      id: 'resultClass',
      header: 'Result class',
      sortable: true,
      format: fmt((v: string) => resultClassLabel(v as never))
    },
    {
      id: 'managementAction',
      header: 'Management',
      sortable: true,
      format: fmt((v: string) => managementActionLabel(v as never))
    },
    {
      id: 'urgentFlag',
      header: 'Urgent',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : '—'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/cervical-screening/cervical-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Cervical screening dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Result class, management action, and safety flags for screened patients, computed by the
        shared engine. Select a row to open the screening.
      </p>
    </div>
    <a href="/cervical-screening/cervical-screenings/new" class="button" data-variant="primary"
      >New screening</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Setting</span>
      <select class="select inline-block w-auto" bind:value={careSettingFilter}>
        <option value="">All</option>
        <option value="general-practice">General practice</option>
        <option value="sexual-health">Sexual & reproductive health</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Result class</span>
      <select class="select inline-block w-auto" bind:value={resultClassFilter}>
        <option value="">All</option>
        <option value="hpv-negative">HPV negative</option>
        <option value="hpv-positive-cytology-normal">HPV positive, cytology normal</option>
        <option value="hpv-positive-cytology-abnormal-low">HPV positive, abnormal (low)</option>
        <option value="hpv-positive-cytology-abnormal-high">HPV positive, abnormal (high)</option>
        <option value="hpv-positive-cytology-pending">HPV positive, cytology outstanding</option>
        <option value="inadequate">Inadequate sample</option>
        <option value="cease-not-eligible">Cease / not eligible</option>
        <option value="pending">Pending</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Cervical screening dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} screenings</p>
</main>

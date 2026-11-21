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
  import { readinessBandLabel, anaestheticTechniqueLabel } from '#lib/engine/utils.js';

  const plural = 'post-anaesthesia-care-unit-records';

  let techniqueFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (techniqueFilter === '' || r.anaestheticTechnique === techniqueFilter) &&
        (bandFilter === '' || r.readinessBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Aldrete total, readiness band, and not-ready flag
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
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
      id: 'admittedDate',
      header: 'Admitted',
      sortable: true
    },

    {
      id: 'anaestheticTechnique',
      header: 'Technique',
      sortable: true,
      format: fmt((v: string) => anaestheticTechniqueLabel(v as never) || '—')
    },
    { id: 'aldreteTotal', header: 'Aldrete', sortable: true },
    {
      id: 'readinessBand',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: string) => readinessBandLabel(v as never))
    },
    {
      id: 'notReadyFlag',
      header: 'Not ready',
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
    goto(`/post-anaesthesia-care-unit-record/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">PACU recovery-team dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Modified Aldrete total, readiness band, and flags for recovering patients, computed by the
        shared engine. Select a row to open the record.
      </p>
    </div>
    <a href="/post-anaesthesia-care-unit-record/{plural}/new" class="button" data-variant="primary"
      >New record</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Technique</span>
      <select class="select inline-block w-auto" bind:value={techniqueFilter}>
        <option value="">All</option>
        <option value="general">General anaesthesia</option>
        <option value="regional">Regional anaesthesia</option>
        <option value="sedation">Procedural sedation</option>
        <option value="combined">Combined</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="discharge-ready">Discharge-ready</option>
        <option value="not-ready">Not ready</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="PACU recovery-team dashboard"
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

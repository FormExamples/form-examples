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
  import { classificationLabel, camVariantLabel, motoricSubtypeLabel } from '#lib/engine/utils.js';

  let variantFilter = $state('');
  let classificationFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (variantFilter === '' || r.camVariant === variantFilter) &&
        (classificationFilter === '' || r.classification === classificationFilter)
    )
  );

  // SVAR DataGrid columns. Classification, positive-feature count, and the
  // delirium flag render through the shared engine output so the dashboard and
  // report stay aligned.
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
      id: 'wardUnit',
      header: 'Ward / unit',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'camVariant',
      header: 'Variant',
      sortable: true,
      format: fmt((v: string) => camVariantLabel(v as never) || '—')
    },
    {
      id: 'classification',
      header: 'Classification',
      sortable: true,
      format: fmt((v: string) => classificationLabel(v as never))
    },
    {
      id: 'motoricSubtype',
      header: 'Subtype',
      sortable: true,
      format: fmt((v: string) => motoricSubtypeLabel(v as never) || '—')
    },
    {
      id: 'deliriumFlag',
      header: 'Delirium',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'positiveCount', header: 'Positive', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/confusion-assessment-method/confusion-assessment-methods/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">CAM clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Delirium classification, positive features, and safety flags for assessed patients, computed
        by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/confusion-assessment-method/confusion-assessment-methods/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Variant</span>
      <select class="select inline-block w-auto" bind:value={variantFilter}>
        <option value="">All</option>
        <option value="cam">CAM (standard bedside)</option>
        <option value="cam-icu">CAM-ICU (ventilated / non-verbal)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Classification</span>
      <select class="select inline-block w-auto" bind:value={classificationFilter}>
        <option value="">All</option>
        <option value="present">Delirium present</option>
        <option value="absent">Delirium absent</option>
        <option value="unable-to-assess">Unable to assess</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="CAM clinician dashboard"
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

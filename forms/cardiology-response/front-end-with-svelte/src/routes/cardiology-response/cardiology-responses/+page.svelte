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
  import { sampleReports } from '#lib/data/sample-reports.js';
  import {
    responseClassificationLabel,
    severityLabel,
    followUpUrgencyLabel,
    consultationTypeLabel,
    responseStatusLabel
  } from '#lib/engine/utils.js';

  let classificationFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleReports.filter(
      (r) =>
        (classificationFilter === '' || r.responseClassification === classificationFilter) &&
        (urgencyFilter === '' || r.followUpUrgency === urgencyFilter)
    )
  );

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Response' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'consultationType',
      header: 'Consultation',
      format: fmt((v: string) => consultationTypeLabel(v as never))
    },
    {
      id: 'responseStatus',
      header: 'Status',
      format: fmt((v: string) => responseStatusLabel(v as never))
    },

    {
      id: 'respondedDate',
      header: 'Responded',
      sortable: true
    },

    {
      id: 'responseClassification',
      header: 'Classification',
      format: fmt((v: string) => responseClassificationLabel(v as never))
    },

    {
      id: 'severity',
      header: 'Severity',
      format: fmt((v: string) => severityLabel(v as never))
    },

    {
      id: 'followUpUrgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => followUpUrgencyLabel(v as never))
    },
    { id: 'completenessPercent', header: 'Complete', format: fmt((v: number) => `${v}%`) },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'followUpUrgency',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/cardiology-response/cardiology-responses/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Graded cardiology responses</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis interpretation grades for completed cardiology responses, computed by the shared
        engine. Select a row to open the response.
      </p>
    </div>
    <a href="/cardiology-response/cardiology-responses/new" class="button" data-variant="primary"
      >New response</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Classification</span>
      <select class="select inline-block w-auto" bind:value={classificationFilter}>
        <option value="">All</option>
        <option value="no-abnormality">No abnormality</option>
        <option value="cardiac-condition">Cardiac condition</option>
        <option value="critical">Critical</option>
        <option value="inconclusive">Inconclusive</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Follow-up urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="recommended">Recommended</option>
        <option value="urgent">Urgent</option>
        <option value="critical-alert">Critical alert</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Graded cardiology responses"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>

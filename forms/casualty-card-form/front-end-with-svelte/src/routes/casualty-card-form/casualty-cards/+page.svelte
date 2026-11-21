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
  import { news2ResponseLabel, mtsCategoryLabel } from '#lib/engine/utils.js';

  let responseFilter = $state('');
  let mtsFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (responseFilter === '' || r.news2Response === responseFilter) &&
        (mtsFilter === '' || r.mtsCategory === mtsFilter)
    )
  );

  // SVAR DataGrid columns. The NEWS2 score and clinical response render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Card' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Attended', sortable: true },
    { id: 'news2Score', header: 'NEWS2', sortable: true },
    {
      id: 'news2Response',
      header: 'Clinical response',
      sortable: true,
      format: fmt((v: string) => news2ResponseLabel(v as never))
    },
    {
      id: 'mtsCategory',
      header: 'Triage (MTS)',
      sortable: true,
      format: fmt((v: string) => mtsCategoryLabel(v) || '—')
    },
    { id: 'chiefComplaint', header: 'Chief complaint' },
    {
      id: 'allergyFlag',
      header: 'Allergy',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'news2Score',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/casualty-card-form/casualty-cards/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Casualty card clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NEWS2 score and clinical response for ED attendances, computed by the shared engine. Select
        a row to open the casualty card.
      </p>
    </div>
    <a href="/casualty-card-form/casualty-cards/new" class="button" data-variant="primary"
      >New card</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Clinical response</span>
      <select class="select inline-block w-auto" bind:value={responseFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="low-medium">Low-Medium</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage (MTS)</span>
      <select class="select inline-block w-auto" bind:value={mtsFilter}>
        <option value="">All</option>
        <option value="1-immediate">1 — Immediate</option>
        <option value="2-very-urgent">2 — Very Urgent</option>
        <option value="3-urgent">3 — Urgent</option>
        <option value="4-standard">4 — Standard</option>
        <option value="5-non-urgent">5 — Non-Urgent</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Casualty card clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} attendances</p>
</main>

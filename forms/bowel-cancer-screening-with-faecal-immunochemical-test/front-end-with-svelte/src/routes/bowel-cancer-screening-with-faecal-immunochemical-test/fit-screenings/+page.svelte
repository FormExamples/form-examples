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
  import { resultClassLabel, managementActionLabel, formatHb } from '#lib/engine/utils.js';

  let hubFilter = $state('');
  let resultFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (hubFilter === '' || r.screeningHub === hubFilter) &&
        (resultFilter === '' || r.resultClass === resultFilter)
    )
  );

  const hubs = $derived([...new Set(sampleAssessmentRows.map((r) => r.screeningHub))].sort());

  // SVAR DataGrid columns. Result class, management action, and the symptomatic
  // flag render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
    { id: 'participantIdentifier', header: 'Participant ID', sortable: true },
    { id: 'participantName', header: 'Participant', sortable: true },
    { id: 'reviewedDate', header: 'Reviewed', sortable: true },
    { id: 'screeningHub', header: 'Hub', sortable: true },
    {
      id: 'faecalHb',
      header: 'Faecal Hb',
      sortable: true,
      format: fmt((v: number | null) => formatHb(v))
    },
    {
      id: 'resultClass',
      header: 'Result',
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
      id: 'symptomaticPathway',
      header: 'Symptomatic',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'participantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">FIT screening dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Result class and management action for screening episodes, computed by the shared engine.
        Select a row to open the record.
      </p>
    </div>
    <a
      href="/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/new"
      class="button"
      data-variant="primary">New screening</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Screening hub</span>
      <select class="select inline-block w-auto" bind:value={hubFilter}>
        <option value="">All</option>
        {#each hubs as hub (hub)}
          <option value={hub}>{hub}</option>
        {/each}
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Result</span>
      <select class="select inline-block w-auto" bind:value={resultFilter}>
        <option value="">All</option>
        <option value="negative">Negative</option>
        <option value="positive">Positive</option>
        <option value="spoilt">Spoilt</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="FIT screening dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} screening episodes</p>
</main>

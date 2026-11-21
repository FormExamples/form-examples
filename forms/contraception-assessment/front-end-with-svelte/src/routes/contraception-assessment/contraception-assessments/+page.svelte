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
  import { ukmecCategory } from '#lib/engine/utils.js';

  let ukmecFilter = $state('');
  let flaggedFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (ukmecFilter === '' || String(r.ukmecCategory) === ukmecFilter) &&
        (flaggedFilter === '' ||
          (flaggedFilter === 'flagged' ? r.flagCount > 0 : r.flagCount === 0))
    )
  );

  // SVAR DataGrid columns. The overall UKMEC category and the preferred-method
  // category render through the shared engine output so the dashboard and the
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
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
      id: 'ukmecCategory',
      header: 'Overall UKMEC',
      sortable: true,
      format: fmt((v: number) => `UKMEC ${v} — ${ukmecCategory(v as 1 | 2 | 3 | 4)}`)
    },

    {
      id: 'preferredMethod',
      header: 'Preferred method',
      sortable: true
    },

    {
      id: 'preferredMethodCategory',
      header: 'Preferred UKMEC',
      sortable: true,
      format: fmt((v: number | null) => (v ? `UKMEC ${v}` : '—'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/contraception-assessment/contraception-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Contraception clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Overall UKMEC category and preferred-method eligibility for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/contraception-assessment/contraception-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall UKMEC</span>
      <select class="select inline-block w-auto" bind:value={ukmecFilter}>
        <option value="">All</option>
        <option value="1">UKMEC 1 — No restriction</option>
        <option value="2">UKMEC 2 — Advantages outweigh risks</option>
        <option value="3">UKMEC 3 — Risks outweigh advantages</option>
        <option value="4">UKMEC 4 — Unacceptable health risk</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Flagged issues</span>
      <select class="select inline-block w-auto" bind:value={flaggedFilter}>
        <option value="">All</option>
        <option value="flagged">Has flags</option>
        <option value="none">No flags</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Contraception clinician dashboard"
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

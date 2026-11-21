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
  import { outcomeLabel, examinationContextLabel, sexLabel } from '#lib/engine/utils.js';

  let contextFilter = $state('');
  let outcomeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (contextFilter === '' || r.examinationContext === contextFilter) &&
        (outcomeFilter === '' || r.overallOutcome === outcomeFilter)
    )
  );

  // SVAR DataGrid columns. Overall outcome, completeness, and referral / flag
  // counts render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Examination' },
    { id: 'babyIdentifier', header: 'Baby ID', sortable: true },
    { id: 'babyName', header: 'Baby', sortable: true },
    {
      id: 'sex',
      header: 'Sex',
      sortable: true,
      format: fmt((v: string) => sexLabel(v as never) || '—')
    },

    {
      id: 'examinedDate',
      header: 'Examined',
      sortable: true
    },

    {
      id: 'examinationContext',
      header: 'Context',
      sortable: true,
      format: fmt((v: string) => examinationContextLabel(v as never) || '—')
    },
    {
      id: 'overallOutcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'referralCount', header: 'Referrals', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'babyName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/newborn-and-infant-physical-examination/newborn-and-infant-physical-examinations/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">NIPE clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Screening outcome, completeness, referral pathways, and safety flags for examined babies,
        computed by the shared engine. Select a row to open the examination.
      </p>
    </div>
    <a
      href="/newborn-and-infant-physical-examination/newborn-and-infant-physical-examinations/new"
      class="button"
      data-variant="primary">New examination</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Context</span>
      <select class="select inline-block w-auto" bind:value={contextFilter}>
        <option value="">All</option>
        <option value="newborn-72h">Newborn (within 72 hours)</option>
        <option value="infant-6-8-week">Infant (6-8 week review)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="satisfactory">Satisfactory</option>
        <option value="refer">Refer</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="NIPE clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} babies</p>
</main>

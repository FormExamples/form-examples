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
    outcomeClassificationLabel,
    legalRiskBandLabel,
    followUpUrgencyLabel,
    responseStatusLabel
  } from '#lib/engine/utils.js';

  let outcomeFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleReports.filter(
      (r) =>
        (outcomeFilter === '' || r.outcomeClassification === outcomeFilter) &&
        (urgencyFilter === '' || r.followUpUrgency === urgencyFilter)
    )
  );

  // Compliance overview — rolls up the rows currently in view. Reflects the
  // active filters, so slicing by outcome or urgency re-scopes the metrics.
  const cards = $derived.by(() => {
    const total = rows.length;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
    const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
    const agreedSet = ['fully-agreed', 'partially-agreed', 'alternative-offered'] as string[];
    const agreed = pct(c((r) => agreedSet.includes(r.outcomeClassification)));
    const declined = pct(c((r) => r.outcomeClassification === 'declined'));
    const highRisk = pct(c((r) => r.legalRiskBand === 'high-risk'));
    const escalation = pct(c((r) => r.followUpUrgency === 'escalation-needed'));
    const avgComplete =
      total === 0
        ? 0
        : Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
    return [
      { label: 'Responses in view', value: String(total), cls: '' },
      {
        label: 'Agreed (full / part)',
        value: agreed + '%',
        cls: 'text-success'
      },

      {
        label: 'Declined',
        value: declined + '%',
        cls: declined ? 'text-warning' : ''
      },

      {
        label: 'Discrimination-risk',
        value: highRisk + '%',
        cls: highRisk ? 'text-error' : 'text-success'
      },
      { label: 'Escalation', value: escalation + '%', cls: escalation ? 'text-error' : '' },
      { label: 'Avg completeness', value: avgComplete + '%', cls: '' }
    ];
  });

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Response' },
    { id: 'workerName', header: 'Worker', sortable: true },
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
      id: 'outcomeClassification',
      header: 'Outcome',
      format: fmt((v: string) => outcomeClassificationLabel(v as never))
    },
    {
      id: 'legalRiskBand',
      header: 'Legal risk',
      sortable: true,
      format: fmt((v: string) => legalRiskBandLabel(v as never))
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
    goto(`/neurodiversity-adjustment-response/neurodiversity-adjustment-responses/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Graded adjustment responses</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grades for completed neurodiversity adjustment responses, computed by the shared
        engine. Select a row to open the response.
      </p>
    </div>
    <a
      href="/neurodiversity-adjustment-response/neurodiversity-adjustment-responses/new"
      class="button"
      data-variant="primary">New response</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="fully-agreed">Fully agreed</option>
        <option value="partially-agreed">Partially agreed</option>
        <option value="alternative-offered">Alternative offered</option>
        <option value="declined">Declined</option>
        <option value="deferred">Deferred</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Follow-up urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="none">None</option>
        <option value="review-scheduled">Review scheduled</option>
        <option value="urgent-review">Urgent review</option>
        <option value="escalation-needed">Escalation needed</option>
      </select>
    </label>
  </div>

  <section class="mb-4" aria-label="Compliance overview">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {#each cards as card (card.label)}
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
          <div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
          <div class="text-xs text-base-content/60">{card.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <DataGrid
    label="Graded adjustment responses"
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

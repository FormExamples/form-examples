<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
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
  import { fetchDashboardRows } from '#lib/api/medical-device-assessments.js';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { readinessLabel, routeLabel, shortClass } from '#lib/engine/utils.js';
  import type { ConformityRoute, DashboardRow, DeviceClass, Readiness } from '#lib/engine/types.js';

  let search = $state('');
  let classFilter = $state('');
  let routeFilter = $state('');
  let readinessFilter = $state('');

  // Sample rows show immediately; they are replaced by the joined back-end
  // rows when the API answers with at least one assessment, and kept (with a
  // notice) when it is down or empty.
  let allRows = $state<DashboardRow[]>(sampleAssessmentRows);
  let notice = $state('');
  $effect(() => {
    if (!browser) return;
    fetchDashboardRows()
      .then((items) => {
        if (items.length > 0) {
          allRows = items;
          notice = '';
        } else {
          notice = 'Showing sample data — backend returned no assessments.';
        }
      })
      .catch((err: unknown) => {
        notice = `Showing sample data — backend offline (${err instanceof Error ? err.message : 'fetch failed'}).`;
      });
  });

  const rows = $derived(
    allRows.filter((r) => {
      if (search) {
        const term = search.toLowerCase();
        const hit = [r.device, r.summary, r.determiningRule, r.deviceKind].some((v) =>
          String(v || '')
            .toLowerCase()
            .includes(term)
        );
        if (!hit) return false;
      }
      if (classFilter === 'none') return r.finalClass === '';
      if (classFilter && r.finalClass !== classFilter) return false;
      if (routeFilter && r.conformityRoute !== routeFilter) return false;
      if (readinessFilter && r.readiness !== readinessFilter) return false;
      return true;
    })
  );

  // Columns mirror the HTML dashboard; class, route and readiness render
  // through the shared engine label helpers.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'date', header: 'Date', sortable: true },
    { id: 'device', header: 'Device', sortable: true },
    { id: 'deviceKind', header: 'Kind', sortable: true },
    {
      id: 'computedClass',
      header: 'Computed',
      sortable: true,
      format: fmt((v: DeviceClass) => shortClass(v))
    },
    {
      id: 'finalClass',
      header: 'Final class',
      sortable: true,
      format: fmt((v: DeviceClass, row: unknown) =>
        shortClass(v, (row as DashboardRow | undefined)?.classSuffix)
      )
    },
    {
      id: 'conformityRoute',
      header: 'Conformity route',
      format: fmt((v: ConformityRoute) => routeLabel(v))
    },
    { id: 'determiningRule', header: 'Determining rule', sortable: true },
    {
      id: 'readiness',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: Readiness) => readinessLabel(v))
    },
    {
      id: 'flags',
      header: 'Flags',
      format: fmt((v: string[]) => (v && v.length > 0 ? v.join(', ') : '—'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'date',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/medical-device-assessment/medical-device-assessments/${id}`);
  }
</script>

<header class="page-header">
  <div class="page-header-inner">
    <h1>Medical device assessment dashboard</h1>
    <p class="subtitle">
      Computed and final device class, conformity route, determining rule, readiness and flags for
      assessed devices, computed by the shared engine. Select a row to open the assessment.
    </p>
  </div>
</header>

<main class="mx-16 px-4 py-6">
  {#if notice}
    <div data-testid="status-banner" class="mb-4">
      <Alert type="warning" role="status">{notice}</Alert>
    </div>
  {/if}

  <div class="mb-6 flex justify-end">
    <a
      href="/medical-device-assessment/medical-device-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Search</span>
      <input
        class="text-input inline-block w-auto"
        type="search"
        placeholder="Device, rule or purpose"
        bind:value={search}
      />
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Final class</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="I">Class I</option>
        <option value="IIa">Class IIa</option>
        <option value="IIb">Class IIb</option>
        <option value="III">Class III</option>
        <option value="none">Not determined</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Conformity route</span>
      <select class="select inline-block w-auto" bind:value={routeFilter}>
        <option value="">All</option>
        <option value="self-declaration">Self-declaration</option>
        <option value="notified-body-partial">Notified body, partial</option>
        <option value="notified-body-full">Notified body, full</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready">Ready</option>
        <option value="gaps">Gaps to close</option>
        <option value="blocked">Blocked</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Medical device assessment dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} devices</p>
</main>

<script lang="ts">
  import { Grid, Willow } from '@svar-ui/svelte-grid';
  import SummaryCards from '$lib/components/SummaryCards.svelte';
  import { SAMPLE_FIT_NOTES } from '$lib/sample-data.js';
  import type { FitNoteSummary } from '$lib/types.js';

  // Sample-data fallback so the page works standalone (no backend required).
  let rows = $state<FitNoteSummary[]>(SAMPLE_FIT_NOTES);
  let loading = $state(false);

  let searchTerm = $state('');
  let recommendationFilter = $state('');
  let fitnessFilter = $state('');
  let professionFilter = $state('');
  let gridApi = $state<unknown>(null);

  const recommendationOptions = [
    { value: '', label: 'All recommendations' },
    { value: 'standard', label: 'Standard' },
    { value: 'refer_occupational_health', label: 'Refer to occupational health' },
    { value: 'refer_access_to_work', label: 'Refer to Access to Work' },
    { value: 'refer_employment_advisor', label: 'Refer to employment advisor' },
    { value: 'review_for_validity', label: 'Review for validity' },
  ];

  const fitnessOptions = [
    { value: '', label: 'All categories' },
    { value: 'may_be_fit', label: 'May be fit' },
    { value: 'not_fit', label: 'Not fit' },
  ];

  const professionOptions = [
    { value: '', label: 'All professions' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'occupational_therapist', label: 'Occupational therapist' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'physiotherapist', label: 'Physiotherapist' },
  ];

  /** Convert a snake_case enum to a human label. */
  function humanise(value: string): string {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const columns = [
    {
      id: 'patientName',
      header: 'Patient',
      flexgrow: 1,
      sort: true,
    },
    {
      id: 'nhsNumber',
      header: 'NHS number',
      width: 140,
      sort: true,
    },
    {
      id: 'issuerProfession',
      header: 'Profession',
      width: 160,
      sort: true,
      template: (v: string) => humanise(v),
    },
    {
      id: 'assessmentDate',
      header: 'Date',
      width: 110,
      sort: true,
    },
    {
      id: 'fitnessCategory',
      header: 'Fitness',
      width: 110,
      sort: true,
      template: (v: string) => humanise(v),
    },
    {
      id: 'adaptationIntensity',
      header: 'Adaptations',
      width: 130,
      sort: true,
      template: (v: string) => (v ? humanise(v) : '—'),
    },
    {
      id: 'periodDays',
      header: 'Days',
      width: 80,
      sort: true,
      template: (v: number | null) => (v == null ? '—' : String(v)),
    },
    {
      id: 'periodCompliance',
      header: 'Period',
      width: 160,
      sort: true,
      template: (v: string) => humanise(v),
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      width: 200,
      sort: true,
      template: (v: string) => humanise(v),
    },
    {
      id: 'safetyFlagCount',
      header: 'Flags',
      width: 80,
      sort: true,
    },
  ];

  function init(api: { exec: (action: string, opts: unknown) => void }) {
    gridApi = api;
    api.exec('sort-rows', { key: 'assessmentDate', order: 'desc' });
  }

  function applyFilters() {
    if (!gridApi) return;
    const term = searchTerm.toLowerCase();

    const filter = (row: FitNoteSummary): boolean => {
      if (term) {
        const matches =
          row.patientName.toLowerCase().includes(term) ||
          row.nhsNumber.toLowerCase().includes(term) ||
          row.issuerProfession.toLowerCase().includes(term) ||
          row.issuerName.toLowerCase().includes(term) ||
          row.diagnosis.toLowerCase().includes(term);
        if (!matches) return false;
      }
      if (recommendationFilter && row.recommendation !== recommendationFilter) {
        return false;
      }
      if (fitnessFilter && row.fitnessCategory !== fitnessFilter) {
        return false;
      }
      if (professionFilter && row.issuerProfession !== professionFilter) {
        return false;
      }
      return true;
    };

    (gridApi as { exec: (a: string, o: unknown) => void }).exec('filter-rows', { filter });
  }

  function clearFilters() {
    searchTerm = '';
    recommendationFilter = '';
    fitnessFilter = '';
    professionFilter = '';
    if (gridApi) {
      (gridApi as { exec: (a: string, o: unknown) => void }).exec('filter-rows', {
        filter: () => true,
      });
    }
  }

  let hasActiveFilters = $derived(
    searchTerm !== '' ||
      recommendationFilter !== '' ||
      fitnessFilter !== '' ||
      professionFilter !== '',
  );
</script>

<!-- Summary cards -->
<SummaryCards {rows} />

<!-- Filter bar -->
<div class="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
  <div class="flex flex-wrap items-end gap-3">
    <div class="min-w-[16rem] flex-1">
      <label for="filter-search" class="mb-1 block text-sm font-semibold text-slate-700">
        Search
      </label>
      <input
        id="filter-search"
        type="search"
        placeholder="Patient name, NHS number, profession, diagnosis..."
        bind:value={searchTerm}
        oninput={applyFilters}
        class="w-full rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      />
    </div>

    <div>
      <label for="filter-recommendation" class="mb-1 block text-sm font-semibold text-slate-700">
        Recommendation
      </label>
      <select
        id="filter-recommendation"
        bind:value={recommendationFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each recommendationOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="filter-fitness" class="mb-1 block text-sm font-semibold text-slate-700">
        Fitness category
      </label>
      <select
        id="filter-fitness"
        bind:value={fitnessFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each fitnessOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="filter-profession" class="mb-1 block text-sm font-semibold text-slate-700">
        Profession
      </label>
      <select
        id="filter-profession"
        bind:value={professionFilter}
        onchange={applyFilters}
        class="rounded-md border-2 border-slate-300 px-3 py-2 text-sm focus:border-nhs-blue focus:outline-3 focus:outline-nhs-warm-yellow"
      >
        {#each professionOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if hasActiveFilters}
      <button
        type="button"
        onclick={clearFilters}
        class="rounded-md border-2 border-nhs-blue bg-white px-3 py-2 text-sm font-semibold text-nhs-blue hover:bg-blue-50"
      >
        Clear filters
      </button>
    {/if}
  </div>

  <p class="mt-3 text-xs text-slate-500">
    {rows.length} fit notes loaded.
    {#if loading}<span class="ml-2 italic">Loading...</span>{/if}
  </p>
</div>

<!-- Data grid -->
<div class="rounded-md bg-white shadow-sm" style="height: 600px;">
  <Willow>
    <Grid data={rows} {columns} {init} />
  </Willow>
</div>

<p class="mt-4 text-xs text-slate-500">
  Recommendations are advisory clinical decision support based on the
  rule-based grading engine. The final clinical judgement remains the
  responsibility of the signing healthcare professional.
</p>

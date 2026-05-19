<script lang="ts">
  import type { FitNoteSummary, Recommendation, FitnessCategory } from '$lib/types.js';

  let { rows }: { rows: FitNoteSummary[] } = $props();

  const recommendationLabels: Array<{ key: Recommendation; label: string; accentClass: string }> = [
    { key: 'standard',                  label: 'Standard',           accentClass: 'border-t-nhs-green' },
    { key: 'refer_occupational_health', label: 'Refer to OH',        accentClass: 'border-t-amber-500' },
    { key: 'refer_access_to_work',      label: 'Access to Work',     accentClass: 'border-t-nhs-bright-blue' },
    { key: 'refer_employment_advisor',  label: 'Employment advisor', accentClass: 'border-t-violet-600' },
    { key: 'review_for_validity',       label: 'Review for validity',accentClass: 'border-t-nhs-red' },
  ];

  const fitnessLabels: Array<{ key: FitnessCategory; label: string; accentClass: string }> = [
    { key: 'may_be_fit', label: 'May be fit', accentClass: 'border-t-nhs-bright-blue' },
    { key: 'not_fit',    label: 'Not fit',    accentClass: 'border-t-nhs-red' },
  ];

  const total = $derived(rows.length);

  const recommendationCounts = $derived(
    recommendationLabels.map((d) => ({
      ...d,
      count: rows.filter((r) => r.recommendation === d.key).length,
    })),
  );

  const fitnessCounts = $derived(
    fitnessLabels.map((d) => ({
      ...d,
      count: rows.filter((r) => r.fitnessCategory === d.key).length,
    })),
  );
</script>

<section aria-labelledby="summary-heading" class="mb-4">
  <h2 id="summary-heading" class="sr-only">Summary statistics</h2>

  <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
    <!-- Total -->
    <div class="flex flex-col gap-1 rounded-md border border-slate-200 border-t-4 border-t-nhs-blue bg-white p-3 shadow-sm">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Total fit notes
      </span>
      <span class="text-2xl font-bold tabular-nums text-slate-900">{total}</span>
    </div>

    <!-- Fitness category counts -->
    {#each fitnessCounts as f (f.key)}
      <div class="flex flex-col gap-1 rounded-md border border-slate-200 border-t-4 bg-white p-3 shadow-sm {f.accentClass}">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {f.label}
        </span>
        <span class="text-2xl font-bold tabular-nums text-slate-900">{f.count}</span>
      </div>
    {/each}

    <!-- Recommendation counts -->
    {#each recommendationCounts as r (r.key)}
      <div class="flex flex-col gap-1 rounded-md border border-slate-200 border-t-4 bg-white p-3 shadow-sm {r.accentClass}">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {r.label}
        </span>
        <span class="text-2xl font-bold tabular-nums text-slate-900">{r.count}</span>
      </div>
    {/each}
  </div>
</section>

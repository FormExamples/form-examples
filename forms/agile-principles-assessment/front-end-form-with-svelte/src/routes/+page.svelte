<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/assessment.svelte.js';
  import { STEPS } from '$lib/config/steps.js';
  import Step01 from '$lib/components/steps/Step01Respondent.svelte';
  import Step02 from '$lib/components/steps/Step02CustomerSatisfaction.svelte';
  import Step03 from '$lib/components/steps/Step03WelcomeChange.svelte';
  import Step04 from '$lib/components/steps/Step04DeliverFrequently.svelte';
  import Step05 from '$lib/components/steps/Step05Collaboration.svelte';
  import Step06 from '$lib/components/steps/Step06MotivatedIndividuals.svelte';
  import Step07 from '$lib/components/steps/Step07FaceToFace.svelte';
  import Step08 from '$lib/components/steps/Step08WorkingSoftware.svelte';
  import Step09 from '$lib/components/steps/Step09SustainableDevelopment.svelte';
  import Step10 from '$lib/components/steps/Step10TechnicalExcellence.svelte';
  import Step11 from '$lib/components/steps/Step11Simplicity.svelte';
  import Step12 from '$lib/components/steps/Step12SelfOrganisingTeams.svelte';
  import Step13 from '$lib/components/steps/Step13RegularReflection.svelte';
  import Step14 from '$lib/components/steps/Step14Summary.svelte';

  const stepComponents = [
    Step01, Step02, Step03, Step04, Step05, Step06, Step07,
    Step08, Step09, Step10, Step11, Step12, Step13, Step14,
  ];

  const result = $derived(store.result);
  const progressPct = $derived(Math.round((result.answeredCount / 12) * 100));
</script>

<section class="prose max-w-none mb-6">
  <h2 class="text-xl font-semibold">Self-assessment</h2>
  <p class="text-slate-700 my-2">
    Complete all 14 sections below, then generate the report. The tool
    computes a composite agility maturity level, fires coaching rules per
    principle, and surfaces operational flags such as burnout risk,
    technical-debt risk, and command-and-control culture.
  </p>
  <div class="bg-white border border-slate-200 rounded p-3 mt-3">
    <p class="text-sm font-medium text-slate-700 mb-1">
      Progress: {result.answeredCount} of 12 principles scored ({progressPct}%)
    </p>
    <div class="w-full bg-slate-200 rounded h-2 overflow-hidden">
      <div class="h-2 bg-brand-600" style="width: {progressPct}%"></div>
    </div>
  </div>
</section>

<nav class="mb-6 flex flex-wrap gap-1 text-xs" aria-label="Step navigation">
  {#each STEPS as s (s.number)}
    <a
      href="#step-{s.number}"
      class="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-brand-50"
    >
      {s.number}. {s.short}
    </a>
  {/each}
</nav>

<div class="space-y-6">
  {#each stepComponents as StepComponent, i (i)}
    <div id="step-{i + 1}" class="bg-white p-6 rounded-lg shadow-sm scroll-mt-20">
      <StepComponent />
    </div>
  {/each}
</div>

<div class="mt-8 pt-4 border-t border-slate-200 flex flex-wrap gap-3 justify-end">
  <button
    type="button"
    class="px-4 py-2 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
    onclick={() => store.reset()}
  >
    Start over
  </button>
  <button
    type="button"
    class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700"
    onclick={() => goto('/report')}
  >
    Generate report
  </button>
</div>

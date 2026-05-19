<script lang="ts">
  import { store, TOTAL_STEPS } from '$lib/stores/assessment.svelte.js';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Step01 from '$lib/components/steps/Step01Submitter.svelte';
  import Step02 from '$lib/components/steps/Step02Passenger.svelte';
  import Step03 from '$lib/components/steps/Step03Trip.svelte';
  import Step04 from '$lib/components/steps/Step04Reasons.svelte';
  import Step05 from '$lib/components/steps/Step05Physician.svelte';
  import Step06 from '$lib/components/steps/Step06Diagnosis.svelte';
  import Step07 from '$lib/components/steps/Step07Cardiovascular.svelte';
  import Step08 from '$lib/components/steps/Step08Respiratory.svelte';
  import Step09 from '$lib/components/steps/Step09RecentEvents.svelte';
  import Step10 from '$lib/components/steps/Step10Pregnancy.svelte';
  import Step11 from '$lib/components/steps/Step11Communicable.svelte';
  import Step12 from '$lib/components/steps/Step12InflightNeeds.svelte';
  import Step13 from '$lib/components/steps/Step13CabinMeds.svelte';
  import Step14 from '$lib/components/steps/Step14Summary.svelte';

  const stepComponents = [
    Step01, Step02, Step03, Step04, Step05, Step06, Step07,
    Step08, Step09, Step10, Step11, Step12, Step13, Step14,
  ];
</script>

<section class="mb-6">
  <ProgressBar current={store.currentStep} total={TOTAL_STEPS} />
  <h2 class="text-xl font-semibold">MEDIF wizard</h2>
  <p class="text-slate-700 my-3">
    Complete all 14 sections below in order. The tool computes a fitness-to-fly
    band, fired rules, and safety flags for the airline medical desk.
  </p>
</section>

<div class="space-y-8">
  {#each stepComponents as StepComponent, i (i)}
    <div id="step-{i + 1}" class="bg-white p-6 rounded-lg shadow-sm scroll-mt-20">
      <StepComponent />
    </div>
  {/each}
</div>

<div class="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-2">
  <button
    type="button"
    class="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300"
    onclick={() => store.reset()}
  >
    Reset
  </button>
</div>

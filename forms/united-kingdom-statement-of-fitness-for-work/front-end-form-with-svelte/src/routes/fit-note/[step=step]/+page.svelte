<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { STEP_TITLES, TOTAL_STEPS } from '$lib/store.svelte.js';
  import Step01Issuer from '$lib/components/steps/Step01Issuer.svelte';
  import Step02Patient from '$lib/components/steps/Step02Patient.svelte';
  import Step03Assessment from '$lib/components/steps/Step03Assessment.svelte';
  import Step04Diagnosis from '$lib/components/steps/Step04Diagnosis.svelte';
  import Step05FitnessForWork from '$lib/components/steps/Step05FitnessForWork.svelte';
  import Step06Adaptations from '$lib/components/steps/Step06Adaptations.svelte';
  import Step07Comments from '$lib/components/steps/Step07Comments.svelte';
  import Step08Period from '$lib/components/steps/Step08Period.svelte';
  import Step09FollowUp from '$lib/components/steps/Step09FollowUp.svelte';
  import Step10SignOff from '$lib/components/steps/Step10SignOff.svelte';

  const stepComponents = [
    Step01Issuer,
    Step02Patient,
    Step03Assessment,
    Step04Diagnosis,
    Step05FitnessForWork,
    Step06Adaptations,
    Step07Comments,
    Step08Period,
    Step09FollowUp,
    Step10SignOff,
  ];

  const step = $derived(Number($page.params.step));
  const StepComponent = $derived(stepComponents[step - 1]);
  const progress = $derived(Math.round((step / TOTAL_STEPS) * 100));

  function go(target: number) {
    if (target < 1 || target > TOTAL_STEPS) return;
    goto(`/fit-note/${target}`);
  }
</script>

<nav
  class="sticky top-0 z-10 -mx-4 mb-6 px-4 py-3 bg-white/95 backdrop-blur border-b border-slate-200"
  aria-label="Wizard progress"
>
  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-xs uppercase tracking-wide text-slate-500">
        Step {step} of {TOTAL_STEPS}
      </p>
      <h2 class="text-lg font-semibold text-brand-700">{STEP_TITLES[step - 1]}</h2>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        onclick={() => go(step - 1)}
        disabled={step <= 1}
      >
        Previous
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded bg-brand-600 text-white text-sm disabled:opacity-50"
        onclick={() => go(step + 1)}
        disabled={step >= TOTAL_STEPS}
      >
        Next
      </button>
    </div>
  </div>
  <div
    class="mt-2 h-1.5 w-full bg-slate-200 rounded overflow-hidden"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={progress}
  >
    <div class="h-full bg-brand-600" style="width: {progress}%"></div>
  </div>
</nav>

<div class="bg-white p-6 rounded-lg shadow-sm">
  <StepComponent />
</div>

<div class="mt-6 flex flex-wrap gap-2 text-xs">
  {#each STEP_TITLES as title, i (i)}
    <a
      href={`/fit-note/${i + 1}`}
      class="px-2 py-1 rounded border {i + 1 === step ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}"
    >
      {i + 1}. {title}
    </a>
  {/each}
</div>

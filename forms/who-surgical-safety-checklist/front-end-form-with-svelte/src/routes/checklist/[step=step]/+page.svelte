<script lang="ts">
  import { page } from '$app/stores';
  import { store } from '$lib/stores/checklist.svelte.js';
  import StepNav from '$lib/components/ui/StepNav.svelte';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import Step0CaseDetails from '$lib/components/Step0CaseDetails.svelte';
  import Step1SignIn from '$lib/components/Step1SignIn.svelte';
  import Step2TimeOut from '$lib/components/Step2TimeOut.svelte';
  import Step3SignOut from '$lib/components/Step3SignOut.svelte';
  import Step4Summary from '$lib/components/Step4Summary.svelte';

  const stepNum = $derived(Number($page.params.step));

  // Mirror URL into the store for any code that reads `store.currentStep`.
  $effect(() => {
    store.goto(stepNum);
  });

  const flags = $derived(store.flags);
</script>

<div class="bg-white p-6 rounded-lg shadow-sm">
  <StepNav current={stepNum} />

  {#if stepNum !== 4}
    <FlagBanner {flags} />
  {/if}

  {#if stepNum === 0}
    <Step0CaseDetails />
  {:else if stepNum === 1}
    <Step1SignIn />
  {:else if stepNum === 2}
    <Step2TimeOut />
  {:else if stepNum === 3}
    <Step3SignOut />
  {:else if stepNum === 4}
    <Step4Summary />
  {/if}

  <StepNav current={stepNum} />
</div>

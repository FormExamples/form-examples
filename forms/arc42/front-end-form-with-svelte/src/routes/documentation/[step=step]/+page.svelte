<script lang="ts">
  import { page } from '$app/stores';
  import Step01 from '$lib/components/steps/Step01Introduction.svelte';
  import Step02 from '$lib/components/steps/Step02Constraints.svelte';
  import Step03 from '$lib/components/steps/Step03ContextAndScope.svelte';
  import Step04 from '$lib/components/steps/Step04SolutionStrategy.svelte';
  import Step05 from '$lib/components/steps/Step05BuildingBlocks.svelte';
  import Step06 from '$lib/components/steps/Step06RuntimeView.svelte';
  import Step07 from '$lib/components/steps/Step07DeploymentView.svelte';
  import Step08 from '$lib/components/steps/Step08CrosscuttingConcepts.svelte';
  import Step09 from '$lib/components/steps/Step09ArchitecturalDecisions.svelte';
  import Step10 from '$lib/components/steps/Step10QualityRequirements.svelte';
  import Step11 from '$lib/components/steps/Step11RisksAndDebt.svelte';
  import Step12 from '$lib/components/steps/Step12Summary.svelte';

  const step = $derived(Number($page.params.step));
</script>

<div class="bg-white p-6 rounded-lg shadow-sm">
  {#if step === 1}<Step01 />
  {:else if step === 2}<Step02 />
  {:else if step === 3}<Step03 />
  {:else if step === 4}<Step04 />
  {:else if step === 5}<Step05 />
  {:else if step === 6}<Step06 />
  {:else if step === 7}<Step07 />
  {:else if step === 8}<Step08 />
  {:else if step === 9}<Step09 />
  {:else if step === 10}<Step10 />
  {:else if step === 11}<Step11 />
  {:else if step === 12}<Step12 />
  {/if}
</div>

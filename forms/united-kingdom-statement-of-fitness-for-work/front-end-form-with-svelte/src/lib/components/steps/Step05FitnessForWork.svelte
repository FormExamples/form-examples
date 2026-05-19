<script lang="ts">
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import { store } from '$lib/store.svelte.js';
  import type { FitnessForWork } from '$lib/types.js';

  const options: { value: FitnessForWork; label: string }[] = [
    { value: 'not_fit', label: 'You are not fit for work' },
    { value: 'may_be_fit', label: 'You may be fit for work taking account of the following advice' },
  ];
</script>

<section aria-labelledby="step5-heading">
  <h2 id="step5-heading" class="text-xl font-semibold mb-4">Step 5 — Fitness for work</h2>
  <p class="text-sm text-slate-600 mb-3">
    DWP policy 3.2: a fit note cannot certify a patient as "fit for work" — only
    "not fit" or "may be fit" with adaptations advice.
  </p>
  <RadioGroup
    id="fitness-for-work"
    name="fitnessForWork"
    {options}
    bind:value={store.data.fitnessForWork}
  />
</section>

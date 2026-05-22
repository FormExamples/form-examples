<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
</script>

<StepCard step={7} title="Addition for near"
  description="Always positive. Typically equal between eyes. +0.75 to +3.50 D in 0.25 D steps.">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4">
    <FormField label="Right ADD (D)">
      <input class={input} type="number" step="0.25" min="0" max="4" bind:value={store.data.rightEye.additionDiopters} />
    </FormField>
    <FormField label="Left ADD (D)">
      <input class={input} type="number" step="0.25" min="0" max="4" bind:value={store.data.leftEye.additionDiopters} />
    </FormField>
    <FormField label="Right intermediate (D)">
      <input class={input} type="number" step="0.25" min="0" max="4" bind:value={store.data.rightEye.intermediateAdditionDiopters} />
    </FormField>
    <FormField label="Left intermediate (D)">
      <input class={input} type="number" step="0.25" min="0" max="4" bind:value={store.data.leftEye.intermediateAdditionDiopters} />
    </FormField>
  </div>
</StepCard>

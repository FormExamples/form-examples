<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'input w-full';
</script>

<StepCard step={8} title="Pupillary distance" description="Millimetres. Near PD is typically distance − 3 mm.">
  <h3 class="text-sm font-semibold text-base-content/70 mt-2 mb-2">Distance</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Total (mm)"><input class={input} type="number" step="0.5" min="40" max="80" bind:value={assessment.data.pupillaryDistance.distanceTotalMm} /></FormField>
    <FormField label="Right monocular (mm)"><input class={input} type="number" step="0.5" min="20" max="45" bind:value={assessment.data.pupillaryDistance.distanceRightMm} /></FormField>
    <FormField label="Left monocular (mm)"><input class={input} type="number" step="0.5" min="20" max="45" bind:value={assessment.data.pupillaryDistance.distanceLeftMm} /></FormField>
  </div>
  <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Near</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Total (mm)"><input class={input} type="number" step="0.5" min="40" max="80" bind:value={assessment.data.pupillaryDistance.nearTotalMm} /></FormField>
    <FormField label="Right monocular (mm)"><input class={input} type="number" step="0.5" min="20" max="45" bind:value={assessment.data.pupillaryDistance.nearRightMm} /></FormField>
    <FormField label="Left monocular (mm)"><input class={input} type="number" step="0.5" min="20" max="45" bind:value={assessment.data.pupillaryDistance.nearLeftMm} /></FormField>
  </div>
  <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Segment height (for bifocal / varifocal)</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Right (mm)"><input class={input} type="number" step="0.5" min="10" max="35" bind:value={assessment.data.pupillaryDistance.segmentHeightRightMm} /></FormField>
    <FormField label="Left (mm)"><input class={input} type="number" step="0.5" min="10" max="35" bind:value={assessment.data.pupillaryDistance.segmentHeightLeftMm} /></FormField>
  </div>
</StepCard>

<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import StepCard from '#lib/components/ui/StepCard.svelte';
  import FormField from '#lib/components/ui/FormField.svelte';
  const input = 'input w-full';
</script>

<StepCard step={4} title="Visual acuity" description="Snellen (e.g. 6/6, 6/12) and dominant eye.">
  <h3 class="text-sm font-semibold text-base-content/70 mt-2 mb-2">Distance</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Right unaided"><input class={input} type="text" placeholder="6/12" bind:value={assessment.data.visualAcuity.distanceRightUnaided} /></FormField>
    <FormField label="Left unaided"><input class={input} type="text" placeholder="6/12" bind:value={assessment.data.visualAcuity.distanceLeftUnaided} /></FormField>
    <FormField label="Binocular unaided"><input class={input} type="text" bind:value={assessment.data.visualAcuity.distanceBinocularUnaided} /></FormField>
    <FormField label="Right corrected"><input class={input} type="text" placeholder="6/6" bind:value={assessment.data.visualAcuity.distanceRightCorrected} /></FormField>
    <FormField label="Left corrected"><input class={input} type="text" placeholder="6/6" bind:value={assessment.data.visualAcuity.distanceLeftCorrected} /></FormField>
    <FormField label="Binocular corrected"><input class={input} type="text" bind:value={assessment.data.visualAcuity.distanceBinocularCorrected} /></FormField>
  </div>
  <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Near</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Right unaided"><input class={input} type="text" placeholder="N5" bind:value={assessment.data.visualAcuity.nearRightUnaided} /></FormField>
    <FormField label="Left unaided"><input class={input} type="text" bind:value={assessment.data.visualAcuity.nearLeftUnaided} /></FormField>
    <FormField label="Binocular unaided"><input class={input} type="text" bind:value={assessment.data.visualAcuity.nearBinocularUnaided} /></FormField>
    <FormField label="Right corrected"><input class={input} type="text" bind:value={assessment.data.visualAcuity.nearRightCorrected} /></FormField>
    <FormField label="Left corrected"><input class={input} type="text" bind:value={assessment.data.visualAcuity.nearLeftCorrected} /></FormField>
    <FormField label="Binocular corrected"><input class={input} type="text" bind:value={assessment.data.visualAcuity.nearBinocularCorrected} /></FormField>
  </div>
  <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Other</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4">
    <FormField label="Pinhole right"><input class={input} type="text" bind:value={assessment.data.visualAcuity.pinholeRight} /></FormField>
    <FormField label="Pinhole left"><input class={input} type="text" bind:value={assessment.data.visualAcuity.pinholeLeft} /></FormField>
    <FormField label="Dominant eye">
      <select class={input} bind:value={assessment.data.visualAcuity.dominantEye}>
        <option value="">—</option>
        <option value="right">Right</option>
        <option value="left">Left</option>
        <option value="none">None / unclear</option>
      </select>
    </FormField>
  </div>
</StepCard>

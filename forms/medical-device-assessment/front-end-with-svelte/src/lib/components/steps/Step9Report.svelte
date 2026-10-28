<script lang="ts">
  import Alert from '#lib/components/ui/Alert.svelte';
  import { STEPS } from '#lib/config/steps.js';
  import { classLabel } from '#lib/engine/utils.js';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import StepSection from './StepSection.svelte';

  const live = $derived(assessment.result);
</script>

<StepSection def={STEPS[8]}>
  <Alert type="info" role="status" class="mb-4">
    {#if live.computedDeviceClass}
      Computed class: {classLabel(live.computedDeviceClass)}. Determining rule {live.determiningRule}.
    {:else}
      Computed class: not yet determined. Complete the intended purpose and device kind (steps 2 and
      3).
    {/if}
  </Alert>
</StepSection>

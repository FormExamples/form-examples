<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import EyeRefractionFields from './EyeRefractionFields.svelte';
</script>

<StepCard step={6} title="Left eye refraction (OS)">
  <EyeRefractionFields bind:eye={assessment.data.leftEye} />
</StepCard>

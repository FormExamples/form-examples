<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import EyeRefractionFields from './EyeRefractionFields.svelte';
</script>

<StepCard step={6} title="Left eye refraction (OS)">
  <EyeRefractionFields bind:eye={store.data.leftEye} />
</StepCard>

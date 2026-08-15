<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import StepCard from '#lib/components/ui/StepCard.svelte';
  import EyeRefractionFields from './EyeRefractionFields.svelte';
</script>

<StepCard step={5} title="Right eye refraction (OD)"
  description="Minus-cylinder convention. Sphere -30 to +30, cylinder -10 to 0, axis 1–180.">
  <EyeRefractionFields bind:eye={assessment.data.rightEye} />
</StepCard>

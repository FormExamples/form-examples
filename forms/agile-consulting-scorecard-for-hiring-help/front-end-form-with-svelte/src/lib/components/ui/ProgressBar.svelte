<script lang="ts">
  // ProgressBar — Lily Svelte headless contract (emits class="progress").
  import { assessment, TOTAL_STEPS } from '$lib/stores/assessment.svelte';

  const pct = $derived(Math.round((assessment.currentStep / TOTAL_STEPS) * 100));
</script>

<div class="field" aria-label="Wizard progress">
  <span class="hint">Step {assessment.currentStep} of {TOTAL_STEPS}</span>
  <progress
    class="progress"
    value={pct}
    max="100"
    aria-valuenow={pct}
    aria-valuemin="0"
    aria-valuemax="100"
  ></progress>
</div>
